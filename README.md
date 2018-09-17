# spool-repl

[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build Status][ci-image]][ci-url]
[![Test Coverage][coverage-image]][coverage-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Follow @FabrixApp on Twitter][twitter-image]][twitter-url]

[REPL](https://nodejs.org/api/repl.html) Spool. Adds an interactive shell to your Fabrix app to help with
development and debugging. Saves command history between sessions.

## Install
```sh
$ npm install @fabrix/spool-repl --save
```

## Usage
The repl spool is loaded in your spool config per usual.

```js
// config/main.ts
import { REPLSpool } from '@fabrix/spool-repl'
export const main = {
  // ...
  spools: [
    // ...
    REPLSpool
  ]
}
```

```js
// config/repl.ts
export const repl = {
  /**
   * REPL is disabled automatically if no text terminal is available. Set
   * to "true" to override this behavior.
   */
  allowNoTTY: false
}
```

## Shell Commands
With the [REPL Spool](https://github.com/fabrix-app/spool-repl) you can test your REST API directly from the interactive shell.

### GET 
`get("/api/v1/default/info")`

### HEAD 
`head("/api/v1/default/info")`

### OPTIONS 
`options("/api/v1/default/info")`

### POST
`post("/api/v1/default/info", {some : 'data'})`

If you want to simulate some HTML form you can do : 

`post("/api/v1/default/info", 'some=data', 'application/x-www-form-urlencoded')`
### PUT 
`put("/api/v1/default/info", {some : 'data'})`

If you want to simulate some HTML form you can do : 

`put("/api/v1/default/info", 'some=data', 'application/x-www-form-urlencoded')`

### PATCH 
`patch("/api/v1/default/info", {some : 'data'})`

### DELETE 
`delete("/api/v1/default/info")`

By default headers are `{'Accept': 'application/json'}` but they can be modified by adding an extra param of each method like this :

```
get("/api/v1/default/info", {'Accept': 'text/xml'})
head("/api/v1/default/info", {'Accept': 'text/xml'})
options("/api/v1/default/info", 'some=data', 'application/x-www-form-urlencoded', {'Accept': 'text/xml'})
post("/api/v1/default/info", 'some=data', 'application/x-www-form-urlencoded', {'Accept': 'text/xml'})
put("/api/v1/default/info", 'some=data', 'application/x-www-form-urlencoded', {'Accept': 'text/xml'})
patch("/api/v1/default/info", 'some=data', 'application/x-www-form-urlencoded', {'Accept': 'text/xml'})
delete("/api/v1/default/info", 'some=data', 'application/x-www-form-urlencoded', {'Accept': 'text/xml'})
```

## Contributing
We love contributions! Please check out our [Contributor's Guide](https://github.com/fabrix-app/fabrix/blob/master/.github/CONTRIBUTING.md) for more
information on how our projects are organized and how to get started.

## License
[MIT](https://github.com/fabrix-app/spool-repl/blob/master/LICENSE)

[npm-image]: https://img.shields.io/npm/v/@fabrix/spool-repl.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@fabrix/spool-repl
[ci-image]: https://img.shields.io/circleci/project/github/fabrix-app/spool-repl/master.svg
[ci-url]: https://circleci.com/gh/fabrix-app/spool-repl/tree/master
[daviddm-image]: http://img.shields.io/david/fabrix-app/spool-repl.svg?style=flat-square
[daviddm-url]: https://david-dm.org/fabrix-app/spool-repl
[gitter-image]: http://img.shields.io/badge/+%20GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat-square
[gitter-url]: https://gitter.im/fabrix-app/fabrix
[twitter-image]: https://img.shields.io/twitter/follow/FabrixApp.svg?style=social
[twitter-url]: https://twitter.com/FabrixApp
[coverage-image]: https://img.shields.io/codeclimate/coverage/github/fabrix-app/spool-repl.svg?style=flat-square
[coverage-url]: https://codeclimate.com/github/fabrix-app/spool-repl/coverage
