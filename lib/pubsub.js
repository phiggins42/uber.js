(function(global, define){
	define(["uber/dispatcher"], function(uber){
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

		return uber;
	});
})(this, typeof define != "undefined" ? define : function(deps, factory){
    factory(uber); // use global uber
});
