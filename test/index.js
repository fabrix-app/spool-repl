const assert = require('assert')
const FabrixApp = require('@fabrix/fabrix').FabrixApp

before(() => {
  global.app = new FabrixApp(require('./app'))
  return global.app.start()
})

describe('Fabrix App', () => {
  it('should load', () => {
    assert(global.app)
  })
})

describe('REPL', () => {
  describe('history', () => {
    let repl
    before(() => {
      repl = global.app.spools.repl.server
    })
    it('type property should be "tool"', () => {
      assert.equal(global.app.spools.repl.constructor.type, 'tool')
    })
    it('should load history from historyFile', () => {
      assert.equal(repl.history.length, 3)
      assert.equal(repl.history[2], 'var a = 1')
      assert.equal(repl.history[1], 'var b = 1')
      assert.equal(repl.history[0], 'var c = 1')
    })
  })

})

after(() => {
  return global.app.stop()
})
