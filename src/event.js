(function(uber, has, global){
    var whenEvent, preventDefault, stopPropagation,
        normalizeEventName, _listen;

    function _trySetKeyCode(evt, code){
        try{
            // squelch errors when keyCode is read-only
            // (e.g. if keyCode is ctrl or shift)
            return (evt.keyCode = code);
        }catch(e){
            return 0;
        }
    }

    if(has("event-preventdefault")){
        preventDefault = function preventDefault(evt){
            evt.preventDefault();
        };
    }else{
        preventDefault = function preventDefault(evt){
            // Setting keyCode to 0 is the only way to prevent certain keypresses (namely
            // ctrl-combinations that correspond to menu accelerator keys).
            // Otoh, it prevents upstream listeners from getting this information
            // Try to split the difference here by clobbering keyCode only for ctrl 
            // combinations. If you still need to access the key upstream, bubbledKeyCode is
            // provided as a workaround.
            evt = evt || global.event;
            evt.bubbledKeyCode = evt.keyCode;
            if(evt.ctrlKey){ _trySetKeyCode(evt, 0); }
            evt.returnValue = false;
        };
    }

    if(has("event-stoppropagation")){
        stopPropagation = function stopPropagation(evt){
            evt.stopPropagation();
        };
    }else{
        stopPropagation = function stopPropagation(evt){
            evt.cancelBubble = true;
        };
    }

    function stopEvent(evt){
        uber.preventDefault(evt);
        uber.stopPropagation(evt);
    }

    var hasAEL = has("dom-addeventlistener"),
        hasAE = has("dom-attachevent");

    if(hasAEL){
        normalizeEventName = function normalizeEventName(/*String*/ name){
            // Generally, name should be lower case, unless it is special
            // somehow (e.g. a Mozilla DOM event).
            // Remove 'on'.
            return name.slice(0,2) =="on" ? name.slice(2) : name;
        };
    }else{
        normalizeEventName = function normalizeEventName(/*String*/ eventName){
            // Generally, eventName should be lower case, unless it is
            // special somehow (e.g. a Mozilla event)
            // ensure 'on'
            return eventName.slice(0,2) != "on" ? "on" + eventName : eventName;
        };
    }


    if(hasAEL){
        _listen = function _listen(obj, eventName, dispatcher){
            obj.addEventListener(eventName, dispatcher, false);
        };
    }else if(hasAE){
        // IE
        _listen = function _listen(obj, eventName, dispatcher){
            obj.attachEvent(eventName, dispatcher);
        };
    }else{
        // TODO: implement this?
        // DOM0
    }

    var nodeDispatcherCache = {
        '0': { }, // window
        '1': { }  // document
    };

    function listen(obj, method, func){
        if(!obj.nodeType){
            throw new Error();
        }
        var id = uber.getNodeId(obj), d,
            evtName = normalizeEventName(method);
        if(!nodeDispatcherCache[id]){
            nodeDispatcherCache[id] = {};
        }
        if(!nodeDispatcherCache[id][evtName]){
            d = nodeDispatcherCache[id][evtName] = uber.createDispatcher();
            _listen(obj, evtName, d);
        }else{
            d = nodeDispatcherCache[id][evtName];
        }
        return d.add(func);
    }

    uber.preventDefault = preventDefault;
    uber.stopPropagation = stopPropagation;
    uber.stopEvent = stopEvent;
    uber.listen = listen;

})(uber, has, this);
