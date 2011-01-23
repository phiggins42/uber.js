(function(define){
define(["uber/function"], function(uber){

    function Promise(){}

    Promise.prototype.then = function then(resolvedCb, errorCb, progressCb){
        throw new TypeError("The Promise base class is abstract, this function must be implemented by the Promise implementation");
    };

    function when(promiseOrValue, callback, errback, progressHandler){
        if(promiseOrValue && (promiseOrValue instanceof uber.Promise || uber.isFunction(promiseOrValue.then))){
            return promiseOrValue.then(callback, errback, progressHandler);
        }
        return callback(promiseOrValue);
    }

    uber.Promise = Promise;
    uber.when = when;

	return uber;
});
})(typeof define != "undefined" ? define : function(deps, factory){
    factory(uber); // use global uber
});
