# Deferred

* [uber.Deferred](#Deferred)
	* [then](#then)
	* [resolve](#resolve)
	* [reject](#reject)
	* [progress](#progress)
	* [cancel](#cancel)
* [uber.Deferreds](#Deferreds)
	* [then](#thenDeferreds)

#### Requires
* src/array.js
* src/function.js
* src/object.js
* src/promise.js

## <a name="Deferred">uber.Deferred(*canceller*)</a>
Inherits from [`uber.Promise`][1].

### Constructor Arguments
1. `canceller` (Function, *optional*):

### Methods

> #### <a name="then">then(resolvedCb, *errorCb*, *progressCb*)</a>
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
> [`uber.Promise`][1]
> 
> #### <a name="resolve">resolve(value)</a>
> ##### Arguments
> 1. `value` (Object):
> 
> #### <a name="reject">reject(error)</a>
> ##### Arguments
> 1. `error` (Object or Error):
> 
> #### <a name="progress">progress(update)</a>
> ##### Arguments
> 1. `update` (Object):
> 
> #### <a name="cancel">cancel()</a>


## <a name="Deferreds">uber.Deferreds(defs, *canceller*)</a>
Inherits from [`uber.Deferred`](#Deferred).

### Constructor Arguments
1. `defs` (Array of [`uber.Deferred`](#Deferred)):
2. `canceller` (Function, *optional*):

### Methods
See [`uber.Deferred`](#Deferred)

> #### <a name="thenDeferreds">then(resolvedCb, *errorCb*, *progressCb*)</a>
> ##### Arguments
> 1. `resolvedCb` (Function):
> > ###### Arguments
> > 1. `result` (Array[Array[Boolean, Object]]):
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
> [`uber.Promise`][1]

[1]: promise.md#Promise
