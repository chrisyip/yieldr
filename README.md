# yieldr

[![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Travis CI][travis-image]][travis-url] [![Coveralls][coveralls-image]][coveralls-url]

# Installation

```shell
npm install yieldr
```

# Usage

```js
var yieldr = require('yieldr')

function* bar () {
  return Promise.resolve('bar')
}

yieldr(function* () {
  var foo = yield 'foo'
  var bar = yield bar()

  return foo + bar
}).then(function (res) {
  console.log(res) // 'foobar'
})
```

# Compatibility

`yieldr` requires `Promise`, you should use node `>=0.11.9` or include a polyfill (try [bluebird](https://www.npmjs.com/package/bluebird)).

# Contributors

Via [GitHub](https://github.com/chrisyip/yieldr/graphs/contributors)

[npm-url]: https://npmjs.org/package/yieldr
[npm-image]: http://img.shields.io/npm/v/yieldr.svg?style=flat-square
[daviddm-url]: https://david-dm.org/chrisyip/yieldr
[daviddm-image]: http://img.shields.io/david/chrisyip/yieldr.svg?style=flat-square
[travis-url]: https://travis-ci.org/chrisyip/yieldr
[travis-image]: http://img.shields.io/travis/chrisyip/yieldr.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/chrisyip/yieldr
[coveralls-image]: http://img.shields.io/coveralls/chrisyip/yieldr.svg?style=flat-square
