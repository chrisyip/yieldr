/* global describe: false, it: false */

/* jshint -W124 */

var assert = require('assert')

var yieldr = require('..')

describe('yieldr()', function () {
  it('should return promise', function () {
    var ret = yieldr(function () {
      var foo = 'foo'
      var bar = 'bar'
      return foo + bar
    })

    assert.equal(ret.constructor, Promise)
    assert.equal(typeof ret.then, 'function')
    assert.equal(typeof ret.catch, 'function')
  })

  it('should pass return result to then', function (done) {
    function* bar () {
      return Promise.resolve('bar')
    }

    yieldr(function* () {
      var foo = yield 'foo'

      return foo + (yield bar())
    }).then(function (res) {
      assert.equal(res, 'foobar')
      done()
    })
  })
})

describe('yieldr(fn)', function () {
  it('should run functions', function (done) {
    yieldr(function () {
      var foo = 'foo'
      var bar = 'bar'
      return foo + bar
    }).then(function (res) {
      assert.equal(res, 'foobar')
      done()
    })
  })

  it('should catch errors', function (done) {
    yieldr(function () {
      throw Error('Oops')
    }).catch(function (error) {
      assert.equal(error.constructor, Error)
      assert.equal(error.message, 'Oops')
      done()
    })
  })
})

describe('yieldr(fn*)', function () {
  it('should run generator functions', function (done) {
    yieldr(function* () {
      done()
    })
  })

  it('should yield normal types', function (done) {
    yieldr(function* () {
      assert.equal(yield 1, 1)
      assert.equal(yield true, true)
      assert.equal(yield 'foo', 'foo')
      assert.equal(yield undefined, undefined)
      assert.equal(yield null, null)

      var obj = {}
      assert.equal(yield obj, obj)

      var fn = function () {}
      assert.equal(yield fn, fn)

      var arr = ['foo', 'bar']
      assert.deepEqual(yield arr, arr)
    }).then(function () {
      done()
    })
  })

  it('should yield generators and generator functions', function (done) {
    function* foo () {
      var _foo = yield 'foo'
      return _foo + 'bar'
    }

    yieldr(function* () {
      var foobar = yield foo()

      var bar = yield function* () {
        return yield 'bar'
      }

      assert.equal(foobar, 'foobar')
      assert.equal(bar, 'bar')
    }).then(function () {
      done()
    })
  })

  it('should yield promises', function (done) {
    function* foo () {
      var _foo = yield Promise.resolve('foo')
      return _foo + 'bar'
    }

    function bar () {
      return Promise.resolve('bar')
    }

    yieldr(function* () {
      var foobar = yield foo()

      var _bar = yield bar()

      var arr = yield Promise.resolve(['foo', 'bar'])

      assert.equal(foobar, 'foobar')
      assert.equal(_bar, 'bar')
      assert.deepEqual(arr, ['foo', 'bar'])
    }).then(function () {
      done()
    })
  })

  it('should catch errors', function (done) {
    yieldr(function* () {
      throw Error('Oops')
    }).catch(function (error) {
      assert.equal(error.constructor, Error)
      assert.equal(error.message, 'Oops')
      done()
    })
  })
})

describe('yieldr.wrap()', function () {
  it('should pass context and arguments', function (done) {
    var ctx = {
      name: 'John'
    }

    var args = ['foo', 'bar']

    yieldr.wrap(function* (foo, bar) {
      assert.equal(this, ctx)
      assert.deepEqual([foo, bar], args)
      done()
    }).apply(ctx, args)
  })
})
