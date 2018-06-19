import { writeFileSync, statSync, readFileSync } from 'fs'
import { resolve } from 'path'
import * as repl from 'repl'

import { ToolSpool } from '@fabrix/fabrix/dist/common/spools/tool'

import { Inspect } from './inspect'
import { Http } from './http'

import * as config from './config/index'
import * as pkg from '../package.json'

/**
 * @class REPL
 *
 * Provide an interactive Javascript shell for Fabrix applications
 *
 * @see {@link https://nodejs.org/api/repl.html#repl_repl}
 */
export class REPLSpool extends ToolSpool {
  public server
  public historyFile

  constructor(app) {
    super(app, {
      config: config,
      pkg: pkg,
      api: {}
    })
  }

  validate() {

  }

  configure() {
    Inspect.configureApp(this.app)
    Inspect.configureApi(this.app.api)
    Inspect.configureSpools(this.app.spools)
    Http.init(this.app)

    if (!this.config.historyFileName) {
      this.config.historyFileName = (process.env.NODE_REPL_HISTORY || '.node_repl_history').toString()
    }

    if (!this.config.historySize) {
      this.config.historySize = Number(process.env.NODE_REPL_HISTORY_SIZE || 1000)
    }

    this.historyFile = resolve(
      this.app.config.get('main.paths.temp'),
      this.config.historyFileName
    )

    this.app.log.debug('historyFile', this.historyFile)
  }

  async initialize() {
    // https://nodejs.org/api/process.html#process_tty_terminals_and_process_stdout
    if (!process.stdout.isTTY) {
      this.app.log.info('spool-repl: No text terminal available. ')

      if (!this.app.config.get('repl.allowNoTTY')) {
        this.app.log.info('spool-repl: REPL not started. Continuing.')
        this.app.log.debug('spool-repl: Set config.repl.allowNoTTY=true to override')
        return
      }
      else {
        this.app.log.warn('spool-repl: allowNoTTY is enabled, Launching REPL anyway.')
      }
    }

    try {
      const replOptions = {
        prompt: '',
        useColors: true,
        replMode: process.env.REPL_MODE_STRICT, // repl.REPL_MODE_STRICT not documented in node.
        historySize: this.config.historySize
      }

      this.server = repl.start(replOptions)
      this.server.pause()
      this.app.once('fabrix:ready', () => {
        // green prompt
        this.server.setPrompt('\u001b[1;32mfabrix > \u001b[0m')
        this.server.resume()
        this.server.write('', { name: 'return' })
      })
    }
    catch (e) {
      this.app.log.error(e)
      this.app.log.warn('spool-repl: Disabling REPL.')
      return
    }

    try {
      statSync(this.historyFile)
      readFileSync(this.historyFile).toString()
        .split('\n')
        .reverse()
        .slice(0, this.config.historySize)
        .filter(line => line.trim())
        .map(line => this.server.history.push(line))
    }
    catch (e) {
      this.app.log.silly('Could not read REPL history file at', this.historyFile)
      this.app.log.silly('No problem, a history file will be created on shutdown')
    }

    this.server.once('exit', () => {
      this.app.stop().then(() => process.exit())
    })

    this.server.context.app = this.app

    // TODO https://github.com/fabrix-app/spool-repl/issues/33
    this.server.context.get = Http.get.bind(Http)
    this.server.context.post = Http.post.bind(Http)
    this.server.context.put = Http.put.bind(Http)
    this.server.context.delete = Http.delete.bind(Http)
    this.server.context.patch = Http.patch.bind(Http)
    this.server.context.head = Http.head.bind(Http)
    this.server.context.options = Http.options.bind(Http)
  }

  addCommand(command, handler) {
    if (this.server) {
      this.server.context[command] = handler
    }
  }

  async unload() {
    if (!process.stdout.isTTY && !this.app.config.get('repl.allowNoTTY')) {
      return
    }

    this.server.removeAllListeners('exit')
    this.server.close()

    try {
      const lines = (this.server.history || [])
        .reverse()
        .filter(line => line.trim())
        .join('\n')

      writeFileSync(this.historyFile, lines)
    }
    catch (e) {
      this.app.log.debug(e)
      this.app.log.warn('Could not create REPL history file at', this.historyFile)
      this.app.log.warn('This is strange, but not fatal. Set loglevel to "debug" for more info')
    }

    Inspect.unconfigureApp(this.app)
    Inspect.unconfigureApi(this.app.api)
    Inspect.unconfigureSpools(this.app.spools)
  }
}

