(function(uber, has, global){

    function Handle(args){
        uber.mixin(this, args);
    }

    var ap = Array.prototype;
    function createDispatcher(){
        var listeners = [];
        function dispatcher(){
            var lls = listeners.slice(0),
                first = lls[0],
                r, i, l, ls;

            if(first && !first.paused){
                r = first.callback.apply(this, arguments);
            }
            for(i=1, l=lls.length; i<l; i++){
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
        dispatcher.add = add;
        return dispatcher;
    }

    function connect(obj, method, func){
        var f = (obj||global)[method];
        if(!f || !f.add){
            var d = createDispatcher();
            f && d.add(f);
            f = obj[method] = d;
        }
        return f.add(func);
    }

    uber.createDispatcher = createDispatcher;
    uber.connect = connect;

})(uber, has, this);
