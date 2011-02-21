(function(global, define){
    define(["has/events", "./dom", "./array", "./object", "./Deferred"],
    function(has, dom, array, object, Deferred){
        if(!has("dom")){ return {}; }

        // uber is passed in as ubr to keep IE from accessing uber from an
        // activation object in the scope chain.
        var _listen, _cancelAll, _breakLeak,
            preventDefault, stopPropagation, getEventTarget,
            getRelatedTarget, normalizeEventName, fireEvent,
            hasAEL = has("dom-addeventlistener");

        function nop(){}

        has.add("dom-createevent", function(g, d){
            return has.isHostType(d, "createEvent");
        });

        has.add("dom-createeventobject", function(g, d){
            return has.isHostType(d, "createEventObject");
        });

        if(hasAEL){
            // W3C
            _listen = function _listen(obj, eventName, func){
                obj.addEventListener(eventName, func, false);
            };
            _cancelAll = function _cancelAll(obj, eventName, func){
                obj.removeEventListener(eventName, func, false);
            };
        }else{
            // DOM0
            // IE is handled with DOM0 because attachEvent handlers
            // fire in random order
            _listen = function _listen(obj, eventName, func, id){
                var f = obj[eventName], ed = _uberEventData,
                    d = ed[id].events[eventName];
                d.original = f||nop;
                obj[eventName] = func;
            };
            _cancelAll = function _cancelAll(obj, eventName, func, id){
                var ed = _uberEventData, d = ed[id].events[eventName],
                    f = d.original;
                obj[eventName] = f;
            };
        }

        global._uberEventData = {
            '0': { events: {} }, // window
            '1': { events: {} }  // document
        };

        var createEventData = (function(){
            function createEventData(nodeId, eventName){
                var order = [];
                function getData(){
                    return _uberEventData[nodeId].events[eventName];
                }
                function dispatcher(evt){
                    var nodeData = _uberEventData[nodeId],
                        evtData = nodeData.events[eventName],
                        element = nodeData.element,
                        realEvent = evt || dom.getWindow(dom.getDocument(element)).event,
                        listener_order = order.slice(),
                        original = evtData.original,
                        listeners =  evtData.listeners,
                        i = listener_order.length,
                        listener, res;

                    if(original !== nop){
                        res = original.call(element, realEvent);
                    }
                    while(i--){
                        listener = listeners[listener_order[i]];
                        listener && (!listener.paused) && listener.call(element, realEvent);
                    }

                    return res;
                }
                function add(callback){
                    var data = getData(),
                        idx = (Math.random()+'').substring(2,14) + ((+new Date())+'').substring(8,13);

                    order.unshift(idx);
                    data.listeners[idx] = callback;
                    callback.paused = false;

                    return {
                        cancel: function(){
                            order.splice(array.lastIndexOf(order, idx), 1);
                            delete getData().listeners[idx];
                        },
                        pause: function(){
                            getData().listeners[idx].paused = true;
                        },
                        resume: function(){
                            getData().listeners[idx].paused = false;
                        },
                        paused: function(){
                            return getData().listeners[idx].paused;
                        }
                    };
                }
                return {
                    dispatcher: dispatcher,
                    listeners: {},
                    original: nop,
                    add: add
                };
            }
            return createEventData;
        })();

        var getEventData = (function(){
            return function(element, id, eventName){
                var nd = _uberEventData[id], evts, ed;

                if(!nd){
                    evts = {};
                    nd = _uberEventData[id] = {
                        element: element,
                        events: evts
                    };
                }else{
                    evts = nd.events;
                }

                if(!(ed = evts[eventName])){
                    ed = evts[eventName] = createEventData(id, eventName);
                }

                return ed;
            };
        })();

        function listen(obj, eventName, func){
            if(!obj.nodeType&&obj!=global){
                throw new Error;
            }
            var id = dom.getNodeId(obj),
                evtName = normalizeEventName(eventName),
                ed = getEventData(obj, id, evtName);

            if(!ed.dispatcher.attached){
                _listen(obj, evtName, ed.dispatcher, id);
                ed.dispatcher.attached = true;
            }
            return ed.add(func);
        }

        function cancelAll(obj, eventName){
            var win;
            if(!obj.nodeType&&obj!=global){
                throw new Error;
            }
            var id = dom.getNodeId(obj),
                evtName = normalizeEventName(eventName),
                ed = _uberEventData, evts;

            if((id in ed)){
                evts = ed[id].events;
                if(evts && (evtName in evts)){
                    _cancelAll(obj, evtName, evts[evtName].dispatcher, id);
                    delete evts[evtName];
                }
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
                evtData;

            if(data && data.element === element){
                evtData = data.events;
                // This is to keep element out of a closure using forIn
                var keys = object.keys(evtData),
                    i = keys.length,
                    key;
                while(i--){
                    key = keys[i];
                    _cancelAll(element, key, evtData[key].dispatcher, id);
                    delete evtData[key];
                }
            }
            if(recurse){
                destroyDescendantData(element);
            }
            delete _uberEventData[id];
        }
        function destroyDescendantData(element){
            var elements = element.getElementsByTagName("*"),
                i = elements.length;

            while(i--){
                element = elements[i];
                if(element.nodeType == 1){ // ELEMENT_NODE
                    destroyElementData(element, false);
                }
            }
        }

        (function(){
            var dom_destroyElement = dom.destroyElement;
            function destroyElement(element, parent){
                destroyElementData(element, true);
                dom_destroyElement(element, parent);
            }

            var dom_destroyDescendants = dom.destroyDescendants;
            function destroyDescendants(element){
                destroyDescendantData(element);
                dom_destroyDescendants(element);
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
                cancelAll(document, "DOMContentLoaded");
                cancelAll(document, "readystatechange");
                cancelAll(global, "load");

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
            cancelAll: cancelAll,
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
