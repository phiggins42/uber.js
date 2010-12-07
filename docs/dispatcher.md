# Generic Event Dispatching Framework

* [uber.DispatcherHandle](#DispatcherHandle)
	* [cancel](#cancel)
	* [pause](#pause)
	* [resume](#resume)
	* [paused](#paused)
* [uber.Dispatcher](#Dispatcher)
	* [add](#add)
* [uber.connect](#connect)

#### Requires
* src/array.js
* src/function.js
* src/object.js

## <a name="DispatcherHandle">uber.DispatcherHandle</a>
Strictly an interface for modifying individual event handlers.  This cannot be instantiated.

### Methods
> #### <a name="cancel">cancel()</a>
> Stops handling an event with the associated function.
> 
> #### <a name="pause">pause()</a>
> Pauses handling an event with the associated function.
> 
> #### <a name="resume">resume()</a>
> Resumes handling an event with the associated function.
> 
> #### <a name="paused">paused()</a>
> Retrieves if the handler is paused.
> 
> ##### Returns
> Boolean


## <a name="Dispatcher">uber.Dispatcher</a>

### Methods
> #### <a name="add">add(callback)</a>
> 
> ##### Arguments
> 1. `callback` (Function):
> 
> ##### Returns
> [`uber.DispatcherHandle`](#DispatcherHandle)


## <a name="connect">uber.connect(obj, method, func)</a>

### Arguments
1. `obj` (Object):
2. `method` (String):
3. `func` (Function):

### Returns
[`uber.DispatcherHandle`](#DispatcherHandle)
