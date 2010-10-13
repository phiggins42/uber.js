(function(global, has, uber){

    var toString = {}.toString,
        FUNC_CLASS = "[object Function]",
        ARR_CLASS = "[object Array]",
        STR_CLASS = "[object String]",
        NUM_CLASS = "[object Number]",
        RE_CLASS = "[object RegExp]",
        PROTO = "__proto__"
    ;

    function isFunction(obj){
        return toString.call(obj) == FUNC_CLASS;
    }
    uber.isFunction = isFunction;

    function isArray(obj){
        return toString.call(obj) == ARR_CLASS;
    }
    uber.isArray = isArray;

    function isString(obj){
        return toString.call(obj) == STR_CLASS;
    }
    uber.isString = isString;

    function isNumber(obj){
        return toString.call(obj) == NUM_CLASS && isFinite(obj);
    }
    uber.isNumber = isNumber;

    function isRegExp(obj){
        return toString.call(obj) == RE_CLASS;
    }
    uber.isRegExp = isRegExp;

    var hasKey = uber.hasKey = (function(){
        var op = Object.prototype,
            hop = op.hasOwnProperty;

        if(isFunction(hop)){
            hasKey = function hasKey(obj, prop){
                return hop.call(obj, prop);
            };
        }else{
            if(has("object-__proto__")){
                // Safari 2
                hasKey = function hasKey(obj, prop){
                    // convert primatives to objects so IN operator will work
                    obj = Object(obj);

                    var result, proto = obj[PROTO];
                    obj[PROTO] = null;
                    result = prop in obj;
                    obj[PROTO] = proto;
                    return result;
                };
            }else{
                // Other
                hasKey = function hasKey(obj, prop){
                    // convert primatives to objects so IN operator will work
                    obj = Object(obj);
                    var constructor = obj.constructor;
                    return property in obj &&
                      (constructor && constructor.prototype
                        ? obj[prop] !== constructor.prototype[prop]
                        : obj[prop] !== op[prop]);
                };
            }
        }
        return hasKey;
    })();

    var forIn = uber.forIn = (function(){
        if(has("bug-dontenum-enumerable")){
            var shadowed = [
                    'constructor', 'hasOwnProperty',
                    'isPrototypeOf', 'propertyIsEnumerable',
                    'toLocaleString', 'toString', 'valueOf'
                ],
                shadowedLen = shadowed.length,
                empty = {}
            ;
            forIn = function forIn(target, callback, thisArg){
                thisArg && (callback = uber.bind(callback, thisArg));
                var name, s, i, hasKey = uber.hasKey;
                for(name in target){
                    callback(target[name], name, target);
                }
                // IE doesn't recognize some custom functions in for..in
                for(i = 0; i < shadowedLen; ++i){
                    name = shadowed[i];
                    if(hasKey(target, name)){
                        callback(target[name], name, target);
                    }
                }
                return target;
            };
        }else if(has("bug-for-in-doubled")){
            // Safari 2
            forIn = function forIn(target, callback, thisArg){
                var keys = {}, ignorep = isFunction(target);
                thisArg && (callback = uber.bind(callback, thisArg));
                for(var i in target){
                    if(!(ignorep && i == "prototype") && !hasKey(keys, i) && (keys[i] = 1)){
                        callback(target[i], i, target);
                    }
                }
                return target;
            };
        }else{
            forIn = function forIn(target, callback, thisArg){
                thisArg && (callback = uber.bind(callback, thisArg));
                var ignorep = isFunction(target);
                for(var i in target){
                    if(!(ignorep && i == "prototype")){
                        callback(target[i], i, target);
                    }
                }
                return target;
            };
        }
        return forIn;
    })();

    var mixin = uber.mixin = (function(){
        if(has("object-defineproperties")){
            mixin = function mixin(target, source){
                var propDesc = {};
                uber.forIn(source, function(val, i){
                    propDesc[i] = {
                        configurable: true,
                        enumerable: true,
                        value: val,
                        writable: true
                    };
                });
                return Object.defineProperties(target, propDesc);
            };
        }else{
            mixin = function mixin(target, source){
                uber.forIn(source, function(val, i){
                    target[i] = val;
                });
            };
        }
        return mixin;
    })();

    var create = uber.create = (function(){
        function TMP(){}
        if(has("object-create")){
            create = function create(obj, props){
                var propDesc = {};
                uber.forIn(props, function(val, i){
                    propDesc[i] = {
                        configurable: true,
                        enumerable: true,
                        value: val,
                        writable: true
                    };
                });
                return Object.create(obj, propDesc);
            };
        }else{
            // boodman/crockford delegation w/ cornford optimization
            create = function create(obj, props){
                TMP.prototype = obj;
                var tmp = new TMP();
                TMP.prototype = null;
                if(props){
                    uber.mixin(tmp, props);
                }
                return tmp; // Object
            }
        }
        return create;
    })();

})(this, has, uber);
