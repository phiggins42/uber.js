(function(g, d, has){
    g.uber = {
        isHostType: has.isHostType,
        clearElement: has.clearElement
    };

    has.add("dom-attachevent", function(g, d){
        return has.isHostType(d, "attachEvent");
    });

    has.add("dom-innerhtml", function(g, d, e){
        var supported = false;
        try{
            e.innerHTML = '<p><\/p>';
            supported = !!e.firstChild;
            e.innerHTML = '';
        }catch(e){}
        return supported;
    });

    has.add("dom-uniquenumber", function(g, d, e){
        var docEl = d.documentElement;
        return (typeof e.uniqueNumber == 'number' && docEl.uniqueNumber == 'number' &&
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
            tr    = tr.appendChild(d.createElement('td'));

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
})(this, document, has);
