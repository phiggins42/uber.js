(function(uber, has, document, global){
    if(!has("dom")){ return; }

    var hasAEL = has("dom-addeventlistener"),
        hasAE = has("dom-attachevent"),
        div = document.createElement("DiV");

    var addEvent, removeEvent;
    if(hasAEL){
        addEvent = function(obj, evtName, handler){
            obj.addEventListener(evtName, handler, false);
        };
        removeEvent = function(obj, evtName, handler){
            obj.removeEventListener(evtName, handler, false);
        };
    }else if(hasAE){
        addEvent = function(obj, evtName, handler){
            obj.attachEvent("on" + evtName, handler);
        };
        removeEvent = function(obj, evtName, handler){
            obj.detachEvent("on" + evtName, handler);
        };
    }else{
        addEvent = function(obj, evtName, handler){
            var attrName = "on" + evtName,
                oldHandler = element[attrName];

            if(oldHandler){
                obj[attrName] = function(){
                    oldHandler.apply(this, arguments);
                    handler.apply(this, arguments);
                };
            }else{
                obj[attrName] = handler;
            }
        };
        removeEvent = function(obj, evtName, handler){
            obj["on" + evtName] = null;
        };
    }
    var domReady = new uber.Deferred(),
        domReadyDone = false,
        documentReadyStates = { 'loaded': 1, 'interactive': 1, 'complete': 1 },
        fixReadyState = typeof document.readyState != "string",
        isLoaded = false,
        pollScrollTimeout;

    function onDOMReady(){
        if(isLoaded){ return; }

        isLoaded = true;
        div = null;

        if(fixReadyState){
            document.readyState = "interactive";
        }
        if(hasAEL){
            removeEvent(document, "DOMContentLoaded", onDOMContentLoaded);
        }
        removeEvent(document, "readystatechange", onReadyStateChange);
        removeEvent(window, "load", onWindowLoad);

        if(pollScrollTimeout){
            clearTimeout(pollScrollTimeout);
        }

        domReady.resolve();
        domReadyDone = true;
    }
    function onDOMContentLoaded(event){
        if(isLoaded){ return; }
        if(documentReadyStates[document.readyState]){
            console.log("onDOMContentLoaded");
            onDOMReady();
        }
    }
    function onReadyStateChange(){
        if(isLoaded){ return; }
        console.log("onReadyStateChange");
        onDOMReady();
    }
    function onWindowLoad(){
        if(!isLoaded){
            console.log("onWindowLoad");
            onDOMReady();
        }else if(!domReadyDone){
            // try again later if domReady is still executing handlers
            setTimeout(function(){ onWindowLoad(); }, 10);
        }
    }
    function pollScroll(){
        if(isLoaded){ return; }
        try { div.doScroll(); } catch(e) {
            pollScrollTimeout = setTimeout(pollScroll, 10);
            return;
        }
        console.log("pollScroll");
        onDOMReady();
    }
    if(document.readyState == "complete"){
        domReady.resolve();
        domReadyDone = true;
    }else{
        // Connect to "load" and "readystatechange", and either connect to
        // "DOMContentLoaded" or poll for div.doScroll. First one fired wins.
        var doScrollCheck = false;
        if(hasAEL){
            addEvent(document, "DOMContentLoaded", onDOMContentLoaded);
        }else if(has("dom-element-do-scroll") && !(has("json-parse") && has("json-stringify"))){
            // Weak inference used as IE 6/7 have the operation aborted error
            // Avoid a potential browser hang when checking window.top (thanks Rich Dougherty)
            // The value of frameElement can be null or an object.
            // Checking window.frameElement could throw if not accessible.
            try { doScrollCheck = global.frameElement == null; } catch(e) { }
        }

        addEvent(global, "load", onWindowLoad);
        addEvent(document, "readystatechange", onReadyStateChange);

        // doScroll will not throw an error when in an iframe
        // so we rely on the event system to fire the domReady event
        // before the window onload in IE6/7
        if(doScrollCheck){
            // Derived with permission from Diego Perini's IEContentLoaded
            // http://javascript.nwbox.com/IEContentLoaded/
            pollScrollTimeout = setTimeout(pollScroll, 10);
        }
    }

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
                addEvent(global, eventName, function(){
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
    uber.domReady = function(){ return domReady.promise; };
    uber.unload = function(){ return unload.promise; };
    uber.beforeUnload = function(){ return beforeUnload.promise; };
})(uber, has, document, this);
