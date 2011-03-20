(function(define){
define(["has/object", "has/bugs"], function(has){
    var toString = {}.toString,
        FUNC_CLASS = "[object Function]",
        ARR_CLASS = "[object Array]",
        STR_CLASS = "[object String]",
        NUM_CLASS = "[object Number]",
        RE_CLASS = "[object RegExp]",
        PROTO = "__proto__",
        hasOwnProperty, keys, forIn, mix, create
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

    // Use hasOwnProperty() on Object objects only as it may error on DOM Classes
    // https://bugzilla.mozilla.org/show_bug.cgi?id=375344
    var op = Object.prototype,
        hop = op.hasOwnProperty;
    if(isFunction(hop)){
        hasOwnProperty = function hasOwnProperty(obj, prop){
            return hop.call(obj, prop);
        };
    }else{
        if(has("object-__proto__")){
            // Safari 2
            hasOwnProperty = function hasOwnProperty(obj, prop){
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
            hasOwnProperty = function hasOwnProperty(obj, prop){
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
            forIn(obj, function(prop, propName){
                k.push(propName);
            });
            return k;
        };
    }

    if(has("bug-for-in-skips-shadowed")){
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
            var name, i = shadowedLen;
            for(name in target){
                callback.call(thisArg, target[name], name, target);
            }
            // IE doesn't recognize some custom functions in for..in
            while(i--){
                name = shadowed[i];
                if(hasOwnProperty(target, name)){
                    callback.call(thisArg, target[name], name, target);
                }
            }
            return target;
        };
    }else if(has("bug-for-in-repeats-shadowed")){
        // Tobie Langel: Safari 2 broken for-in loop
        // http://replay.waybackmachine.org/20090428222941/http://tobielangel.com/2007/1/29/for-in-loop-broken-in-safari/
        forIn = function forIn(target, callback, thisArg){
            var keys = {}, ignorep = isFunction(target), name;
            for(name in target){
                if(!(ignorep && name == "prototype") && !hasOwnProperty(keys, name) && (keys[name] = 1)){
                    callback.call(thisArg, target[name], name, target);
                }
            }
            return target;
        };
    }else{
        // Everything else
        forIn = function forIn(target, callback, thisArg){
            var ignorep = isFunction(target), name;
            for(name in target){
                if(!(ignorep && name == "prototype")){
                    callback.call(thisArg, target[name], name, target);
                }
            }
            return target;
        };
    }

    if(has("object-defineproperties")){
        mix = function mix(target, source){
            var propDesc = {};
            forIn(source, function(val, i){
                if((i in target) && target[i] === val){
                    return;
                }
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
        mix = function mix(target, source){
            forIn(source, function(val, i){
                if((i in target) && target[i] === val){
                    return;
                }
                target[i] = val;
            });
        };
    }

    create = (function(){
        var create;
        function Created(){}
        if(has("object-create")){
            create = function create(obj, props){
                var propDesc = {};

                if(props){
                    forIn(props, function(val, i){
                        propDesc[i] = {
                            configurable: true,
                            enumerable: true,
                            value: val,
                            writable: true
                        };
                    });
                }
                return Object.create(obj, propDesc);
            };
        }else{
            // boodman/crockford delegation w/ cornford optimization
            create = function create(obj, props){
                Created.prototype = obj;
                var tmp = new Created;
                Created.prototype = null;
                if(props){
                    mix(tmp, props);
                }
                return tmp; // Object
            };
        }
        return create;
    })();

    return {
        isFunction: isFunction,
        isArray: isArray,
        isString: isString,
        isNumber: isNumber,
        isRegExp: isRegExp,
        hasOwnProperty: hasOwnProperty,
        keys: keys,
        forIn: forIn,
        mix: mix,
        create: create
    };

});
})(typeof define != "undefined" ? define : function(deps, factory){
    this.uber_object = factory(has); // use global has
});
