# HTML Helpers

* [uber.boxModel](#boxModel)
* [uber.floatProperty](#floatProperty)
* [uber.getComputedStyle](#getComputedStyle)
* [uber.getStyleName](#getStyleName)
* [uber.setSelectable](#setSelectable)
* [uber.setOpacity](#setOpacity)
* [uber.getOpacity](#getOpacity)
* [uber.isVisible](#isVisible)
* [uber.hasClass](#hasClass)
* [uber.addClass](#addClass)
* [uber.removeClass](#removeClass)
* [uber.toggleClass](#toggleClass)

#### Requires
* src/string.js
* src/dom.js

## <a name="boxModel">uber.boxModel</a>

### Values
* "content-box"
* "border-box"


## <a name="floatProperty">uber.floatProperty</a>

### Values
* "styleFloat"
* "cssFloat"


## <a name="getComputedStyle">uber.getComputedStyle(node)</a>

### Arguments
1. `node` (DOMNode):

### Returns
One of three types:
1. CSSCurrentStyleDeclaration (Browsers implementing `currentStyle`, like IE)
2. Read-only CSSStyleDeclaration (Browsers implementing `getComputedStyle`)
3. CSSStyleDeclaration (All other browsers)


## <a name="getStyleName">uber.getStyleName(styleName)</a>

### Arguments
1. `styleName` (String):

### Returns
String


## <a name="setSelectable">uber.setSelectable(node, selectable)</a>

### Arguments
1. `node` (DOMNode):
2. `selectable` (Boolean):


## <a name="setOpacity">uber.setOpacity(node, value)</a>

### Arguments
1. `node` (DOMNode):
2. `value` (float):

### Returns
float


## <a name="getOpacity">uber.getOpacity(node)</a>

### Arguments
1. `node` (DOMNode):

### Returns
float


## <a name="isVisible">uber.isVisible(node)</a>

### Arguments
1. `node` (DOMNode):

### Returns
Boolean


## <a name="hasClass">uber.hasClass(node, token)</a>

### Arguments
1. `node` (DOMNode):
2. `token` (String):

### Returns
Boolean


## <a name="addClass">uber.addClass(node, token)</a>

### Arguments
1. `node` (DOMNode):
2. `token` (String):


## <a name="removeClass">uber.removeClass(node, token)</a>

### Arguments
1. `node` (DOMNode):
2. `token` (String):


## <a name="toggleClass">uber.toggleClass(node, token)</a>

### Arguments
1. `node` (DOMNode):
2. `token` (String):

### Returns
Boolean
