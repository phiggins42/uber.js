(function(global, define){
    define(["has/dom", "./Deferred"],
        function(has, Deferred){
            var domReady = new Deferred,
                readyStates = { "loaded": 1, "interactive": 1, "complete": 1 },
                loadEvents = { "DOMContentLoaded": 1, "load": 1, "readystatechange": 1 },
                fixReadyState = typeof document.readyState != "string",
                hasAEL = has("dom-addeventlistener"),
                ready = false,
                doScrollCheck = false,
                i = 0,
                pollerTO, removers, remover,
                div, checkDOMReady, addEvent;

            function onDOMReady(){
                if(ready){ return; }

                ready = true;
                div = null;

                if(pollerTO){ clearTimeout(pollerTO); }
                while((remover = removers[i++])){ remover(); }

                if(fixReadyState){
                    document.readyState = "interactive";
                }

                domReady.resolve();
            }

            function poller(){
                if(ready){ return; }
                checkDOMReady();
                if(!ready){
                    pollerTO = setTimeout(poller, 30);
                }
            }

            if(typeof require != "undefined" && require.ready && require.s){
                // RequireJS
                var oldCallReady = require.callReady;
                if(require.s.isPageLoaded){
                    domReady.resolve();
                }else{
                    require.callReady = function(){
                        if(require.s.isPageLoaded){
                            domReady.resolve();
                        }
                        oldCallReady.apply(this, arguments);
                    };
                }
            }else if(document.readyState == "complete"){
                domReady.resolve();
            }else{
                div = document.createElement("div");
                checkDOMReady = function(evt){
                    if(ready){
                        if(pollerTO){
                            clearTimeout(pollerTO);
                        }
                    }else if((evt && loadEvents[evt.type]) ||
                            readyStates[document.readyState]){
                        onDOMReady();
                    }
                };
                addEvent = hasAEL ?
                    function(node, event){
                        node.addEventListener(event, checkDOMReady, false);
                        return function(){ node.removeEventListener(event, checkDOMReady, false); };
                    } :
                    function(node, event){
                        node.attachEvent('on' + event, checkDOMReady);
                        return function(){ node.detachEvent(event, checkDOMReady); };
                    };

                // Connect to "load" and "readystatechange", poll for "readystatechange",
                // and either connect to "DOMContentLoaded" or poll for div.doScroll.
                // First one fired wins.
                removers = [
                    addEvent(global, "load"),
                    addEvent(document, "readystatechange"),
                    addEvent(document, "DOMContentLoaded")
                ];
                if(!hasAEL && has("dom-element-do-scroll")){
                    // Avoid a potential browser hang when checking window.top (thanks Rich Dougherty)
                    // The value of frameElement can be null or an object.
                    // Checking window.frameElement could throw if not accessible.
                    try { doScrollCheck = global.frameElement === null; } catch(e) { }

                    checkDOMReady = function(){
                        // doScroll will not throw an error when in an iframe
                        // so we rely on the event system to fire the domReady event
                        // before the window onload in IE6/7
                        //
                        // Derived with permission from Diego Perini's IEContentLoaded
                        // http://javascript.nwbox.com/IEContentLoaded/
                        if(doScrollCheck){
                            try{
                                div.doScroll();
                            }catch(e){ return; }
                            onDOMReady();
                        }
                    };
                }

                pollerTO = setTimeout(poller, 30);
            }

            return domReady.promise;
        });
})(this, typeof define != "undefined" ? define : function(deps, factory){
    this.uber_dom_ready = factory(has, uber_Deferred); // use global has and uber_*
});
