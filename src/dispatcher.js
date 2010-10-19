(function(uber, has, global){

    function Handle(){}

    var ap = Array.prototype;
    function createDispatcher(){
        var listeners = [], nextId = 0;
        function dispatcher(){
            var ls = listeners.slice(1),
                first = listeners[0],
                r, i, l;

            if(first && !first.paused){
                r = first.callback.apply(this, arguments);
            }
            for(i=0, l=ls.length; i<l; i++){
                var ln = ls[i];
                if(!(i in ap) && ln && !ln.paused){
                    ln.callback.apply(this, arguments);
                }
            }
            return r;
        }
        function add(callback){
            var h = new Handle, id = nextId++,
                l = listeners[id] = {
                    callback: callback,
                    handle: h,
                    paused: false
                };

            function cancel(){
                delete listeners[id];
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
            h.cancel = cancel;
            h.pause = pause;
            h.resume = resume;
            h.paused = paused;

            return h;
        }
        dispatcher.add = add;
        return dispatcher;
    }

    function connect(obj, method, func){
        var f = (obj||global)[method];
        if(!f || !(f.add&&f.remove)){
            var d = createDispatcher();
            f && d.add(f);
            f = obj[method] = d;
        }
        return f.add(func);
    }

    uber.createDispatcher = createDispatcher;
    uber.connect = connect;

})(uber, has, this);
