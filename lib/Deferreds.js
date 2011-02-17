(function(define){
define(["./Deferred"], function(Deferred){
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

    return Deferreds;
});
})(typeof define != "undefined" ? define : function(deps, factory){
    this.uber_Deferreds = factory(uber_Deferred); // use global uber_*
});
