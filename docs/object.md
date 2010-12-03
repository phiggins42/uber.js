# Object helpers

### Requires
* src/array.js
* src/function.js

## uber.isFunction(obj)
Determines if an object is a `Function`.

### Arguments
1. `obj` (Object): The object to test.

### Returns
Boolean


## uber.isArray(obj)
Determines if an object is an `Array`.

### Arguments
1. `obj` (Object): The object to test.

### Returns
Boolean


## uber.isString(obj)
Determines if an object is a `String`.

### Arguments
1. `obj` (Object): The object to test.

### Returns
Boolean


## uber.isNumber(obj)
Determines if an object is a `Number`.

### Arguments
1. `obj` (Object): The object to test.

### Returns
Boolean


## uber.isRegExp(obj)
Determines if an object is a `RegExp`.

### Arguments
1. `obj` (Object): The object to test.

### Returns
Boolean


## uber.hasKey(obj, prop)
Determines if an object has a property.  Analogous to `Object.prototype.hasOwnProperty`.  WARNING: Do not use this on DOM classes as it may throw an error \(See [Mozilla bug #375344][1]\).

### Arguments
1. `obj` (Object): The object to test.
2. `prop` (String): The property to test for.

### Returns
Boolean


## uber.keys(obj)
Retrieves a list of all enumerable properties of an Object.  Analogous to `Object.keys` in ES5.

### Arguments
1. `obj` (Object): The object to retrieve properties for.

### Returns
Array


## uber.forIn(target, callback, *thisArg*)
Calls `callback` for each enumerable property of `target`.  This is similar to `uber.forEach`, but for enumerable properties of an object.

### Arguments
1. `target` (Object): The object to traverse.
2. `callback` (Function): A function to run on each enumerable property of `target`.
> #### Arguments
> 1. `value` (Object): The value of the property of `target`.
> 2. `property` (String): The property of `value` within `arr`.
> 3. `obj` (Object): The object being traversed.  This is `target`.

3. `thisArg` (Object, *optional*): The scope to run `callback` in.


## uber.mixin(target, source)
Adds properties from one object to another.  Similar to `Object.defineProperties` in ES5 (`source` is different in this implementation).

### Arguments
1. `target` (Object): The object to add properties to.
2. `source` (Object): The object to get properties from.

### Returns
`target` (Object)


## uber.create(obj, *props*)
Create a new object with a specified prototype.  Similar to `Object.create` in ES5 (`props` is different in this implementation).

### Arguments
1. `obj` (Object): The object to use as the specified prototype.
2. `props` (Object, *optional*): This object's properties will be added to the new object.

### Returns
Object


[1]: https://bugzilla.mozilla.org/show_bug.cgi?id=375344
