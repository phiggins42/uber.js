(function(uber, global){
    uber._topics = {};

    function subscribe(topic, func){
        var f = uber._topics[topic];
        if(!f){
            f = uber._topics[topic] = new uber.Dispatcher;
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

    uber.subscribe = subscribe;
    uber.publish = publish;
})(uber, this);
