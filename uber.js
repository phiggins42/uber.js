(function(g, d, define){
    define(["has"], function(has){
        var u = g.uber = {
            isHostType: has.isHostType,
            clearElement: has.clearElement
        };

        function testForIn(g, value){
            var klass = function(){ this.toString = 1; }, i, count = 0;
            for(i in new klass){ count++; }
            has.add("bug-for-in-doubled", count == 2);
            has.add("bug-for-in-shadowed", count === 0);
            return count === value;
        }

        has.add("bug-for-in-doubled", function(g){
            return testForIn(g, 2);
        });

        has.add("bug-for-in-shadowed", function(g){
            return testForIn(g, 0);
        });

        has.add("dom-attachevent", function(g, d){
            return has.isHostType(d, "attachEvent");
        });

        has.add("dom-innerhtml", function(g, d, e){
            var supported = false;
            try{
                e.innerHTML = '<p><\/p>';
                supported = !!e.firstChild && e.firstChild.nodeName.toUpperCase() == "P";
                e.innerHTML = '';
            }catch(e){}
            return supported;
        });

        has.add("dom-uniquenumber", function(g, d, e){
            var docEl = d.documentElement;
            return (typeof e.uniqueNumber == 'number' && typeof docEl.uniqueNumber == 'number' &&
                e.uniqueNumber != docEl.uniqueNumber);
        });

        has.add("dom-parentelement", function(g, d){
            return has.isHostType(d.documentElement, "parentElement");
        });

        has.add("dom-createevent", function(g, d){
            return has.isHostType(d, "createEvent");
        });

        has.add("dom-createeventobject", function(g, d){
            return has.isHostType(d, "createEventObject");
        });

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
            uber.destroyElement(table, root);
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

            uber.destroyElement(div, root);
            if(fake){
                root.parentNode.removeChild(root);
            }
            return buggy;
        });

        return u;
    });
})(this, document, typeof define != "undefined" ? define : function(deps, factory){
    factory(has); // use global has
});
