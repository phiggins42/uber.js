# Promises

### Requires
* src/array.js
* src/function.js
* src/object.js

## uber.Promise()
A generic interface for promises.  For an implementation, see [`uber.Deferred`][1].

### Methods

> #### then(resolvedCb, *errorCb*, *progressCb*)
> This method is not implemented and must be implemented by anything inheriting from `uber.Promise`.
> 
> ##### Arguments
> 1. `resolvedCb` (Function):
> > ###### Arguments
> > 1. `result` (Object):
> 
> 2. `errorCb` (Function, *optional*):
> > ###### Arguments
> > 1. `error` (Error):
> 
> 3. `progressCb` (Function, *optional*):
> > ###### Arguments
> > 1. `update` (Object):
> 
> ##### Returns
> `uber.Promise`


## uber.when(promiseOrValue, callback, *errback*, *progressHandler*)

### Arguments
1. `promiseOrValue` (`uber.Promise` or Object):
2. `callback` (Function):
3. `errback` (Function, *optional*):
4. `progressHandler` (Function, *optional*):

### Returns
If `promiseOrValue` is an instance of `uber.Promise`, an `uber.Promise`.  Otherwise, an Object.


[1]: deferred.md
