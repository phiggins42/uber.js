(function(uber, has){

    function Promise(){}

    (function(){
        function get(propertyName){
            return this.then(function(value){
                return value[propertyName];
            });
        }
        function put(propertyName, value){
            return this.then(function(value){
                return object[propertyName] = value;
            });
        }
        function call(functionName /*, args */){
            var args = uber.toArray(arguments, 1);
            return this.then(function(value){
                return value[functionName].apply(value, args);
            });
        }
        function then(resolvedCb, errorCb, progressCb){
            throw new TypeError("The Promise base class is abstract, this function must be implemented by the Promise implementation");
        }
        uber.mixin(Promise.prototype, {
            get: get,
            put: put,
            call: call,
            then: then
        });
    })();

    uber.Promise = Promise;

    function when(promiseOrValue, callback, errback, progressHandler){
        if(promiseOrValue && uber.isFunction(promiseOrValue.then)){
            return promiseOrValue.then(callback, errback, progressHandler);
        }
        return callback(promiseOrValue);
    }
    uber.when = when;

})(uber, has);
