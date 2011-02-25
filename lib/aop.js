/*
 * AOP Advice
 * Use this to add "before" or "after" advice to methods. For examples:
 * var aop = require("pckg/aop");
 * var handle = aop.after(targetObject, "methodName", function(someArgument){
 *     // this will be called when targetObject.methodName() is called, after the original function is called
 * });
 * 
 * handle.pause(); // this will pause the advice from being executed
 * handle.resume(); // this will resume the advice being executed
 * handle.stop(); // this will stop the advice from being executed
 * 
 * aop.before(targetObject, "methodName", function(someArgument){
 *     // this will be called when targetObject.methodName() is called, before the original function is called
 * });
 * 
 * Note that "around" advice is not included in this module since it is so well supported 
 * natively in JavaScript. No should be using a library to provide "around" advice.
 */
"use strict";
(function(define){
define([], function(array){
    var ap = [],
        nop = function(){};
    function dispatch(list, target, args){
        list = list.slice();

        var i = list.length, caller;
        // the lists are reversed, so we can reverse loop
        // through them
        while((caller = list[--i])){
            (!caller.paused) && caller(target, args);
        }
    }
    function createAspect(list, method){
        return function(listener){
            function caller(target, args){
                listener.apply(target, args);
            }
            method.call(list, caller);
            var h = {
                stop: function(){
                    var i = list.length;
                    while(i--){
                        if(list[i] === caller){
                            list.splice(i, 1);
                            break;
                        }
                    }
                },
                resume: function(){
                    caller.paused = false;
                },
                pause: function(){
                    caller.paused = true;
                }
            };
            return h;
        };
    }
    function aspect(type){
        return function(target, methodName, advice){
            var existing = target[methodName], dispatcher;

            if(!existing || !existing.after){
                // no dispatcher in place
                var before = [], after = [];
                dispatcher = target[methodName] = function(){
                    dispatch(before, this, arguments);
                    // call the original method
                    var result = existing && existing.apply(this, arguments);
                    dispatch(after, this, arguments);
                    return result;
                };

                // pass the opposite function so we can reverse
                // loop through the lists
                dispatcher.before = createAspect(before, ap.push);
                dispatcher.after = createAspect(after, ap.unshift);
            }
            return (dispatcher || existing)[type](advice);
        };
    }
    return {
        after: aspect("after"),
        before: aspect("before")
    };
});
})(typeof define != "undefined" ? define : function(deps, factory){
    // if directly loaded, make uber_aop a global
    this.uber_aop = factory();
});
