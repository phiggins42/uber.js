(function(global, define){
    define(["./aop"], function(aop){
        var _topics = {},
            after = aop.after;

        function subscribe(topic, func){
            return after(_topics, topic, func);
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
    this.uber_pubsub = factory(uber_aop); // use global uber_aop
});
