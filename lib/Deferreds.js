(function(define){
define(["./Deferred"], function(Deferred){
    function Deferreds(defs, canceller){
        Deferred.call(this, canceller);

        var self = this,
            finished = 0,
            total = defs.length,
            resultList = new Array(total),
            i;

        function addResult(succeeded, result, idx){
            resultList[idx] = [succeeded, result];
            if(finished++ === total){
                self.resolve(resultList);
            }
        }

        if(!total){
            this.resolve([0, []]);
            return;
        }

        for(i=0; i<total; i++){
            if(!(i in defs)){ continue; }
            (function(def, i){
                def.then(
                    function(result){
                        addResult(true, result, i);
                    },
                    function(error){
                        addResult(false, error, i);
                        throw error;
                    },
                    function(update){
                        self.progress([i, update]);
                    }
                );
            })(defs[i], i);
        }
    }
    Deferreds.prototype = new Deferred;

    return Deferreds;
});
})(typeof define != "undefined" ? define : function(deps, factory){
    this.uber_Deferreds = factory(uber_Deferred); // use global uber_Deferred
});
