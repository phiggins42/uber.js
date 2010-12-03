# DOM Event Helpers

#### Requires
* src/array.js
* src/function.js
* src/object.js
* src/promise.js
* src/deferred.js
* src/dom.js

## uber.NodeEventHandle()
Strictly an interface for modifying individual node event handlers.  This cannot be instantiated.

### Methods
> #### cancel()
> Stops handling an event with the associated function.
> 
> #### pause()
> Pauses handling an event with the associated function.
> 
> #### resume()
> Resumes handling an event with the associated function.
> 
> #### paused()
> Retrieves if the handler is paused.
> 
> ##### Returns
> Boolean


## uber.listen(node, eventName, func)
Attach an event handler to a node's event.

### Arguments
1. `node` (DOMNode):
2. `eventName` (String):
3. `func` (Function):

### Returns
`uber.NodeEventHandle`


## uber.stopListening(node, eventName)
Detach all event handlers for a given node's event.

### Arguments
1. `node` (DOMNode):
2. `eventName` (String):


## uber.preventDefault(evt)
### Arguments
1. `evt` (DOMEvent):


## uber.stopPropagation(evt)
### Arguments
1. `evt` (DOMEvent):


## uber.stopEvent(evt)
### Arguments
1. `evt` (DOMEvent):


## uber.getEventTarget(evt)
### Arguments
1. `evt` (DOMEvent):

### Returns
DOMNode or null


## uber.getRelatedTarget(evt)
### Arguments
1. `evt` (DOMEvent):

### Returns
DOMNode or null


## uber.normalizeEventName(eventName)
### Arguments
1. `eventName` (String)

### Returns
String


## uber.fireEvent(element, eventName)
### Arguments
1. `element` (DOMNode)
2. `eventName` (String)

### Returns
Boolean


## uber.domReady()
Provides a way to be notified when the DOM can be modified.

### Returns
`uber.Promise`

### Example
	uber.domReady().then(function(){
		uber.byId("output").innerHTML = "Hello, World!";
	});


## uber.unload()
Provides a way to be notified when the user has unloaded the page.

### Returns
`uber.Promise`


## uber.beforeUnload()
Provides a way to be notified before the page has unloaded.

### Returns
`uber.Promise`
