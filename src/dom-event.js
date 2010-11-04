(function(global){
    // We can't pass in uber to prevent IE from leaking on uber._eventData

    if(!has("dom")){ return; }

    var preventDefault, stopPropagation,
        normalizeEventName, _listen, _stopListening

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
    // This needs to be here for domReady
    uber.normalizeEventName = normalizeEventName;

    if(hasAEL){
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
            function dispatcher(){
                var data = uber._eventData[nodeId][eventName],
                    lls = data.listeners.slice(0), i, l;

                for(i=0, l=lls.length; i<l; i++){
                    if((i in lls) && !lls[i].paused){
                        lls[i].callback.apply(this, arguments);
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
            ed[id] = {};
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

    function destroyElementData(element, recurse){
        var id = uber.getNodeId(element),
            data = uber._eventData[id],
            sl = uber.stopListening;

        if(data){
            // This is to keep element out of a closure using forIn
            var keys = uber.keys(data);
            for(var i=keys.length; i--;){
                _stopListening(element, keys[i], data[keys[i]].dispatcher, id);
                delete data[keys[i]];
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
            if(element.nodeType == ELEMENT_NODE){
                destroyElementData(element, false);
            }
        }
    }

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

    uber.domReady = (function(){
        // This MUST be in a closure so listen and stopListening don't close around the
        // variables in here.
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
        function poller(){
            if(isLoaded){ return; }
            // doScroll will not throw an error when in an iframe
            // so we rely on the event system to fire the domReady event
            // before the window onload in IE6/7
            if(doScrollCheck){
                try {
                    div.doScroll();
                    //console.log("scroll ready");
                    onDOMReady();
                    return;
                } catch(e) { }
            }
            if(documentReadyStates[document.readyState]){
                //console.log("readystate poll ready");
                onDOMReady();
                return;
            }
            pollerTO = setTimeout(poller, 30);
        }

        if(document.readyState == "complete"){
            domReady.resolve();
        }else{
            // Connect to "load" and "readystatechange", poll for "readystatechange",
            // and either connect to "DOMContentLoaded" or poll for div.doScroll.
            // First one fired wins.
            if(hasAEL){
                listen(document, "DOMContentLoaded", onDOMReady);
            }else if(has("dom-element-do-scroll")){
                // Avoid a potential browser hang when checking window.top (thanks Rich Dougherty)
                // The value of frameElement can be null or an object.
                // Checking window.frameElement could throw if not accessible.
                try { doScrollCheck = global.frameElement == null; } catch(e) { }
            }

            listen(global, "load", onDOMReady);
            listen(document, "readystatechange", onDOMReady);

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

    uber.normalizeEventName = normalizeEventName;
    uber.listen = listen;
    uber.stopListening = stopListening;

    // overrides for functions in dom.js
    uber.destroyElement = destroyElement;
    uber.destroyDescendants = destroyDescendants;

})(this);
// We can't pass in uber to prevent IE from leaking on uber._eventData
