(function(global, define){
	define(["uber"], function(uber){

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

		function createDispatcher(original){
			var before = [], after = [];
			function dispatch(list, target, args){
				var i, l, ls;
				for(i=0, l=list.length; i<l; i++){
					ls = list[i];
					if((i in list) && !ls.paused){
						ls.callback.apply(target, args);
					}
				}
			}
			function Dispatcher(){
				var bfs = before.slice(),
					afs = after.slice(),
					r;

				dispatch(bfs, this, arguments);
				if(original){
					r = original.apply(this, arguments);
				}
				dispatch(afs, this, arguments);
				return r;
			}
			function createAspect(type, list, modFunc){
				return function(callback){
					var l = {
						callback: callback,
						paused: false
					};
					modFunc.call(list, l);

					return new Handle(l, list);
				};
			}
			Dispatcher.after =
				Dispatcher.add =
					createAspect("after", after, Array.prototype.push);

			Dispatcher.before =
				createAspect("before", before, Array.prototype.unshift);

			Dispatcher._original = original;

			return Dispatcher;
		}

		function connect(obj, method, func, before){
			// DO NOT use this on nodes.  For nodes, use uber.listen.
			var f = (obj||global)[method];
			if(!f || (!f.after && !f.before && !f._original)){
				var d = uber.createDispatcher(f);
				f = obj[method] = d;
			}
			return f[before ? "before" : "after"](func);
		}

		function after(obj, method, func){
			return uber.connect(obj, method, func, false);
		}

		function before(obj, method, func){
			return uber.connect(obj, method, func, true);
		}

		function disconnect(obj, method){
			var f = (obj||global)[method];
			if(f && f.add && f.before && f._original){
				obj[method] = f._original;
			}
		}

		uber.createDispatcher = createDispatcher;
		uber.connect = connect;
		uber.after = after;
		uber.before = before;
		uber.disconnect = disconnect;

		return uber;

	});
})(this, typeof define != "undefined" ? define : function(deps, factory){
	factory(uber); // use global uber
});
