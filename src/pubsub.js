(function(uber, global){
    uber._topics = {};

    function subscribe(topic, func){
        var f = uber._topics[topic];
        if(!f){
            f = uber._topics[topic] = uber.createDispatcher();
            f.add(null);
        }
        return f.add(func);
    }

    function publish(topic, args){
        var f = uber._topics[topic];
        if(f){
            f.apply(global, args||[]);
        }
    }

    function cancelSubscriptions(topic){
        delete uber._topics[topic];
    }

    uber.subscribe = subscribe;
    uber.publish = publish;
    uber.cancelSubscriptions = cancelSubscriptions;

})(uber, this);
