(function(global, define){
    define(["has/events", "./dom", "./object", "./Deferred", "./listen"],
    function(has, dom, object, Deferred, listen){
        if(!has("dom")){ return {}; }

        // uber is passed in as ubr to keep IE from accessing uber from an
        // activation object in the scope chain.
        var _breakLeak,
            preventDefault, stopPropagation, getEventTarget,
            getRelatedTarget, normalizeEventName, fireEvent,
            hasAEL = has("dom-addeventlistener");

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

        function destroyElementData(element, recurse){
            var id = dom.getNodeId(element),
                data = __cache__[id],
                evtData;

            if(data){
                // This is to keep element out of a closure using forIn
                var keys = object.keys(data),
                    i = keys.length,
                    key;
                while(i--){
                    key = keys[i];
                    delete data[key];
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

        if(has.isHostType(document, "attachEvent") && has("dom-uniquenumber")){
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
        }

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
            preventDefault: preventDefault,
            stopPropagation: stopPropagation,
            stopEvent: stopEvent,

            getEventTarget: getEventTarget,
            getRelatedTarget: getRelatedTarget,

            normalizeEventName: normalizeEventName,
            fireEvent: fireEvent,
            unload: evts.unload,
            beforeUnload: evts.beforeUnload
        };
    });
})(this, typeof define != "undefined" ? define : function(deps, factory){
    this.uber_dom_event = factory(has, uber_dom, uber_object, uber_Deferred, uber_listen); // use global has and uber_*
});
