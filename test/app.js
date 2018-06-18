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
        require('../dist').REPL // spool-repl
      ],
      paths: {
        temp: path.resolve(__dirname)
      }
    }
  }
}

