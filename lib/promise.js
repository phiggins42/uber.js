(function(define){
define(["uber/object"], function(object){

    function Promise(){}

    Promise.prototype.then = function then(resolvedCb, errorCb, progressCb){
        throw new TypeError("The Promise base class is abstract, this function must be implemented by the Promise implementation");
    };

    function when(promiseOrValue, callback, errback, progressHandler){
        if(promiseOrValue && (promiseOrValue instanceof Promise || object.isFunction(promiseOrValue.then))){
            return promiseOrValue.then(callback, errback, progressHandler);
        }
        return callback(promiseOrValue);
    }

    return {
        Promise: Promise,
        when: when
    };
});
})(typeof define != "undefined" ? define : function(deps, factory){
    this.uber_promise = factory(uber_object); // use global uber_object
});
