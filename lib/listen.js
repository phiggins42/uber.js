/*
 * An events module built using very minimal code needed. The export of this module 
 * is a function that can be used to listen for events on a target:
 * listen = require("uber/listen");
 * listen(node, "click", clickHandler);
 * 
 * The export of this module can be used as a mixin, to add on() and emit() methods
 * for listening for events and dispatching events:
 * var Evented = require("uber/listen").Evented;
 * var EventedWidget = Compose(Evented, Widget);
 * widget = new EventedWidget();
 * widget.on("open", function(event){
 *     ... do something with event
 * });
 *
 * widget.emit("open", {name:"some event", ...});
 * 
 * You can also use listen function itself as a pub/sub hub:
 * listen("some/topic", function(event){
 *     ... do something with event
 * });
 * listen.publish("some/topic", {name:"some event", ...});
 */

(function(global, define){
define(["has/dom", "./aop", "./dom"], function(has, aop, dom){
    "use strict";

    function listen(target, type, listener){
        if(this == undefinedThis || !this.on){
            if(!listener){
                // two args, do pub/sub
                return listen(listen, target, type);
            }
            // this is being called directly, not being used for compose
            if(target.on){ // delegate to the target's on() method
                return target.on(type, listener);
            }
            // call with two args, where the target is |this|
            return prototype.on.call(target, type, listener);
        }/*else{
             being used as a mixin, don't do anything
        }*/
    }

    function publish(type, event){
        type = "on" + type;
        this[type] && this[type](event);
    }
    listen.publish = listen.emit = publish;

    function on(type, listener){
        var signal, node = this;

        if(typeof type == "function"){
            // event handler function
            // listen(node, dojo.touch.press, touchListener);
            return type(this, listener);
        }

        // normal path, the target is |this|
        if(this.addEventListener){
            // the target has addEventListener, which should be used if available (might or might not be a node, non-nodes can implement this method as well)
            var caller = function(){
                if(!caller.paused){
                    listener.apply(this, arguments);
                }
            };
            signal = {
                pause: function(){
                    caller.paused = 1;
                },
                resume: function(){
                    caller.paused = 0;
                },
                cancel: function(){
                    node.removeEventListener(type, caller, false);
                }
            };
            node.addEventListener(type, caller, false);
            return signal;
        }

        type = "on" + type;

        if(this.attachEvent && createHandler){
            var win = dom.getWindow(node);
            // In IE, window == document is true, but document == window is false
            // The following tests use that
            if(typeof node.uniqueNumber == "number" ||
                 // check if |this| is window
                 node == win ||
                 // or if |this| is document
                 node.nodeType == 9){
                // IE 7 and earlier
                var nodeId = dom.getNodeId(node),
                    nodeData = __event_cache__[nodeId],
                    existing = node[type],
                    needHandler = (!existing || !existing.attached),
                    handler;
                if(!nodeData){
                    nodeData = __event_cache__[nodeId] = {};
                }

                // add the existing function to the dispatcher
                if(existing && needHandler){
                    aop.after(nodeData, type, existing);
                }

                signal = aop.after(nodeData, type, listener);

                if(needHandler){
                    // only create a handler if we need it
                    node[type] = handler = createHandler(nodeId, type);
                    handler.attached = 1;
                }

                return signal;
            }
        }

        // If this is a node, DOM0; otherwise, aop
        return aop.after(this, type, listener);
    }

    var undefinedThis = (function(){
            return this; // this depends on strict mode
        })(),
        createHandler,
        major, minor,
        prototype = (listen.Evented = function(){}).prototype;

    if(has("jscript") && has("jscript") <= 5.7){
        // intentionally a global to break JScript <=5.7 memory leaks 
        global.__event_cache__ = {
            '0': {}, // window
            '1': {}  // document
        };
        createHandler = function(id, event){
            return function(){
                if(id in __event_cache__ && event in __event_cache__[id]){
                    __event_cache__[id][event].call(this, dom.getWindow(dom.getDocument(this)).event);
                }
            };
        };
    }

    prototype.on = on;
    prototype.emit = publish;

    return listen;
});
})(this, typeof define != "undefined" ? define : function(deps, factory){
    // if directly loaded, make uber_listen a global
    this.uber_listen = factory(has, uber_aop, uber_dom);
});
