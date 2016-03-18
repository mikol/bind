(function (context) {
// -----------------------------------------------------------------------------

'use strict';

var id = '';
var dependencies = ['../polyfill', 'actually', 'actually/throws', 'criteria'];

function factory(bind, actually, throws) {
  scope('`Function.prototype.bind()` Polyfill Tests',
  function () {
    var _bind;
    var array = [2, 3, 5, 7, 11, 13, 17, 23, 29];
    var object = {property: {}};

    function getProperty() {
      /* jshint -W040 */
      return this.property;
      /* jshint +W040 */
    }

    function getPropertyByName(name) {
      /* jshint -W040 */
      return this[name];
      /* jshint +W040 */
    }

    function Constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    scope.before(function () {
      _bind = Function.prototype.bind;
      Function.prototype.bind = bind;
    });

    scope.after(function () {
      Function.prototype.bind = _bind;
    });

    test('Bind to object.', function () {
      var f = getProperty.bind(object);
      actually(f() === object.property);
    });

    test('Bind partial to object.', function () {
      var f = getPropertyByName.bind(object, 'property');
      actually(f() === object.property);
    });

    test('Bind to function.', function () {
      var f = [].slice.call.bind([].slice);
      var a = f(array);

      actually(function (aSize, arraySize, aItem, arrayItem) {
        return aSize === arraySize && aItem === arrayItem && a !== array;
      }, a.length, array.length, a[0], array[0]);
    });

    test('Bind to function to create a partial.',
    function () {
      var f = [].slice.call.bind([].slice, array, 1);
      var a = f();

      actually(function (aSize, arraySize, aItem, arrayItem) {
        return aSize < arraySize && aItem === arrayItem;
      }, a.length, array.length, a[0], array[1]);
    });

    test('Call partial with additional arguments.',
    function () {
      var f = [].slice.call.bind([].slice, array, 1);
      var a = f(3);

      actually(function (aSize, aItem1, arrayItem1, aItem2, arrayItem2) {
        return aSize === 2 && aItem1 === arrayItem1 && aItem2 === arrayItem2;
      }, a.length, a[0], array[1], a[1], array[2]);
    });

    test('Try to bind to uncallable.', function () {
      actually(throws, TypeError, '`this` is not callable.', function () {
        Function.prototype.bind.call({});
      });
    });

    test('Make a partial constructor.',
    function () {
      var PartialConstructor = Constructor.bind({}, 13);
      var object = new PartialConstructor(29);
      var object2 = new PartialConstructor(29);

      actually(function (x, y) {
        return x === 13 && y === 29;
      }, object.x, object.y);

      actually(function (obj, ctor) {
        return obj instanceof ctor;
      }, object, Constructor);
    });

    test('Partial constructors instantiate unique objects.',
    function () {
      var PartialConstructor = Constructor.bind({}, 13);
      var object = new PartialConstructor(29);
      var object2 = new PartialConstructor(29);

      actually(function (obj, obj2) {
        return obj.x === obj2.x && obj.y === obj2.y && obj !== obj2;
      }, object, object2);
    });
  });
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
