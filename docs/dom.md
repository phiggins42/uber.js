# DOM Helpers

* [uber.getWindow](#getWindow)
* [uber.getDocument](#getDocument)
* [uber.byId](#byId)
* [uber.isDescendant](#isDescendant)
* [uber.getNodeId](#getNodeId)
* [uber.getParentNode](#getParentNode)
* [uber.getNodeName](#getNodeName)
* [uber.destroyElement](#destroyElement)
* [uber.destroyDescendants](#destroyDescendants)
* [uber.insertBefore](#insertBefore)
* [uber.insertAfter](#insertAfter)
* [uber.insertFirst](#insertFirst)
* [uber.insertOnly](#insertOnly)
* [uber.replaceNode](#replaceNode)
* [uber.insertAtIndex](#insertAtIndex)

## <a name="getWindow">uber.getWindow(element)</a>
Retrieves the `window` or frame associated with `element`.

### Arguments
1. `element` (DOMNode):

### Returns
The `window` object or frame associated with `element`.


## <a name="getDocument">uber.getDocument(element)</a>
Retrieves the `Document` associated with `element`.

### Arguments
1. `element` (DOMNode):

### Returns
The `Document` associated with `element`.


## <a name="byId">uber.byId(id, *doc*)</a>
Look up an element by a specified ID.

### Arguments
1. `id` (String): The ID to search for.
2. `doc` (Document, *optional*): The document to search within.  Defaults to `document`.

### Returns
DOMNode


## <a name="isDescendant">uber.isDescendant(node, ancestor)</a>
Determine if a node is a descendant of another.

### Arguments
1. `node` (DOMNode): 
2. `ancestor` (DOMNode):

### Returns
Boolean


## <a name="getNodeId">uber.getNodeId(node)</a>
Retrieves a unique ID for an element.  In Internet Explorer, this uses the `uniqueNumber` property of nodes; in all other browser, this generates a unique ID to use.

### Arguments
1. `node` (DOMNode)

### Returns
integer (`window` is always 0, `document` is always 1)


## <a name="getParentNode">uber.getParentNode(node)</a>
Retrieves the parent node for a node.

### Arguments
1. `node` (DOMNode)

### Returns
DOMNode or null


## <a name="getNodeName">uber.getNodeName(node)</a>
Returns the uppercase tag name of a node.

### Arguments
1. `node` (DOMNode)

### Returns
String


## <a name="destroyElement">uber.destroyElement(element)</a>
Safely destroys an element and all descendants.

### Arguments
1. `element` (DOMNode)


## <a name="destroyDescendants">uber.destroyDescendants(element)</a>
Safely destroys all descendants of an element.

### Arguments
1. `element` (DOMNode)


## <a name="insertBefore">uber.insertBefore(node, refNode)</a>
Inserts a node before another node.

### Arguments
1. `node` (DOMNode)
2. `refNode` (DOMNode)

### Returns
`node`


## <a name="insertAfter">uber.insertAfter(node, refNode)</a>
Inserts a node after another node.

### Arguments
1. `node` (DOMNode)
2. `refNode` (DOMNode)

### Returns
`node`


## <a name="insertFirst">uber.insertFirst(node, newParent)</a>
Inserts a node as the first child of another node.

### Arguments
1. `node` (DOMNode)
2. `newParent` (DOMNode)

### Returns
`node`


## <a name="insertOnly">uber.insertOnly(node, newParent)</a>
Inserts a node as the only child of another node.  This safely destroys all descendants of `newParent`.

### Arguments
1. `node` (DOMNode)
2. `newParent` (DOMNode)

### Returns
`node`


## <a name="replaceNode">uber.replaceNode(node, refNode)</a>
Replaces a node with another node.

### Arguments
1. `node` (DOMNode)
2. `refNode` (DOMNode)

### Returns
`node`


## <a name="insertAtIndex">uber.insertAtIndex(node, newParent, index)</a>
Inserts a node at the specified index of another node.

### Arguments
1. `node` (DOMNode)
2. `newParent` (DOMNode)
3. `index` (integer)

### Returns
`node`
