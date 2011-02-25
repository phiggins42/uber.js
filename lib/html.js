(function(document, define){
    define(["has/css", "./dom", "./string"], function(has, dom, string){
        var STR = "string",
            getComputedStyle, getStyleName,
            setSelectable, setOpacity, getOpacity,
            domComputedStyle = has("dom-computed-style")
        ;

        has.add("dom-classlist", function(g, d, e){
            var iht = has.isHostType;
            if(!iht(e, "classList")){
                return false;
            }

            var cl = e.classList;

            return iht(cl, "item") && iht(cl, "contains") && iht(cl, "add") &&
                iht(cl, "remove") && iht(cl, "toggle");
        });

        // Adapted from FuseJS
        has.add("bug-table-elements-retain-offset-dimensions-when-hidden", function(g, d, el){
            var buggy, fake,
                de = d.documentElement,
                root = d.body || (function(){
                    fake = true;
                    return de.insertBefore(d.createElement("body"), de.firstChild);
                }());
            // true for IE7 and lower
            var table = d.createElement('table'),
                tbody = table.appendChild(d.createElement('tbody')),
                tr    = tbody.appendChild(d.createElement('tr')),
                td    = tr.appendChild(d.createElement('td'));

            tbody.style.display = 'none';
            tr.style.width = '1px';
            root.appendChild(table);

            buggy = !!table.firstChild.offsetWidth;
            dom.destroyElement(table, root);
            if(fake){
                root.parentNode.removeChild(root);
            }
            return buggy;
        });

        // Adapted from FuseJS
        has.add("bug-computed-style-dimensions-equal-border-box", function(g, d){
            var docEl = d.documentElement,
                des = docEl.style,
                backup = des.paddingBottom,
                result = null;

            if(has("dom-computed-style")){
                des.paddingBottom = '1px';
                var style = d.defaultView.getComputedStyle(docEl, null);
                result = style && (parseInt(style.height, 10) || 0) ==  docEl.offsetHeight;
                des.paddingBottom = backup;
            }
            return result;
        });

        has.add("bug-table-fixed-layout-no-width-border-box-cells", function(g, d, el){
            var buggy, fake,
                de = d.documentElement,
                root = d.body || (function(){
                    fake = true;
                    return de.insertBefore(d.createElement("body"), de.firstChild);
                }());

            var div = d.createElement("div");
            div.innerHTML = '<table border="0" cellpadding="0" cellspacing="0" style="visibility: hidden;table-layout: fixed; width: 0px;"><tbody><tr><td style="padding: 10px; border: 1px solid black;width: 200px;">blah</td></tr></tbody></table>';

            root.insertBefore(div, root.firstChild);

            buggy = div.firstChild.firstChild.firstChild.firstChild.offsetWidth == 200;

            dom.destroyElement(div, root);
            if(fake){
                root.parentNode.removeChild(root);
            }
            return buggy;
        });

        var boxModel = has("css-content-box") ? "content-box" : "border-box";
        var floatProperty = has("css-style-float") ? "styleFloat" : "cssFloat";

        if(has("dom-current-style")){
            getComputedStyle = function getComputedStyle(node){
                // IE (as of 7) doesn't expose Element like sane browsers
                return node.currentStyle;
            };
        }else if(domComputedStyle){
            getComputedStyle = function getComputedStyle(node){
                return node.ownerDocument.defaultView.getComputedStyle(node, null);
            };
        }else{
            getComputedStyle = function getComputedStyle(node){
                return node.style;
            };
        }

        getStyleName = (function(){
            var testElem = document.createElement("div"),
                prefixes = ['Khtml', 'ms', 'O', 'Moz', 'Webkit'],
                dashRE = /-([a-z])/ig,
                startRE = /^(.)/,
                bump = function(all, letter){
                    return letter.toUpperCase();
                },
                cache = {},
                floatNames = { 'float': floatProperty, 'cssFloat': floatProperty, 'styleFloat': floatProperty };

            function getStyleName(styleName){
                if(styleName in cache){
                    return cache[styleName];
                }
                var sn = floatNames[styleName] || styleName.replace(dashRE, bump),
                    style = testElem.style,
                    length = prefixes.length,
                    psn;

                // test unprefixed
                if(typeof style[sn] == STR){
                    return cache[styleName] = cache[sn] = sn;
                }

                sn = sn.replace(startRE, bump);

                while(--length){
                    psn = prefixes[length] + sn;
                    if(typeof style[psn] == STR){
                        return cache[styleName] = cache[sn] = cache[psn] = sn;
                    }
                }
                return cache[styleName] = null;
            }

            return getStyleName;
        })();

        if(has("css-selectable")){
            var selectableName = getStyleName("userSelect"),
                trueValue = "";
            if(/^(Khtml|Webkit)/.test(selectableName)){
                trueValue = "auto";
            }
            setSelectable = function setSelectable(node, selectable){
                node.style[selectableName] = selectable ? trueValue : "none";
            };
        }else if(has("bug-properties-are-attributes")){
            setSelectable = function setSelectable(node, selectable){
                var v = (node.unselectable = selectable ? "" : "on"),
                    element, elements = node.getElementsByTagName("*"), i = -1;

                while((element = elements[++i])){
                    if(element.nodeType == 1){ // ELEMENT_NODE
                        element.unselectable = v;
                    }
                }
            };
        }else{
            setSelectable = function setSelectable(){
                /* do nothing */
            };
        }

        var astr = "DXImageTransform.Microsoft.Alpha";
        function af(n, f){
            try{
                return n.filters.item(astr);
            }catch(e){
                return f ? {} : null;
            }
        }

        var opacityProp = getStyleName("opacity");
        if(has("css-opacity-filter")){
            setOpacity = function setOpacity(node, value){
                var ov = value * 100,
                    opaque = value == 1,
                    item = !node.filters.length ? null : af(node),
                    nodeStyle = node.style,
                    curStyle = node.currentStyle || nodeStyle;

                if(!item && !opaque){
                    nodeStyle.filter += " progid:" + astr + "(Opacity=" + ov + ")";
                    item = af(node);
                }

                if(item){
                    // only modify the zoom value if we need to force layout
                    if(!opaque && !((curStyle && curStyle.hasLayout) || (curStyle && curStyle.zoom != "normal"))){
                        nodeStyle.zoom = 1;
                    }
                    item.Opacity = ov;

                    // on IE7 Alpha(Filter opacity=100) makes text look fuzzy so disable it altogether (Dojo bug #2661),
                    //but still update the opacity value so we can get a correct reading if it is read later.
                    item.Enabled = !opaque;
                }

                if(dom.getNodeName(node) == "TR"){
                    for(var i=node.cells.length; i--;){
                        setOpacity(node.cells[i], value);
                    }
                }
                return value;
            };
            getOpacity = function getOpacity(node){
                try{
                    return af(node).Opacity / 100;
                }catch(e){
                    return 1.0;
                }
            };
        }else if(!opacityProp){
            // Do nothing
            setOpacity = function setOpacity(){ return 1.0; };
            getOpacity = function getOpacity(){ return 1.0; };
        }else{
            setOpacity = function setOpacity(node, value){
                return node.style[opacityProp] = value;
            };
            if(domComputedStyle){
                getOpacity = function getOpacity(node){
                    var cs = getComputedStyle(node);
                    return parseFloat(node.style[opacityProp] || (cs && cs[opacityProp]) || 1.0);
                };
            }else{
                getOpacity = function getOpacity(node){
                    return parseFloat(node.style[opacityProp] || 1.0);
                };
            }
        }

        var _isVisible = (function(){
            var isVisible;
            if(domComputedStyle){
                isVisible = function isVisible(node){
                    var cs = getComputedStyle(node);
                    return !!(cs && (node.offsetHeight || node.offsetWidth));
                };
            }else{
                isVisible = function isVisible(node){
                    var cs = getComputedStyle(node);
                    return cs !== null && (cs || node.style).display != "none" &&
                        !!(node.offsetWidth || node.offsetHeight);
                };
            }
            return isVisible;
        })();

        var tableElements = { 'THEAD': 1, 'TBODY': 1, 'TR': 1 };
        var isVisible = (function(){
            if(has("bug-table-elements-retain-offset-dimentions-when-hidden")){
                // IE7 and lower
                // Adapted from FuseJS
                return function(node){
                    if(_isVisible(node)){
                        var name = dom.getNodeName(node);
                        if(tableElements[name] && (node = dom.getParentNode(node))){
                            return isVisible(node);
                        }
                        return true;
                    }
                };
            }else{
                return _isVisible;
            }
        })();

        var addClass, removeClass,
            spaceRE = /[\x09\x0A\x0C\x0D\x20]/,
            reCache = {};

        function getClassRE(token){
            var r = reCache[token];
            if(!r){
                r = reCache[token] = new RegExp(" " + token + " ", "g");
            }
            return r;
        }
        function checkToken(token){
            if(token === ""){
                throw new Error("An invalid or illegal string was specified");
            }
            if(spaceRE.test(token)){
                throw new Error("String contains an invalid character");
            }
        }
        if(has("dom-classlist")){
            hasClass = function hasClass(node, token){
                return node.classList.contains(token);
            };
            addClass = function addClass(node, token){
                node.classList.add(token);
            };
            removeClass = function removeClass(node, token){
                node.classList.remove(token);
            };
            toggleClass = function toggleClass(node, token){
                return node.classList.toggle(token);
            };
        }else{
            hasClass = function hasClass(node, token){
                checkToken(token);
                var cls = node.className, r = getClassRE(token);
                cls = cls ? " " + cls + " " : " ";
                return !!cls.match(r);
            };
            addClass = function addClass(node, token){
                checkToken(token);
                var cls = node.className, r = getClassRE(token);
                cls = cls ? " " + cls + " " : " ";
                if(cls.match(r)){
                    return;
                }
                node.className += " " + token;
            };
            removeClass = function removeClass(node, token){
                checkToken(token);
                var cls = node.className, r = getClassRE(token);
                cls = string.trim((cls ? " " + cls + " " : " ").replace(r, " "));
                if(node.className != cls){
                    node.className = cls;
                }
            };
            toggleClass = function toggleClass(node, token){
                checkToken(token);
                var cls = node.className, r = getClassRE(token);
                cls = cls ? " " + cls + " " : " ";
                if(cls.match(r)){
                    cls = string.trim(cls.replace(r, " "));
                    node.className = cls;
                    return false;
                }else{
                    node.className += " " + token;
                    return true;
                }
            };
        }

        return {
            boxModel: boxModel,
            floatProperty: floatProperty,
            getComputedStyle: getComputedStyle,
            getStyleName: getStyleName,
            setSelectable: setSelectable,
            setOpacity: setOpacity,
            getOpacity: getOpacity,
            isVisible: isVisible,

            hasClass: hasClass,
            addClass: addClass,
            removeClass: removeClass,
            toggleClass: toggleClass
        };
    });
})(document, typeof define != "undefined" ? define : function(deps, factory){
    this.uber_html = factory(has, uber_dom, uber_string); // use global has and uber_*
});
