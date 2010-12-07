# Generic Event Dispatching Framework

* [uber.DispatcherHandle](#DispatcherHandle)
	* [cancel](#cancel)
	* [pause](#pause)
	* [resume](#resume)
	* [paused](#paused)
* [uber.Dispatcher](#Dispatcher)
	* [add](#add)
* [uber.createDispatcher](#createDispatcher)
* [uber.connect](#connect)
* [uber.disconnect](#disconnect)

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
Strictly an interface for dispatching function calls.  This cannot be instantiated.

### Methods
> #### <a name="add">add(callback)</a>
> 
> ##### Arguments
> 1. `callback` (Function):
> 
> ##### Returns
> [`uber.DispatcherHandle`](#DispatcherHandle)


## <a name="createDispatcher">uber.createDispatcher()</a>
It is recommended that you use [`uber.connect`](#connect) rather than `uber.createDispatcher` directly.

### Returns
[`uber.Dispatcher`](#Dispatcher)


## <a name="connect">uber.connect(obj, method, func)</a>
**WARNING** Do not use `uber.connect` with `DOMNode`s; instead, use [`uber.listen`](dom-event.md#listen).

### Arguments
1. `obj` (Object):
2. `method` (String):
3. `func` (Function):

### Returns
[`uber.DispatcherHandle`](#DispatcherHandle)


## <a name="disconnect">uber.disconnect(obj, method)</a>
Disconnects all connections for a method and restores the original method (if applicable).

### Arguments
1. `obj` (Object):
2. `method` (String):
