# DOM Helpers

## uber.getWindow(element)
Retrieves the `window` or frame associated with `element`.

### Arguments
1. `element` (DOMNode):

### Returns
The `window` object or frame associated with `element`.


## uber.getDocument(element)
Retrieves the `Document` associated with `element`.

### Arguments
1. `element` (DOMNode):

### Returns
The `Document` associated with `element`.


## uber.byId(id, *doc*)
Look up an element by a specified ID.

### Arguments
1. `id` (String): The ID to search for.
2. `doc` (Document, *optional*): The document to search within.  Defaults to `document`.

### Returns
DOMNode


## uber.isDescendant(node, ancestor)
Determine if a node is a descendant of another.

### Arguments
1. `node` (DOMNode): 
2. `ancestor` (DOMNode):

### Returns
Boolean


## uber.getNodeId(node)
Retrieves a unique ID for an element.  In Internet Explorer, this uses the `uniqueNumber` property of nodes; in all other browser, this generates a unique ID to use.

### Arguments
1. `node` (DOMNode)

### Returns
integer (`window` is always 0, `document` is always 1)


## uber.getParentNode(node)
Retrieves the parent node for a node.

### Arguments
1. `node` (DOMNode)

### Returns
DOMNode or null


## uber.getNodeName(node)
Returns the uppercase tag name of a node.

### Arguments
1. `node` (DOMNode)

### Returns
String


## uber.destroyElement(element)
Safely destroys an element and all descendants.

### Arguments
1. `element` (DOMNode)


## uber.destroyDescendants(element)
Safely destroys all descendants of an element.

### Arguments
1. `element` (DOMNode)


## uber.insertBefore(node, refNode)
Inserts a node before another node.

### Arguments
1. `node` (DOMNode)
2. `refNode` (DOMNode)

### Returns
`node`


## uber.insertAfter(node, refNode)
Inserts a node after another node.

### Arguments
1. `node` (DOMNode)
2. `refNode` (DOMNode)

### Returns
`node`


## uber.insertFirst(node, newParent)
Inserts a node as the first child of another node.

### Arguments
1. `node` (DOMNode)
2. `newParent` (DOMNode)

### Returns
`node`


## uber.insertOnly(node, newParent)
Inserts a node as the only child of another node.  This safely destroys all descendants of `newParent`.

### Arguments
1. `node` (DOMNode)
2. `newParent` (DOMNode)

### Returns
`node`


## uber.replaceNode(node, refNode)
Replaces a node with another node.

### Arguments
1. `node` (DOMNode)
2. `refNode` (DOMNode)

### Returns
`node`


## uber.insertAtIndex(node, newParent, index)
Inserts a node at the specified index of another node.

### Arguments
1. `node` (DOMNode)
2. `newParent` (DOMNode)
3. `index` (integer)

### Returns
`node`
