# Object helpers

* [uber.isFunction](#isFunction)
* [uber.isArray](#isArray)
* [uber.isString](#isString)
* [uber.isNumber](#isNumber)
* [uber.isRegExp](#isRegExp)
* [uber.hasKey](#hasKey)
* [uber.keys](#keys)
* [uber.forIn](#forIn)
* [uber.mixin](#mixin)
* [uber.create](#create)

### Requires
* src/array.js
* src/function.js

## <a name="isFunction">uber.isFunction(obj)</a>
Determines if an object is a `Function`.

### Arguments
1. `obj` (Object): The object to test.

### Returns
Boolean


## <a name="isArray">uber.isArray(obj)</a>
Determines if an object is an `Array`.

### Arguments
1. `obj` (Object): The object to test.

### Returns
Boolean


## <a name="isString">uber.isString(obj)</a>
Determines if an object is a `String`.

### Arguments
1. `obj` (Object): The object to test.

### Returns
Boolean


## <a name="isNumber">uber.isNumber(obj)</a>
Determines if an object is a `Number`.

### Arguments
1. `obj` (Object): The object to test.

### Returns
Boolean


## <a name="isRegExp">uber.isRegExp(obj)</a>
Determines if an object is a `RegExp`.

### Arguments
1. `obj` (Object): The object to test.

### Returns
Boolean


## <a name="hasKey">uber.hasKey(obj, prop)</a>
Determines if an object has a property.  Analogous to `Object.prototype.hasOwnProperty`.  WARNING: Do not use this on DOM classes as it may throw an error \(See [Mozilla bug #375344][1]\).

### Arguments
1. `obj` (Object): The object to test.
2. `prop` (String): The property to test for.

### Returns
Boolean


## <a name="keys">uber.keys(obj)</a>
Retrieves a list of all enumerable properties of an Object.  Analogous to `Object.keys` in ES5.

### Arguments
1. `obj` (Object): The object to retrieve properties for.

### Returns
Array


## <a name="forIn">uber.forIn(target, callback, *thisArg*)</a>
Calls `callback` for each enumerable property of `target`.  This is similar to [`uber.forEach`][2], but for enumerable properties of an object.

### Arguments
1. `target` (Object): The object to traverse.
2. `callback` (Function): A function to run on each enumerable property of `target`.
> #### Arguments
> 1. `value` (Object): The value of the property of `target`.
> 2. `property` (String): The property of `value` within `arr`.
> 3. `obj` (Object): The object being traversed.  This is `target`.

3. `thisArg` (Object, *optional*): The scope to run `callback` in.


## <a name="mixin">uber.mixin(target, source)</a>
Adds properties from one object to another.  Similar to `Object.defineProperties` in ES5 (`source` is different in this implementation).

### Arguments
1. `target` (Object): The object to add properties to.
2. `source` (Object): The object to get properties from.

### Returns
`target` (Object)


## <a name="create">uber.create(obj, *props*)</a>
Create a new object with a specified prototype.  Similar to `Object.create` in ES5 (`props` is different in this implementation).

### Arguments
1. `obj` (Object): The object to use as the specified prototype.
2. `props` (Object, *optional*): This object's properties will be added to the new object.

### Returns
Object


[1]: https://bugzilla.mozilla.org/show_bug.cgi?id=375344
[2]: array.md#forEach
