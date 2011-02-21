(function(define){
define(["has/function", "./array"], function(has, array){
    var STR = "string",
        FN = "function",
        bind,
        _ta = array.toArray
    ;

    if(has("function-bind")){
        bind = function bind(func, scope){
            var args = _ta(arguments, 1);
            return func.bind.apply(func, args);
        };
    }else{
        bind = function bind(func, scope){
            var pre = _ta(arguments, 2);
            function innerBind(){
                return func.apply(scope, _ta(arguments, 0, pre));
            }
            return innerBind;
        };
    }

    function curry(func){
        var pre = _ta(arguments, 1);
        function innerCurry(){
            return func.apply(this, _ta(arguments, 0, pre));
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
