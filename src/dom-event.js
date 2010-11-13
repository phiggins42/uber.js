(function(global){
    // This is in a separate closure from the rest of this file to keep
    // the functions in here from closing around something that could
    // cause a leak.
    // We can't pass in uber to prevent IE from accessing uber from
    // an activation object in the scope chain.
    var _listen, _stopListening;

    if(has("dom-addeventlistener")){
        // W3C
        _listen = function _listen(obj, eventName, func){
            obj.addEventListener(eventName, func, false);
        };
        _stopListening = function _stopListening(obj, eventName, func){
            obj.removeEventListener(eventName, func, false);
        };
    }else if(has("dom-attachevent")){
        // IE
        _listen = function _listen(obj, eventName, func){
            obj.attachEvent(eventName, func);
        };
        _stopListening = function _stopListening(obj, eventName, func){
            obj.detachEvent(eventName, func);
        };
    }else{
        // DOM0
        _listen = function _listen(obj, eventName, func, id){
            var f = obj[eventName], ed = uber._eventData,
                d = ed[id][eventName];
            d.add(f);
            obj[eventName] = func;
        };
        _stopListening = function _stopListening(obj, eventName, func, id){
            var ed = uber._eventData, d = ed[id][eventName],
                f = d.listeners[0];
            obj[eventName] = f;
        };
    }

    uber._eventData = {
        '0': {}, // window
        '1': {}  // document
    };

    var createNodeDispatcher = (function(){
        function NodeEventHandle(nodeId, eventName, idx){
            function getData(){
                return uber._eventData[nodeId][eventName];
            }
            this.cancel = function(){
                delete getData().listeners[idx];
            };
            this.pause = function(){
                getData().listeners[idx].paused = true;
            };
            this.resume = function(){
                getData().listeners[idx].paused = false;
            };
            this.paused = function(){
                return getData().listeners[idx].paused;
            };
        }

        function createNodeDispatcher(nodeId, eventName){
            var nextId = 0;
            function dispatcher(evt){
                var nodeData = uber._eventData[nodeId],
                    data = nodeData[eventName],
                    realEvent = evt || uber.getWindow(uber.getDocument(nodeData.__element)).event,
                    lls = data.listeners.slice(0), i, l;

                for(i=0, l=lls.length; i<l; i++){
                    if((i in lls) && !lls[i].paused){
                        lls[i].callback.call(nodeData.__element, realEvent);
                    }
                }
            }
            function add(callback){
                var data = uber._eventData[nodeId][eventName];
                    idx = nextId++;
                data.listeners[idx] = {
                    callback: callback,
                    paused: false
                };
                return new NodeEventHandle(nodeId, eventName, idx);
            }
            return {
                dispatcher: dispatcher,
                listeners: [],
                add: add
            };
        }
        return createNodeDispatcher;
    })();

    function listen(obj, eventName, func){
        if(!obj.nodeType&&obj!=global){
            throw new Error();
        }
        var id = uber.getNodeId(obj),
            evtName = uber.normalizeEventName(eventName),
            ed = uber._eventData, d;

        if(!(id in ed)){
            ed[id] = {
                __element: obj
            };
        }
        if(!(evtName in ed[id])){
            d = ed[id][evtName] = createNodeDispatcher(id, evtName);
        }else{
            d = ed[id][evtName];
        }
        if(!d.listeners || !d.listeners.length){
            _listen(obj, evtName, d.dispatcher, id);
        }
        return d.add(func);
    }

    function stopListening(obj, eventName){
        if(eventName == "__element"){ return; }

        var win;
        if(!obj.nodeType&&obj!=global){
            throw new Error();
        }
        var id = uber.getNodeId(obj),
            evtName = uber.normalizeEventName(eventName),
            ed = uber._eventData;

        if((id in ed) && (evtName in ed[id])){
            _stopListening(obj, evtName, ed[id][evtName].dispatcher, id);
            delete ed[id][evtName];
        }
    }

    uber._listen = _listen;
    uber._stopListening = _stopListening;

    uber.listen = listen;
    uber.stopListening = stopListening;

// We can't pass in uber to prevent IE from accessing uber from
// an activation object in the scope chain
})(this);

