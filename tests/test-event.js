(function(global, document){
    define(["has", "uber/dom"], function(has, dom){
        var click;
        if(has.isHostType(document, "createEvent")){
            click = function(element){
                var event = dom.getDocument(element).createEvent("MouseEvents");
                event.initMouseEvent(
                    "click", true, true, global, 1, 1, 1, 0, 0,
                    false, false, false, false, 0, document.documentElement
                );

                element.dispatchEvent(event);
            };
        }else{
            click = function(element){
                var event = element.ownerDocument.createEventObject();

                try{
                    global.event = event;
                }catch(e){}
                //source element makes sure element is still in the document
                if(element.sourceIndex > 0){
                    return element.fireEvent("onclick", event);
                }
                return false;
            };
        }

        return {
            click: click
        };
    });
})(this, document);
