(function(uber, has, document){

    var STR = "string",
        getComputedStyle, getStyleProperty,
        setSelectable, setOpacity, getOpacity
    ;

    uber.boxModel = has("css-content-box") ? "content-box" : "border-box";
    uber.styleProperty = has("css-style-float") ? "styleFloat" : "cssFloat";

    if(has("dom-current-style")){
        getComputedStyle = function getComputedStyle(node){
            // IE (as of 7) doesn't expose Element like sane browsers
            return node.nodeType == 1 /* ELEMENT_NODE*/ ? node.currentStyle : {};
        };
    }else if(has("dom-computed-style")){
        if(has("bug-computed-style-hidden-zero-height")){
            getComputedStyle = function getComputedStyle(node){
                var s;
                if(node.nodeType == 1){
                    var dv = node.ownerDocument.defaultView;
                    s = dv.getComputedStyle(node, null);
                    if(!s && node.style){
                        var d = node.style.display;
                        node.style.display = "";
                        s = dv.getComputedStyle(node, null);
                        node.style.display = d;
                    }
                }
                return s || {};
            };
        }else{
            getComputedStyle = function getComputedStyle(node){
                return node.nodeType == 1 ?
                    node.ownerDocument.defaultView.getComputedStyle(node, null) : {};
            };
        }
    }

    var getStyleProperty = (function(){
        var testElem = document.createElement("DiV"),
            prefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'],
            dashRE = /-([a-z])/ig,
            startRE = /^(.)/,
            bump = function(all, letter){
                return letter.toUpperCase();
            };

        function getStyleProperty(styleName){
            var styleName = styleName.replace(dashRE, bump),
                style = testElem.style,
                length = prefixes.length;

            // test unprefixed
            if(typeof style[styleName] == STR){
                return styleName;
            }

            styleName = styleName.replace(startRE, bump);

            while(--length){
                if(typeof style[prefixes[length] + styleName] == "string"){
                    return styleName;
                }
            }
            return null;
        };

        return getStyleProperty;
    })();

    if(has("css-selectable")){
        var selectableProperty = getStyleProperty("userSelect"),
            trueValue = "";
        if(/^(Khtml|Webkit)/.test(selectableProperty)){
            trueValue = "auto";
        }
        setSelectable = function setSelectable(node, selectable){
            node.style[selectableProperty] = selectable ? trueValue : "none";
        };
    }else if(has("dom-selectable")){
        setSelectable = function setSelectable(node, selectable){
            var v = (node.unselectable = selectable ? "" : "on");
            // TODO: figure this out
            //d.query("*", node).forEach("item.unselectable = '"+v+"'");
        };
    }else{
        setSelectable = function setSelectable(){
            throw new Error();
        }
    }

    var astr = "DXImageTransform.Microsoft.Alpha";
    function af(n, f){
        try{
            return n.filters.item(astr);
        }catch(e){
            return f ? {} : null;
        }
    };
    if(has("css-opacity")){
        var opacityProp = getStyleProperty("opacity");
        setOpacity = function setOpacity(node, value){
            return node.style[opacityProp] = value;
        };
        getOpacity = function getOpacity(node){
            return getComputedStyle(node).opacity;
        };
    }else if(has("css-opacity-filter")){
        setOpacity = function setOpacity(node, value){
            var ov = value * 100, opaque = value == 1;
            node.style.zoom = opaque ? "" : 1;

            if(!af(node)){
                if(opaque){
                    return value;
                }
                node.style.filter += " progid:" + astr + "(Opacity=" + ov + ")";
            }else{
                af(node, 1).Opacity = ov;
            }

            // on IE7 Alpha(Filter opacity=100) makes text look fuzzy so disable it altogether (Dojo bug #2661),
            //but still update the opacity value so we can get a correct reading if it is read later.
            af(node, 1).Enabled = !opaque;

            if(node.nodeName.toLowerCase() == "tr"){
                for(var i=node.cells.length; i--;){
                    uber.setOpacity(node.cells[i], value);
                }
            }
            return value;
        };
        getOpacity = function getOpacity(node){
            try{
                return af(node).Opacity / 100;
            }catch(e){
                return 1;
            }
        };
    }else{
        setOpacity = function setOpacity(){ throw new Error(); };
        getOpacity = function getOpacity(){ throw new Error(); };
    }

    uber.getComputedStyle = getComputedStyle;
    uber.getStyleProperty = getStyleProperty;
    uber.setSelectable = setSelectable;
    uber.setOpacity = setOpacity;
    uber.getOpacity = getOpacity;

})(uber, has, document);
