(function(define){
define(["has/function"], function(has){
    var aslice = [].slice, bind;

    function toArray(arrLike, offset, startWith){
        return (startWith||[]).concat(aslice.call(arrLike, offset||0));
    }

    if(has("function-bind")){
        bind = function bind(func, scope){
            var args = toArray(arguments, 1);
            return func.bind.apply(func, args);
        };
    }else{
        bind = function bind(func, scope){
            var pre = toArray(arguments, 2);
            function innerBind(){
                return func.apply(scope, toArray(arguments, 0, pre));
            }
            return innerBind;
        };
    }

    function curry(func){
        var pre = toArray(arguments, 1);
        function innerCurry(){
            return func.apply(this, toArray(arguments, 0, pre));
        }
        return innerCurry;
    }

    return {
        bind: bind,
        curry: curry
    };
});
})(typeof define != "undefined" ? define : function(deps, factory){
    this.uber_function = factory(has); // use global has
});
