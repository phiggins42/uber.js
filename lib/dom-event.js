(function(global, define){
    define(["has/events", "./dom", "./object", "./Deferred"],
    function(has, dom, object, Deferred){
        if(!has("dom")){ return {}; }

        // uber is passed in as ubr to keep IE from accessing uber from an
        // activation object in the scope chain.
        var _listen, _stopListening, _breakLeak,
            preventDefault, stopPropagation, getEventTarget,
            getRelatedTarget, normalizeEventName, fireEvent;

        has.add("dom-createevent", function(g, d){
            return has.isHostType(d, "createEvent");
        });

        has.add("dom-createeventobject", function(g, d){
            return has.isHostType(d, "createEventObject");
        });

        if(has("dom-addeventlistener")){
            // W3C
            _listen = function _listen(obj, eventName, func){
                obj.addEventListener(eventName, func, false);
            };
            _stopListening = function _stopListening(obj, eventName, func){
                obj.removeEventListener(eventName, func, false);
            };
        }else{
            // DOM0
            // IE is handled with DOM0 because attachEvent handlers
            // fire in random order
            _listen = function _listen(obj, eventName, func, id){
                var f = obj[eventName], ed = _uberEventData,
                    d = ed[id][eventName];
                d.add(f);
                obj[eventName] = func;
            };
            _stopListening = function _stopListening(obj, eventName, func, id){
                var ed = _uberEventData, d = ed[id][eventName],
                    f = d.listeners[0];
                obj[eventName] = f;
            };
        }

        global._uberEventData = {
            '0': {}, // window
            '1': {}  // document
        };

        var createNodeDispatcher = (function(){
            function NodeEventHandle(nodeId, eventName, idx){
                function getData(){
                    return _uberEventData[nodeId][eventName];
                }
                this.cancel = function(){
                    var data = getData(),
                        order = data.order,
                        listeners = data.listeners;
                    for(var i=order.length; i--;){
                        if(order[i] == idx){
                            order.splice(i, 1);
                        }
                    }
                    if(idx in listeners){
                        delete listeners[idx];
                    }
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
                    var nodeData = _uberEventData[nodeId],
                        data = nodeData[eventName],
                        realEvent = evt || dom.getWindow(dom.getDocument(nodeData.__element)).event,
                        lo = data.order.slice(0),
                        lls =  data.listeners,
                        i, l, id;

                    for(i=0, l=lo.length; i<l; i++){
                        id = lo[i];
                        if(typeof id != "undefined" && (id in lls) && !lls[id].paused){
                            lls[id].callback.call(nodeData.__element, realEvent);
                        }
                    }
                }
                function add(callback){
                    var data = _uberEventData[nodeId][eventName],
                        idx = (Math.random() + '').substring(2,14) + (new Date().getTime() + '').substring(8,13);

                    data.order.push(idx);
                    data.listeners[idx] = {
                        callback: callback,
                        paused: false
                    };
                    return new NodeEventHandle(nodeId, eventName, idx);
                }
                return {
                    dispatcher: dispatcher,
                    listeners: {},
                    order: [],
                    add: add
                };
            }
            return createNodeDispatcher;
        })();

        function listen(obj, eventName, func){
            if(!obj.nodeType&&obj!=global){
                throw new Error();
            }
            var id = dom.getNodeId(obj),
                evtName = normalizeEventName(eventName),
                ed = _uberEventData, d;

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
            var id = dom.getNodeId(obj),
                evtName = normalizeEventName(eventName),
                ed = _uberEventData;

            if((id in ed) && (evtName in ed[id])){
                _stopListening(obj, evtName, ed[id][evtName].dispatcher, id);
                delete ed[id][evtName];
            }
        }

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
            preventDefault(evt);
            stopPropagation(evt);
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
                var target = getEventTarget(evt),
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

        if(has("dom-createevent")){
            fireEvent = function fireEvent(element, eventName){
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(eventName, true, true);
                return !element.dispatchEvent(evt);
            };
        }else if(has("dom-createeventobject")){
            fireEvent = function fireEvent(element, eventName){
                var evt = document.createEventObject();
                return element.fireEvent("on"+eventName, evt);
            };
        }else{
            fireEvent = function fireEvent(element, eventName){
                /* do nothing */
            };
        }

        function destroyElementData(element, recurse){
            var id = dom.getNodeId(element),
                data = _uberEventData[id],
                sl = stopListening;

            if(data){
                // This is to keep element out of a closure using forIn
                var keys = object.keys(data),
                    key;
                for(var i=keys.length; i--;){
                    key = keys[i];
                    if(key == "__element"){ continue; }
                    _stopListening(element, key, data[key].dispatcher, id);
                    delete data[key];
                }
            }
            if(recurse){
                destroyDescendantData(element);
            }
            delete _uberEventData[id];
        }
        function destroyDescendantData(element){
            var i = -1, elements = element.getElementsByTagName("*");

            while((element = elements[++i])){
                if(element.nodeType == 1){ // ELEMENT_NODE
                    destroyElementData(element, false);
                }
            }
        }

        (function(){
            var oldDestroyElement = dom.destroyElement;
            function destroyElement(element, parent){
                destroyElementData(element, true);
                oldDestroyElement(element, parent);
            }

            var oldDestroyDescendants = dom.destroyDescendants;
            function destroyDescendants(element){
                destroyDescendantData(element);
                oldDestroyDescendants(element);
            }

            // overrides for functions in dom.js
            dom.destroyElement = destroyElement;
            dom.destroyDescendants = destroyDescendants;
        })();

        var domReady = typeof require != "undefined" && require.ready ? (function(){
            var domReady = new Deferred;

            require.ready(function(){
                domReady.resolve();
            });

            return function(){
                return domReady.promise;
            };
        })() : (function(){
            // This is in a closure to keep the variables in here from being seen.
            var domReady = new Deferred,
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
                    listen(document, "DOMContentLoaded", checkDOMReady);
                }else if(has("dom-element-do-scroll")){
                    // Avoid a potential browser hang when checking window.top (thanks Rich Dougherty)
                    // The value of frameElement can be null or an object.
                    // Checking window.frameElement could throw if not accessible.
                    try { doScrollCheck = global.frameElement === null; } catch(e) { }

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

                listen(global, "load", checkDOMReady);
                listen(document, "readystatechange", checkDOMReady);

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

        var evts = {};
        (function(){
            // The following code only sets up the event on the objects
            // if .then() is called the first time.
            var freeze = Object.freeze||null;
            function unloadDeferred(eventName){
                var attached = 0, deferred = new Deferred,
                    op = deferred.promise,
                    promise = {},
                    then, cancel;
                promise.then = function then(){
                    var result = op.then.apply(op, arguments);
                    if(!attached){
                        attached = 1;
                        listen(global, eventName, function(){
                            deferred.resolve();
                        });
                    }
                    return result;
                };
                promise.cancel = function cancel(){
                    op.cancel.apply(op, arguments);
                };
                if(freeze){
                    freeze(promise);
                }
                deferred.promise = promise;

                then = cancel = null;
                return deferred;
            }

            var unload = unloadDeferred("unload");
            var beforeUnload = unloadDeferred("beforeunload");

            // only pass back the promise so the deferreds can't
            // be modified
            evts.unload = function(){ return unload.promise; };
            evts.beforeUnload = function(){ return beforeUnload.promise; };
        })();

        return {
            listen: listen,
            stopListening: stopListening,
            preventDefault: preventDefault,
            stopPropagation: stopPropagation,
            stopEvent: stopEvent,

            getEventTarget: getEventTarget,
            getRelatedTarget: getRelatedTarget,

            normalizeEventName: normalizeEventName,
            fireEvent: fireEvent,
            domReady: domReady,
            unload: evts.unload,
            beforeUnload: evts.beforeUnload
        };
    });
})(this, typeof define != "undefined" ? define : function(deps, factory){
    this.uber_dom_event = factory(has, uber_dom, uber_object, uber_Deferred); // use global has and uber_*
});
