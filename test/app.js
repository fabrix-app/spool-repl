const path = require('path')

module.exports = {
  pkg: {
    name: 'repl-spool-test'
  },
  api: {},
  config: {
    repl: {
      allowNoTTY: true
    },
    main: {
      spools: [
        require('../dist').REPLSpool
      ],
      paths: {
        temp: path.resolve(__dirname)
      }
    }
  }
}

