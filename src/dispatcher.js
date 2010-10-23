(function(uber, has, global){

    function Handle(args){
        uber.mixin(this, args);
    }

    var ap = Array.prototype;
    function createDispatcher(){
        var listeners = [], first;
        function dispatcher(){
            var lls = listeners.slice(0),
                r, i, l, ls;

            if(first){
                r = first.apply(this, arguments);
            }
            for(i=0, l=lls.length; i<l; i++){
                ls = lls[i];
                if((i in lls) && !ls.paused){
                    ls.callback.apply(this, arguments);
                }
            }
            return r;
        }
        function add(callback){
            var l = {
                callback: callback,
                paused: false
            };
            listeners.push(l);

            function cancel(){
                for(var i=listeners.length; i--;){
                    if(listeners[i] === l){
                        listeners.splice(i, 1);
                    }
                }
            }
            function pause(){
                l.paused = true;
            }
            function resume(){
                l.paused = false;
            }
            function paused(){
                return l.paused;
            }

            return new Handle({
                cancel: cancel,
                pause: pause,
                resume: resume,
                paused: paused
            });
        }
        function addFirst(callback){
            first = callback;
            dispatcher.add = add;
        }
        dispatcher.add = addFirst;
        return dispatcher;
    }

    function connect(obj, method, func){
        // DO NOT use this on nodes.  For nodes, use uber.listen.
        var f = (obj||global)[method];
        if(!f || !f.add){
            var d = createDispatcher();
            d.add(f);
            f = obj[method] = d;
        }
        return f.add(func);
    }

    uber.createDispatcher = createDispatcher;
    uber.connect = connect;

})(uber, has, this);
