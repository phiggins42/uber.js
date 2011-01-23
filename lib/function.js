(function(define){
define(["has/function", "uber/array"], function(has, uber){
	var STR = "string",
		FN = "function",
		bind
	;

	if(has("function-bind")){
		bind = function bind(func, scope){
			var args = uber.toArray(arguments, 1);
			return func.bind.apply(func, args);
		};
	}else{
		bind = function bind(func, scope){
			var _ta = uber.toArray,
				pre = _ta(arguments, 2);
			function innerBind(){
				var args = _ta(arguments);
				return func.apply(scope, pre.concat(args));
			}
			return innerBind;
		};
	}

	function curry(func){
		var pre = uber.toArray(arguments, 1);
		function innerCurry(){
			var bound = uber.bind.apply(uber, [func, this].concat(pre));
			return bound.apply(bound, arguments);
		}
		return innerCurry;
	}

	uber.bind = bind;
	uber.curry = curry;

	return uber;
});
})(typeof define != "undefined" ? define : function(deps, factory){
    factory(has, uber); // use global has and uber
});
