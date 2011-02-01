(function(define){
define(["./promise", "./object"], function(prms, object){
    var FN = "function",
        freeze = Object.freeze || function(){};

    function Deferred(canceller){
        this.fired = -1;

        var result, finished, isError, head, nextListener;
        var promise = this.promise = new prms.Promise;

        function complete(value){
            if(finished){
                throw new Error("This deferred has already been resolved");                
            }
            result = value;
            finished = true;
            notify();
        }
        function notify(){
            while(nextListener){
                var listener = nextListener,
                    ld = listener.deferred;
                nextListener = nextListener.next;
                var func = (isError ? listener.error : listener.resolved);
                if(func){
                    try{
                        var newResult = func(result);
                        if(newResult && typeof newResult.then == FN){
                            newResult.then(ld.resolve, ld.reject);
                            continue;
                        }
                        var unchanged = newResult === undefined;
                        ld[unchanged && isError ? "reject" : "resolve"](unchanged ? result : newResult);
                    }catch(e){
                        ld.reject(e);
                    }
                }else{
                    if(isError){
                        ld.reject(result);
                    }else{
                        ld.resolve(result);
                    }
                }
            }
        }

        function resolve(value){
            // summary:
            //        Fulfills the Deferred instance successfully with the provide value
            isError = false;
            this.fired = 0;
            this.results = [value, null];
            complete(value);
        }

        function reject(error){
            // summary:
            //        Fulfills the Deferred instance as an error with the provided error 
            isError = true;
            this.fired = 1;
            complete(error);
            this.results = [null, error];
            if(!error || error.log !== false){
                if(typeof console != "undefined"){
                    console.error(error);
                }
            }
        }

        function progress(update){
            // summary
            //        Send progress events to all listeners
            var listener = nextListener;
            while(listener){
                var progress = listener.progress;
                progress && progress(update);
                listener = listener.next;    
            }
        }

        function then(resolvedCb, errorCb, progressCb){
            var newDeferred = new Deferred(promise.cancel);
            var listener = {
                resolved: resolvedCb,
                error: errorCb,
                progress: progressCb,
                deferred: newDeferred
            };
            if(nextListener){
                head = head.next = listener;
            }else{
                nextListener = head = listener;
            }
            if(finished){
                notify();
            }
            return newDeferred.promise;
        }

        var self = this;
        function cancel(){
            // summary:
            //        Cancels the asynchronous operation
            if(!finished){
                var error = canceller && canceller(self);
                if(!finished){
                    if (!(error instanceof Error)) {
                        error = new Error(error);
                    }
                    error.log = false;
                    self.reject(error);
                }
            }
        }

        this.resolve = resolve;
        this.reject = reject;
        this.progress = progress;
        this.cancel = promise.cancel = cancel;
        this.then = promise.then = then;
        freeze(promise);
    }
    Deferred.prototype = new prms.Promise;
    Deferred.prototype.constructor = Deferred;

    function Deferreds(defs, canceller){
        Deferred.call(this, canceller);

        var self = this,
            finished = 0,
            resultList = [];

        if(!defs.length){
            this.resolve([0, []]);
        }
        function addResult(succeeded, result, idx){
            resultList[idx] = [succeeded, result];
            finished++;
            if(finished === defs.length){
                self.resolve(resultList);
            }
        }
        array.forEach(defs, function(def, i){
            def.then(
                function(result){
                    addResult(true, result, i);
                },
                function(error){
                    addResult(false, error, i);
                    throw error;
                }
            );
        });
    }
    Deferreds.prototype = new Deferred;
    Deferreds.prototype.constructor = Deferreds;

    return {
        Deferred: Deferred,
        Deferreds: Deferreds
    };

});
})(typeof define != "undefined" ? define : function(deps, factory){
    this.uber_deferred = factory(uber_promise, uber_object); // use global uber_*
});
