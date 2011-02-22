(function(define){
define(["./Deferred", "./array"], function(Deferred, array){

    var FN = "function";

    function when(promiseOrValue, callback, errback, progressHandler){
        if(promiseOrValue && typeof promiseOrValue.then == FN){
            return promiseOrValue.then(callback, errback, progressHandler);
        }
        return callback(promiseOrValue);
    }

    function these(promisesOrValues, callback, errback, progressHandler, rejectOnError){
        function addResult(succeeded, result, index){
            results[index] = [succeeded, result];
            finished++;
            if(finished === total){
                callback(results);
            }
        }

        var total, results, finished;

		promisesOrValues = promisesOrValues.slice();
        total = promisesOrValues.length;

        if(total === 0){
            callback([0, []]);
            return;
        }

        results = new Array(total);
        finished = 0;

        array.forEach(promisesOrValues, function(pv, i){
            when(
                pv,
                function(result){
                    addResult(true, result, i);
                },
                function(error){
                    if(rejectOnError){
                        finished = total;
                        errback([i, error]);
                    }else{
                        addResult(false, error, i);
                    }
                    throw error;
                },
                function(update){
                    progressHandler([i, update]);
                }
            );
        });

        return;
    }

    when.these = these;

    return when;
});
})(typeof define != "undefined" ? define : function(deps, factory){
    this.uber_when = factory(uber_Deferred, uber_array); // use global uber_when
});
