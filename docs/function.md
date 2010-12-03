# Function helpers

### Requires
* src/array.js

## uber.bind(func, scope, *arg1*, ...)
Bind a function to an object so it will always run with the object as its scope.  If the implementation provides it, this will use `Function.prototype.bind`.

### Arguments
1. `func` (Function): The function to bind an object to.
2. `scope` (Object): The object to use as the scope when calling `func`.
3. `arg1` (Object, optional): Any arguments after `scope` are passed to `func` as beginning arguments.

### Returns
Function


## uber.curry(func, *arg1*, ...)

### Arguments
1. `func` (Function):
2. `arg1` (Object, optional): Any arguments after `func` are passed to `func` as beginning arguments.

### Returns
Function
