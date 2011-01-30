(function(global, define){
    define(["uber/dispatcher"], function(disp){
        var _topics = {};

        function subscribe(topic, func){
            var f = _topics[topic];
            if(!f){
                f = _topics[topic] = disp.createDispatcher();
            }
            return f.add(func);
        }

        function publish(topic, args){
            var f = _topics[topic];
            if(f){
                f.apply(global, args||[]);
            }
        }

        function cancelSubscriptions(topic){
            delete _topics[topic];
        }

        return {
            subscribe: subscribe,
            publish: publish,
            cancelSubscriptions: cancelSubscriptions
        };
    });
})(this, typeof define != "undefined" ? define : function(deps, factory){
    this.uber_pubsub = factory(uber_dispatcher); // use global uber_dispatcher
});
