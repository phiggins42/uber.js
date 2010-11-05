(function(uber){
    function Deferreds(defs, canceller){
        uber.Deferred.call(this, canceller);

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
        uber.forEach(defs, function(def, i){
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
    Deferreds.prototype = new uber.Deferred;
    Deferreds.prototype.constructor = Deferreds;

    uber.Deferreds = Deferreds;
})(uber);
