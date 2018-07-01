import { FabrixApp } from '@fabrix/fabrix'
import { Spool } from '@fabrix/fabrix/dist/common'
import * as createConsoleTree from 'big-tree-cli'

import { TreeBuilder } from './'

export const Inspect = {

  configureSpools (spools: {[key: string]: Spool} = { }) {
    Object.defineProperty(spools, 'inspect', {
      enumerable: false,
      configurable: true,
      value () {
        return createConsoleTree(TreeBuilder.getSpoolTree(spools))
      }
    })

    Object.entries(spools).forEach(([ spoolName, spool ]) => {
      Object.defineProperty(spool, 'inspect', {
        enumerable: false,
        configurable: true,
        value () {
          return `
        ---------------------------------------------------------------
          Spool:
            Name            : ${spool.name}
            Version         : ${spool.pkg.version}
            Description     : ${spool.pkg.description}
        ---------------------------------------------------------------`
        }
      })
    })
  },

  unconfigureSpools (spools: {[key: string]: Spool} = { }) {
    delete spools.inspect
    Object.entries(spools).forEach(([ spoolName, spool ]) => delete (spool as any).inspect)
  },

  configureApi (api) {
    if (api.hasOwnProperty('controllers')) {
      Object.defineProperty(api.controllers, 'inspect', {
        enumerable: false,
        configurable: true,
        value() {
          return createConsoleTree(TreeBuilder.getControllerTree(api.controllers))
        }
      })
    }
    if (api.hasOwnProperty('services')) {
      Object.defineProperty(api.services, 'inspect', {
        enumerable: false,
        configurable: true,
        value() {
          return createConsoleTree(TreeBuilder.getServiceTree(api.services))
        }
      })
    }
    if (api.hasOwnProperty('models')) {
      Object.defineProperty(api.models, 'inspect', {
        enumerable: false,
        configurable: true,
        value() {
          return createConsoleTree(TreeBuilder.getModelTree(api.models))
        }
      })
    }
    if (api.hasOwnProperty('resolvers')) {
      Object.defineProperty(api.resolvers, 'inspect', {
        enumerable: false,
        configurable: true,
        value() {
          return createConsoleTree(TreeBuilder.getResolverTree(api.resolvers))
        }
      })
    }
    if (api.hasOwnProperty('policies')) {
      Object.defineProperty(api.policies, 'inspect', {
        enumerable: false,
        configurable: true,
        value() {
          return createConsoleTree(TreeBuilder.getPoliciesTree(api.policies))
        }
      })
    }
    Object.defineProperty(api, 'inspect', {
      enumerable: false,
      configurable: true,
      value () {
        return createConsoleTree(TreeBuilder.getApiTree(api))
      }
    })
  },

  unconfigureApi (api) {
    Object.keys(api).forEach(resource => {
      if (api[resource].hasOwnProperty('inspect')) {
        delete api[resource].inspect
      }
    })
    delete api.inspect
  },

  configureApp (app: FabrixApp) {

    const resources = (app.resources || []).map(resource => {
      let prefix = resource.charAt(0).toUpperCase() + resource.slice(1)
      while (prefix.length < 17) { prefix = prefix + ' '}
      return `${ prefix } : ${Object.keys(app.api[resource] || {})}`
    }).join('\n            ')

    Object.defineProperty(app, 'inspect', {
      enumerable: false,
      configurable: true,
      value () {
        return `
        ---------------------------------------------------------------
          Basic Info
            Name              : ${app.pkg.name}
            Version           : ${app.pkg.version}
            Environment       : ${process.env.NODE_ENV}

          API Info
            Resources         : ${app.resources || []}
            ${ resources }
        ---------------------------------------------------------------
      `
      }
    })
  },

  unconfigureApp (app: FabrixApp) {
    delete (app as any).inspect
  }
}

