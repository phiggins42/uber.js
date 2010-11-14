(function(uber, has, document, global){
    if(!has("dom")){ return; }

    var byId, getNodeName, destroyElement, destroyDescendants;

    function getDocument(element){
        // based on work by John-David Dalton
        return element.ownerDocument || element.document ||
            (element.nodeType == 9 ? element : document);
    }

    function getWindow(element){
        // based on work by Diego Perini and John-David Dalton
        var frame, i = -1, doc = uber.getDocument(element), frames = global.frames;
        if(document != doc){
            while(frame = frames[++i]){
                if(frame.document == doc){
                    return frame;
                }
            }
        }
        return global;
    }

    function testId(el, id, iht /* isHostType */){
        return ((iht(el, "attributes") && typeof el.attributes.id != "undefined" && el.attributes.id.value == id) || el.id == id);
    }

    if(has("bug-getelementbyid-ids-names")||has("bug-getelementbyid-ignores-case")){
        byId = function byId(id, doc){
            var _d = doc || document, te = _d.getElementById(id),
                isHostType = uber.isHostType;
            // attributes.id.value is better than just id in case the 
            // user has a name=id inside a form
            if(te && testId(te, id, isHostType)){
                return te;
            }else{
                var eles = _d.all[id];
                if(!eles || eles.nodeName){
                    eles = [eles];
                }
                // if more than 1, choose first with the correct id
                var i = 0;
                while((te = eles[i++])){
                    if(testId(te, id, isHostType)){
                        return te;
                    }
                }
            }
        };
    }else{
        byId = function byId(id, doc){
            return (doc||document).getElementById(id);
        };
    }

    function isDescendant(node, ancestor){
        try{
            while(node){
                if(node === ancestor){
                    return true;
                }
                node = node.parentNode;
            }
        }catch(e){};
        return false;
    }

    var NUMBER_PROP = has("dom-uniquenumber") ? "uniqueNumber" : "_uberId",
        _nextNodeId = 2;

    function getNodeId(node){
        // Based on work by John-David Dalton in FuseJS
        var id = node[NUMBER_PROP], win;

        if(!id){
            // In IE window == document is true but not document == window.
            // Use loose comparison because different `window` references for
            // the same window may not strictly equal each other.
            win = uber.getWindow(node);
            if (node == win) {
                id = node == global ? '0' : uber.getNodeId(node.frameElement) + '-0';
            }else if(node.nodeType == 9){ // document node
                // quick return for common case OR
                // calculate id for foreign document objects
                id = node == document ? '1' : uber.getNodeId(win.frameElement) + '-1';
            }else{
                id = node._uberId = _nextNodeId++;
            }
        }

        return id;
    }

    var PARENT_PROP = has("dom-parentelement") ? "parentElement" : "parentNode";
    function getParentNode(node){
        return node[PARENT_PROP];
    }

    if(has("dom-tagname-uppercase")){
        getNodeName = function getNodeName(node){
            return node.nodeName;
        };
    }else{
        getNodeName = function getNodeName(node){
            return node.nodeName.toUpperCase();
        };
    }

    // Adapted from FuseJS
    if(has("dom-innerhtml")){
        // Prevent leaks using removeChild
        destroyElement = (function(){
            var trash = document.createElement('div');
            function destroyElement(element){
                trash.appendChild(element);
                trash.innerHTML = '';
            }
            return destroyElement;
        })();
        destroyDescendants = function destroyDescendants(element){
            element.innerHTML = '';
        };
    }else{
        destroyElement = function destroyElement(element, parentNode){
            parentNode = parentNode || uber.getParentNode(element);
            if(parentNode){
                parentNode.removeChild(element);
            }
        };
        destroyDescendants = function destroyDescendants(element){
            var child, de = uber.destroyElement;
            while(child = element.lastChild){
                de(child, element);
            }
        };
    }

    function insertBefore(node, refNode){
        var parent = uber.getParentNode(refNode);
        if(parent){
            parent.insertBefore(node, refNode);
        }
        return node;
    }

    function insertAfter(node, refNode){
        var parent = uber.getParentNode(refNode);
        if(parent){
            if(parent.lastChild === refNode){
                parent.appendChild(node);
            }else{
                parent.insertBefore(node, refNode.nextSibling);
            }
        }
        return node;
    }

    function insertFirst(node, newParent){
        if(newParent.firstChild){
            uber.insertBefore(node, newParent.firstChild);
        }else{
            newParent.appendChild(node);
        }
        return node;
    }

    function insertOnly(node, newParent){
        uber.destroyDescendants(newParent);
        newParent.appendChild(node);
        return node;
    }

    function replaceNode(node, refNode){
        var parent = uber.getParentNode(refNode);
        if(parent){
            parent.replaceChild(node, refNode);
        }
        return node;
    }

    function insertAtIndex(node, newParent, index){
        var cn = newParent.childNodes,
            l = cn.length;
        if(!l || l <= index){
            newParent.appendChild(node);
        }else{
            uber.insertBefore(node, cn[index < 0 ? 0 : index]);
        }
        return node;
    }

    uber.getWindow = getWindow;
    uber.getDocument = getDocument;
    uber.byId = byId;
    uber.isDescendant = isDescendant;
    uber.getNodeId = getNodeId;
    uber.getParentNode = getParentNode;
    uber.getNodeName = getNodeName;
    uber.destroyElement = destroyElement;
    uber.destroyDescendants = destroyDescendants;

    uber.insertBefore = insertBefore;
    uber.insertAfter = insertAfter;
    uber.insertFirst = insertFirst;
    uber.insertOnly = insertOnly;
    uber.replaceNode = replaceNode;
    uber.insertAtIndex = insertAtIndex;

})(uber, has, document, this);
