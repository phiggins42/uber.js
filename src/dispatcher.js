(function(uber, global){

    function Handle(listener, listeners){
        function cancel(){
            for(var i=listeners.length; i--;){
                if(listeners[i] === listener){
                    listeners.splice(i, 1);
                }
            }
        }
        function pause(){
            listener.paused = true;
        }
        function resume(){
            listener.paused = false;
        }
        function paused(){
            return listener.paused;
        }

        this.cancel = cancel;
        this.pause = pause;
        this.resume = resume;
        this.paused = paused;
    }

    function Dispatcher(){
        var listeners = [], first;
        function Dispatcher(){
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

            return new Handle(l, listeners);
        }
        function addFirst(callback){
            first = callback;
            Dispatcher.add = add;
        }
        Dispatcher.add = addFirst;
        return Dispatcher;
    }

    function connect(obj, method, func){
        // DO NOT use this on nodes.  For nodes, use uber.listen.
        var f = (obj||global)[method];
        if(!f || !f.add){
            var d = new uber.Dispatcher;
            d.add(f);
            f = obj[method] = d;
        }
        return f.add(func);
    }

    uber.Dispatcher = Dispatcher;
    uber.connect = connect;

})(uber, this);
