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
})(this, document, has);
