(function (context) {
// -----------------------------------------------------------------------------

'use strict';

var id = '';
var dependencies = [];

function factory() {
  return function bind(self) {
    var f = this;

    if (f && f.apply) {
      var Ctor = function () {};

      for (var a = [], x = 1, n = arguments.length; x < n; ++x) {
        a[x - 1] = arguments[x];
      }

      var fn = function () {
        for (var b = a.slice(), x = 0, n = arguments.length; x < n; ++x) {
          b.push(arguments[x]);
        }

        // Use the native `this` object if `fn()` is used as a constructor.
        return f.apply(this instanceof Ctor ? this : self, b);
      };

      if (f.prototype) {
        Ctor.prototype = f.prototype;
      }

      fn.prototype = new Ctor();

      return fn;
    } else {
      throw new TypeError('Function.prototype.bind(): `this` is not callable.');
    }
  };
}

// -----------------------------------------------------------------------------
var n = dependencies.length;
var o = 'object';
var r = /([^-_\s])[-_\s]+([^-_\s])/g;
function s(m, a, b) { return a + b.toUpperCase(); }
context = typeof global === o ? global : typeof window === o ? window : context;
if (typeof define === 'function' && define.amd) {
  define(dependencies, function () {
    return factory.apply(context, [].slice.call(arguments));
  });
} else if (typeof module === o && module.exports) {
  for (; n--;) { dependencies[n] = require(dependencies[n]); }
  module.exports = factory.apply(context, dependencies);
} else {
  for (; n--;) { dependencies[n] = context[dependencies[n]]; }
  context[id.replace(r, s)] = factory.apply(context, dependencies);
}
}(this));
