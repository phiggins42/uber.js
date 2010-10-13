(function(uber, has){

    function Promise(){}

    Promise.prototype.then = function then(resolvedCb, errorCb, progressCb){
        throw new TypeError("The Promise base class is abstract, this function must be implemented by the Promise implementation");
    };

    uber.Promise = Promise;

    function when(promiseOrValue, callback, errback, progressHandler){
        if(promiseOrValue && uber.isFunction(promiseOrValue.then)){
            return promiseOrValue.then(callback, errback, progressHandler);
        }
        return callback(promiseOrValue);
    }
    uber.when = when;

})(uber, has);
