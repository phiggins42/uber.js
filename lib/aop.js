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
define([], function(){
    var ap = [];
    function dispatch(list, target, args){
        list = list.slice();
        for(var i=0, listener; listener=list[i]; i++){
            if(!listener.paused){
                listener.apply(target, args);
            }
        }
    }
    function createAspect(list, method){
        return function(listener){
            var handle = {
                stop: function(){
                    list.splice(list.indexOf(listener), 1);
                },
                resume: function(){
                    listener.paused = false;
                },
                pause: function(){
                    listener.paused = true;
                }
            };
            method.call(list, listener);
            return handle;
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

                dispatcher.before = createAspect(before, ap.unshift);
                dispatcher.after = createAspect(after, ap.push);
            }
            return (dispatcher || existing)[type](advice);
        };
    }
    return {
        after: aspect("after"),
        before: aspect("before")
    };
});
