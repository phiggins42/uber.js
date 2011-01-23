(function(define){
define(["has/object", "uber/function"], function(has, uber){
    var toString = {}.toString,
        FUNC_CLASS = "[object Function]",
        ARR_CLASS = "[object Array]",
        STR_CLASS = "[object String]",
        NUM_CLASS = "[object Number]",
        RE_CLASS = "[object RegExp]",
        PROTO = "__proto__",
        hasKey, keys, forIn, mixin, create
    ;

    function isFunction(obj){
        return toString.call(obj) == FUNC_CLASS;
    }

    function isArray(obj){
        return toString.call(obj) == ARR_CLASS;
    }

    function isString(obj){
        return toString.call(obj) == STR_CLASS;
    }

    function isNumber(obj){
        return toString.call(obj) == NUM_CLASS && isFinite(obj);
    }

    function isRegExp(obj){
        return toString.call(obj) == RE_CLASS;
    }

    // Use uber.hasKey() on Object objects only as it may error on DOM Classes
    // https://bugzilla.mozilla.org/show_bug.cgi?id=375344
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
                  ((constructor && constructor.prototype) ?
                    obj[prop] !== constructor.prototype[prop] :
                    obj[prop] !== op[prop]);
            };
        }
    }

    if(has("object-keys")){
        keys = function keys(obj){
            return Object.keys(obj);
        };
    }else{
        keys = function keys(obj){
            var k = [];
            uber.forIn(obj, function(prop, propName){
                k.push(propName);
            });
            return k;
        };
    }

    if(has("bug-for-in-shadowed")){
        // IE
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
            for(i = 0; name = shadowed[i]; ++i){
                if(hasKey(target, name)){
                    callback(target[name], name, target);
                }
            }
            return target;
        };
    }else if(has("bug-for-in-doubled")){
        // Tobie Langel: Safari 2 broken for-in loop
        // http://replay.waybackmachine.org/20090428222941/http://tobielangel.com/2007/1/29/for-in-loop-broken-in-safari/
        forIn = function forIn(target, callback, thisArg){
            var keys = {}, ignorep = uber.isFunction(target);
            thisArg && (callback = uber.bind(callback, thisArg));
            for(var i in target){
                if(!(ignorep && i == "prototype") && !hasKey(keys, i) && (keys[i] = 1)){
                    callback(target[i], i, target);
                }
            }
            return target;
        };
    }else{
        // Everything else
        forIn = function forIn(target, callback, thisArg){
            thisArg && (callback = uber.bind(callback, thisArg));
            var ignorep = uber.isFunction(target);
            for(var i in target){
                if(!(ignorep && i == "prototype")){
                    callback(target[i], i, target);
                }
            }
            return target;
        };
    }

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

    create = (function(){
        var create;
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
            };
        }
        return create;
    })();

    uber.isFunction = isFunction;
    uber.isArray = isArray;
    uber.isString = isString;
    uber.isNumber = isNumber;
    uber.isRegExp = isRegExp;
    uber.hasKey = hasKey;
    uber.keys = keys;
    uber.forIn = forIn;
    uber.mixin = mixin;
    uber.create = create;

    return uber;
});
})(typeof define != "undefined" ? define : function(deps, factory){
    factory(has, uber); // use global has and uber
});
