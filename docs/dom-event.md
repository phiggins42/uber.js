# DOM Event Helpers

* [uber.NodeEventHandle](#NodeEventHandle)
	* [cancel](#cancel)
	* [pause](#pause)
	* [resume](#resume)
	* [paused](#paused)
* [uber.listen](#listen)
* [uber.stopListening](#stopListening)
* [uber.preventDefault](#preventDefault)
* [uber.stopPropagation](#stopPropagation)
* [uber.stopEvent](#stopEvent)
* [uber.getEventTarget](#getEventTarget)
* [uber.getRelatedTarget](#getRelatedTarget)
* [uber.normalizeEventName](#normalizeEventName)
* [uber.fireEvent](#fireEvent)
* [uber.domReady](#domReady)
* [uber.unload](#unload)
* [uber.beforeUnload](#beforeUnload)

#### Requires
* src/array.js
* src/function.js
* src/object.js
* src/promise.js
* src/deferred.js
* src/dom.js

## <a name="NodeEventHandle">uber.NodeEventHandle</a>
Strictly an interface for modifying individual node event handlers.  This cannot be instantiated.

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


## <a name="listen">uber.listen(node, eventName, func)</a>
Attach an event handler to a node's event.

### Arguments
1. `node` (DOMNode):
2. `eventName` (String):
3. `func` (Function):

### Returns
[`uber.NodeEventHandle`](#NodeEventHandle)


## <a name="stopListening">uber.stopListening(node, eventName)</a>
Detach all event handlers for a given node's event.

### Arguments
1. `node` (DOMNode):
2. `eventName` (String):


## <a name="preventDefault">uber.preventDefault(evt)</a>
### Arguments
1. `evt` (DOMEvent):


## <a name="stopPropagation">uber.stopPropagation(evt)</a>
### Arguments
1. `evt` (DOMEvent):


## <a name="stopEvent">uber.stopEvent(evt)</a>
### Arguments
1. `evt` (DOMEvent):


## <a name="getEventTarget">uber.getEventTarget(evt)</a>
### Arguments
1. `evt` (DOMEvent):

### Returns
DOMNode or null


## <a name="getRelatedTarget">uber.getRelatedTarget(evt)</a>
### Arguments
1. `evt` (DOMEvent):

### Returns
DOMNode or null


## <a name="normalizeEventName">uber.normalizeEventName(eventName)</a>
### Arguments
1. `eventName` (String)

### Returns
String


## <a name="fireEvent">uber.fireEvent(element, eventName)</a>
### Arguments
1. `element` (DOMNode)
2. `eventName` (String)

### Returns
Boolean


## <a name="domReady">uber.domReady()</a>
Provides a way to be notified when the DOM can be modified.

### Returns
[`uber.Promise`][1]

### Example
	uber.domReady().then(function(){
		uber.byId("output").innerHTML = "Hello, World!";
	});


## <a name="unload">uber.unload()</a>
Provides a way to be notified when the user has unloaded the page.

### Returns
[`uber.Promise`][1]


## <a name="beforeUnload">uber.beforeUnload()</a>
Provides a way to be notified before the page has unloaded.

### Returns
[`uber.Promise`][1]


[1]: promise.md#Promise
