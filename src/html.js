(function(uber, has, document){

    var STR = "string";

    var byId = uber.byId = (function(){
        function byIdNameCase(id, doc){
            var _d = doc || document, te = _d.getElementById(id);
            // attributes.id.value is better than just id in case the 
            // user has a name=id inside a form
            if(te && (te.attributes.id.value == id || te.id == id)){
                return te;
            }else{
                var eles = _d.all[id];
                if(!eles || eles.nodeName){
                    eles = [eles];
                }
                // if more than 1, choose first with the correct id
                var i = 0;
                while((te = eles[i++])){
                    if((te.attributes && te.attributes.id && te.attributes.id.value == id)
                    || te.id == id){
                        return te;
                    }
                }
            }
        }
        function byIdSpec(id, doc){
            return (doc||document).getElementById(id);
        }

        function wrapper(func){
            return function(id, doc){
                if(typeof id != STR){
                    return id;
                }
                return func(id, doc);
            };
        }

        if(has("bug-getelementbyid-ids-names")||has("bug-getelementbyid-ignores-case")){
            return wrapper(byIdNameCase);
        }

        return wrapper(byIdSpec);
    })();

    function idWrapper(func){
        return function(id){
            if(typeof id != STR){
                return id;
            }
            return func.apply(this, uber.toArray(arguments, 1, [byId(id)]));
        }
    }

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
    }
    uber.getStyleProperty = getStyleProperty;

    uber.setSelectable = (function(){
        function setSelectableCSS(node, selectable){
            node.style[selectableProperty] = selectable ? trueValue : "none";
        }
        function setSelectableDOM(node, selectable){
            var v = (node.unselectable = selectable ? "" : "on");
            // TODO: figure this out
            //d.query("*", node).forEach("item.unselectable = '"+v+"'");
        }

        var selectableProperty, trueValue = "";
        if(has("css-selectable")){
            selectableProperty = getStyleProperty("userSelect");
            if(/^(Khtml|Webkit)/.test(selectableProperty)){
                trueValue = "auto";
            }
            return setSelectableCSS;
        }else if(has("dom-selectable")){
            return setSelectableDOM;
        }else{
            return function(){
                throw new Error();
            }
        }
    })();

    uber.setOpacity = (function(){
        function setOpacity(node, value){
            return node.style.opacity = opacity;
        }
        function setOpacityFilter(node, value){
            var ov = opacity * 100, opaque = opacity == 1;
            node.style.zoom = opaque ? "" : 1;

            if(!af(node)){
                if(opaque){
                    return opacity;
                }
                node.style.filter += " progid:" + astr + "(Opacity=" + ov + ")";
            }else{
                af(node, 1).Opacity = ov;
            }

            // on IE7 Alpha(Filter opacity=100) makes text look fuzzy so disable it altogether (Dojo bug #2661),
            //but still update the opacity value so we can get a correct reading if it is read later.
            af(node, 1).Enabled = !opaque;

            // TODO: figure out how to do this
            /*if(node.nodeName.toLowerCase() == "tr"){
                d.query("> td", node).forEach(function(i){
                    setOpacityFilter(i, opacity);
                });
            }*/
            return opacity;
        }
        if(has("css-opacity")){
            return idWrapper(setOpacity);
        }else if(has("css-opacity-filter")){
            return idWrapper(setOpacity);
        }else{
            return function(){ throw new Error(); };
        }
    })();
})(uber, has, document);
