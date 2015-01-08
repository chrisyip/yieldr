// Inspired by https://www.promisejs.org/generators/
function runGenerator (makeGenerator) {
  return function (thisArg, args) {
    var generator = makeGenerator.apply(thisArg, args)

    function handle (result, gen) {
      var value = result.value

      if (value != null) {
        if (value.constructor.name === 'GeneratorFunctionPrototype') {
          value = handle(value.next(), value)
        } else if (value.constructor.name === 'GeneratorFunction') {
          value = runGenerator(value)(thisArg, args)
        }
      }

      if (result.done) {
        return Promise.resolve(value)
      }

      return Promise.resolve(value).then(function (res) {
        return handle(gen.next(res), gen)
      }, function (err){
        return handle(gen.throw(err), gen)
      })
    }

    try {
      return handle(generator.next(), generator)
    } catch (ex) {
      return Promise.reject(ex)
    }
  }
}

function calling (func, thisArg, args) {
  if (typeof func !== 'function') {
    return Promise.resolve(func)
  }

  var ctx = thisArg == null ? this : thisArg

  return func.constructor.name === 'GeneratorFunction' ?
          runGenerator(func)(ctx, args) : new Promise(function (res, rej) {
            try {
              res(func.apply(ctx, args))
            } catch (ex) {
              rej(ex)
            }
          })
}

Object.defineProperty(calling, 'wrap', {
  enumerable: true,
  value: function (func) {
    return function () {
      return calling(func, this, arguments)
    }
  }
})

module.exports = calling
