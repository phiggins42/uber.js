(function(define){
define(["./Deferred"], function(Deferred){

    var Promise = Deferred.Promise;

    function when(promiseOrValue, callback, errback, progressHandler){
        if(promiseOrValue instanceof Promise){
            // we can trust it to return a new promise
            return promiseOrValue.then(callback, errback, progressHandler);
        }
        if(promiseOrValue && typeof promiseOrValue.then == "function"){
            // its a promise, but not sure how then will behave, so we wrap with a Deferred
            var deferred = new Deferred();
            promiseOrValue.then(function(value){
                deferred.resolve(value);
            }, function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        }
        return callback(promiseOrValue);
    }

    function these(promisesOrValues, callback, errback, progressHandler, rejectOnError){
        function addResult(succeeded, result, index){
            results[index] = [succeeded, result];
            finished++;
            if(finished === total){
                callbackResult = callback(results);
                defd && defd.resolve(callbackResult);
            }
        }

        var total, results, finished, callbackResult, defd, i;

		promisesOrValues = promisesOrValues.slice();
        total = promisesOrValues.length;

        if(total === 0){
            return callback([]);
        }

        results = new Array(total);
        finished = 0;

        for(i = 0; i < total; i++){
            if(!(i in promisesOrValues)){ continue; }
            (function(pv, i){
                when(
                    pv,
                    function(result){
                        addResult(true, result, i);
                    },
                    errback ? function(error){
                        if(rejectOnError){
                            finished = total;
                            errback([i, error]);
                            defd && defd.reject([i, error]);
                        }else{
                            addResult(false, error, i);
                        }
                        throw error;
                    } : null,
                    progressHandler ? function(update){
                        progressHandler([i, update]);
                    } : null
                );
            })(promisesOrValues[i], i);
        }
        if(finished == total){
            return callbackResult;
        }else{
            defd = new Deferred;
            return defd.promise;
        }
    }

    when.these = these;

    return when;
});
})(typeof define != "undefined" ? define : function(deps, factory){
    this.uber_when = factory(uber_Deferred); // use global uber_Deferred
});