(function(global, uber){
    if(!has("dom")){ return; }

    var preventDefault, stopPropagation, getEventTarget,
        getRelatedTarget, normalizeEventName, fireEvent;

    if(has("event-preventdefault")){
        preventDefault = function preventDefault(evt){
            evt.preventDefault();
        };
    }else{
        preventDefault = function preventDefault(evt){
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

    if(has("event-srcelement")){
        getEventTarget = function getEventTarget(evt){
            return evt.srcElement;
        };
    }else{
        getEventTarget = function getEventTarget(evt){
            return evt.target;
        };
    }

    if(has("event-relatedtarget")){
        getRelatedTarget = function getRelatedTarget(evt){
            return evt.relatedTarget;
        };
    }else{
        getRelatedTarget = function getRelatedTarget(evt){
            var target = uber.getEventTarget(evt),
                node = null;
            if(evt.type == "mouseover"){
                node = evt.fromElement;
            }else if(evt.type == "mouseout"){
                node = evt.toElement;
            }
            return node;
        };
    }

    var hasAEL = has("dom-addeventlistener");

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
    // This needs to be here for listen in domReady
    uber.normalizeEventName = normalizeEventName;

    if(has("dom-createevent")){
        fireEvent = function fireEvent(element, eventName){
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(eventName, true, true);
            return !element.dispatchEvent(evt);
        };
    }else if(has("dom-createeventobject")){
        fireEvent = function fireEvent(element, eventName){
            var evt = document.createEventObject();
            return element.fireEvent("on"+eventName, e);
        };
    }else{
        fireEvent = function fireEvent(element, eventName){
            /* do nothing */
        };
    }

    function destroyElementData(element, recurse){
        var id = uber.getNodeId(element),
            data = uber._eventData[id],
            sl = uber.stopListening;

        if(data){
            // This is to keep element out of a closure using forIn
            var keys = uber.keys(data),
                key;
            for(var i=keys.length; i--;){
                key = keys[i];
                if(key == "__element"){ continue; }
                uber._stopListening(element, key, data[key].dispatcher, id);
                delete data[key];
            }
        }
        if(recurse){
            destroyDescendantData(element);
        }
        delete uber._eventData[id];
    }
    function destroyDescendantData(element){
        var i = -1, elements = element.getElementsByTagName("*");

        while(element = elements[++i]){
            if(element.nodeType == 1){ // ELEMENT_NODE
                destroyElementData(element, false);
            }
        }
    }

    (function(){
        var oldDestroyElement = uber.destroyElement;
        function destroyElement(element, parent){
            destroyElementData(element, true);
            oldDestroyElement(element, parent);
        }

        var oldDestroyDescendants = uber.destroyDescendants;
        function destroyDescendants(element){
            destroyDescendantData(element);
            oldDestroyDescendants(element);
        }

        // overrides for functions in dom.js
        uber.destroyElement = destroyElement;
        uber.destroyDescendants = destroyDescendants;
    })();

    uber.domReady = (function(){
        // This is in a closure to keep the variables in here from being seen.
        var domReady = new uber.Deferred(),
            documentReadyStates = { "loaded": 1, "interactive": 1, "complete": 1 },
            fixReadyState = typeof document.readyState != "string",
            isLoaded = false,
            doScrollCheck = false,
            pollerTO,
            div = document.createElement("div");

        function onDOMReady(){
            if(isLoaded){ return; }

            isLoaded = true;
            div = null;

            if(fixReadyState){
                document.readyState = "interactive";
            }
            var stopListening = uber.stopListening;
            stopListening(document, "DOMContentLoaded");
            stopListening(document, "readystatechange");
            stopListening(global, "load");

            if(pollerTO){
                clearTimeout(pollerTO);
            }

            domReady.resolve();
        }
        var checkDOMReady = function(evt){
            if(isLoaded){
                if(pollerTO){
                    clearTimeout(pollerTO);
                }
            }else if(evt){
                if(evt.type == "DOMContentLoaded"){
                    onDOMReady();
                }else if(documentReadyStates[document.readyState]){
                    onDOMReady();
                }
            }
        };
        function poller(){
            if(isLoaded){ return; }
            checkDOMReady();
            pollerTO = setTimeout(poller, 30);
        }

        if(document.readyState == "complete"){
            domReady.resolve();
        }else{
            // Connect to "load" and "readystatechange", poll for "readystatechange",
            // and either connect to "DOMContentLoaded" or poll for div.doScroll.
            // First one fired wins.
            if(hasAEL){
                uber.listen(document, "DOMContentLoaded", checkDOMReady);
            }else if(has("dom-element-do-scroll")){
                // Avoid a potential browser hang when checking window.top (thanks Rich Dougherty)
                // The value of frameElement can be null or an object.
                // Checking window.frameElement could throw if not accessible.
                try { doScrollCheck = global.frameElement == null; } catch(e) { }

                checkDOMReady = function(){
                    if(isLoaded){
                        if(pollerTO){
                            clearTimeout(pollerTO);
                        }
                    }
                    // doScroll will not throw an error when in an iframe
                    // so we rely on the event system to fire the domReady event
                    // before the window onload in IE6/7
                    if(doScrollCheck){
                        try{
                            div.doScroll();
                        }catch(e){ return; }
                        onDOMReady();
                    }
                };
            }

            uber.listen(global, "load", checkDOMReady);
            uber.listen(document, "readystatechange", checkDOMReady);

            // Derived with permission from Diego Perini's IEContentLoaded
            // http://javascript.nwbox.com/IEContentLoaded/
            pollerTO = setTimeout(poller, 30);
        }

        // only pass back the promise so the deferred can't
        // be modified
        return function(){
            return domReady.promise;
        };
    })();

    (function(){
        // The following code only sets up the event on the objects
        // if .then() is called the first time.
        var freeze = Object.freeze||null;
        function unloadDeferred(eventName){
            var attached = 0, deferred = new uber.Deferred(),
                op = deferred.promise,
                promise = new uber.Promise(),
                then, cancel;
            promise.then = function then(){
                var result = op.then.apply(op, arguments);
                if(!attached){
                    attached = 1;
                    uber.listen(global, eventName, function(){
                        deferred.resolve();
                    });
                }
                return result;
            }
            promise.cancel = function cancel(){
                op.cancel.apply(op, arguments);
            }
            if(freeze){
                freeze(promise);
            }
            deferred.promise = promise;
            return deferred;
        }

        var unload = unloadDeferred("unload");
        var beforeUnload = unloadDeferred("beforeunload");

        // only pass back the promise so the deferreds can't
        // be modified
        uber.unload = function(){ return unload.promise; };
        uber.beforeUnload = function(){ return beforeUnload.promise; };
    })();

    uber.preventDefault = preventDefault;
    uber.stopPropagation = stopPropagation;
    uber.stopEvent = stopEvent;

    uber.getEventTarget = getEventTarget;
    uber.getRelatedTarget = getRelatedTarget;

    uber.normalizeEventName = normalizeEventName;
    uber.fireEvent = fireEvent;

})(this, uber);
