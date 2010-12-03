# Deferred

### Requires
* src/array.js
* src/function.js
* src/object.js
* src/promise.js

## uber.Deferred(*canceller*)
Inherits from `uber.Promise`.

### Constructor Arguments
1. `canceller` (Function, *optional*):

### Methods

> #### then(resolvedCb, *errorCb*, *progressCb*)
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
> 
> #### resolve(value)
> ##### Arguments
> 1. `value` (Object):
> 
> #### reject(error)
> ##### Arguments
> 1. `error` (Object or Error):
> 
> #### progress(update)
> ##### Arguments
> 1. `update` (Object):
> 
> #### cancel()
