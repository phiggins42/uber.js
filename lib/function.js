(function(define){
define(["has/function", "./array"], function(has, array){
    var STR = "string",
        FN = "function",
        bind
    ;

    if(has("function-bind")){
        bind = function bind(func, scope){
            var args = array.toArray(arguments, 1);
            return func.bind.apply(func, args);
        };
    }else{
        bind = function bind(func, scope){
            var _ta = array.toArray,
                pre = _ta(arguments, 2);
            function innerBind(){
                var args = _ta(arguments);
                return func.apply(scope, pre.concat(args));
            }
            return innerBind;
        };
    }

    function curry(func){
        var pre = array.toArray(arguments, 1);
        function innerCurry(){
            var bound = bind.apply(null, [func, this].concat(pre));
            return bound.apply(bound, arguments);
        }
        return innerCurry;
    }

    return {
        bind: bind,
        curry: curry
    };

});
})(typeof define != "undefined" ? define : function(deps, factory){
    this.uber_function = factory(has, uber_array); // use global has and uber_array
});
