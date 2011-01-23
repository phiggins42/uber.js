(function(define){
define(["has/array", "uber"], function(has, uber){
    var aslice = [].slice,
        toArray, indexOf, lastIndexOf, every, some,
        forEach, map, filter, reduce, reduceRight
    ;

    if(!has("dom") || has("array-slice-nodelist")){
        toArray = function toArray(arrLike, offset, startWith){
            return (startWith||[]).concat(aslice.call(arrLike, offset||0));
        };
    }else{
        toArray = function toArray(arrLike, offset, startWith){
            if(arrLike.item){
                var arr = startWith||[];
                for(var x = offset || 0; x < arrLike.length; x++){
                    arr.push(obj[x]);
                }
                return arr;
            }
            return (startWith||[]).concat(aslice.call(arrLike, offset||0));
        };
    }

    if(has("array-indexof")){
        indexOf = function indexOf(arr, searchElement, fromIndex){
            return arr.indexOf(searchElement, fromIndex);
        };
    }else{
        indexOf = function indexOf(arr, searchElement, fromIndex){
            var result = -1,
                n = fromIndex >>> 0,
                l = arr.length,
                k, item;
            n = isNaN(n) ? 0 : n;
            if(l > 0 && n < l){
                if(n>=0){
                    k = n;
                }else{
                    k = l - Math.abs(n);
                    k = k < 0 ? 0 : k;
                }
                while(k<l){
                    item = arr[k];
                    if((k in arr) && searchElement === item){
                        result = k;
                        break;
                    }
                    k++;
                }
            }
            return result;
        };
    }

    if(has("array-lastindexof")){
        lastIndexOf = function lastIndexOf(arr, searchElement, fromIndex){
            if(arguments.length > 2){
                return arr.lastIndexOf(searchElement, fromIndex);
            }else{
                // if undefined is passed as the second argument,
                // it starts searching from 0.
                return arr.lastIndexOf(searchElement);
            }
        };
    }else{
        lastIndexOf = function lastIndexOf(arr, searchElement, fromIndex){
            var result = -1,
                l = arr.length >>> 0;
            if(l<=0){
                return result;
            }

            // Adapted from John-David Dalton
            var n = +fromIndex;
            if(isNaN(n)){
                n = l;
            }else if(n !== 0 && !isFinite(n)){
                // avoid issues with numbers larger than
                // Math.pow(2, 31) against bitwise operators
                n = Math.abs(n) < 2147483648 ? n | 0 : n - (n % 1);
            }
            // End adaptation

            var k, item;
            if(n>=0){
                k = Math.min(n, l-1);
            }else{
                k = l - Math.abs(n);
            }
            while(k>=0){
                item = arr[k];
                if((k in arr) && searchElement === item){
                    result = k;
                    break;
                }
                k--;
            }
            return result;
        };
    }

    if(has("array-every")){
        every = function every(arr, callback, thisArg){
            return arr.every(callback, thisArg);
        };
    }else{
        every = function every(arr, callback, thisArg){
            for(var i=0, l=arr.length; i<l; i++){
                if(i in arr && !callback.call(thisArg, arr[i], i, arr)){
                    return false;
                }
            }
            return true;
        };
    }

    if(has("array-some")){
        some = function some(arr, callback, thisArg){
            return arr.some(callback, thisArg);
        };
    }else{
        some = function some(arr, callback, thisArg){
            for(var i=0, l=arr.length; i<l; i++){
                if(i in arr && !!callback.call(thisArg, arr[i], i, arr)){
                    return true;
                }
            }
            return false;
        };
    }

    if(has("array-foreach")){
        forEach = function forEach(arr, callback, thisArg){
            return arr.forEach(callback, thisArg);
        };
    }else{
        forEach = function forEach(arr, callback, thisArg){
            for(var i=0, l=arr.length; i<l; i++){
                if(i in arr){
                    callback.call(thisArg, arr[i], i, arr);
                }
            }
        };
    }

    if(has("array-map")){
        map = function map(arr, callback, thisArg){
            return arr.map(callback, thisArg);
        };
    }else{
        map = function map(arr, callback, thisArg){
            var l = arr.length,
                result = new Array(l);
            for(var i=0; i<l; i++){
                if(i in arr){
                    result[i] = callback.call(thisArg, arr[i], i, arr);
                }
            }
            return result;
        };
    }

    if(has("array-filter")){
        filter = function filter(arr, callback, thisArg){
            return arr.filter(callback, thisArg);
        };
    }else{
        filter = function filter(arr, callback, thisArg){
            var result = [],
                l = arr.length,
                i, item, val;
            for(i=0, j=0; i<l; i++){
                if(i in arr){
                    item = arr[i]; // store this in case the callback changes it
                    if(callback.call(thisArg, item, i, arr)){
                        result[j] = item;
                        j++;
                    }
                }
            }
            return result;
        };
    }

    if(has("array-reduce")){
        reduce = function reduce(arr, callback, initialValue){
            if(arguments.length > 2){
                return arr.reduce(callback, initialValue);
            }else{
                return arr.reduce(callback);
            }
        };
    }else{
        reduce = function reduce(arr, callback, initialValue){
            var l = arr.length,
                ivPresent = arguments.length > 2,
                acc, i;
            if(l===0 && !ivPresent){
                throw new TypeError("Reduce of empty array with no initial value");
            }
            i = 0;
            if(ivPresent){
                acc = initialValue;
            }else{
                do{
                    if(i in arr){
                        acc = arr[i++];
                        break;
                    }
                    if(++i >= l){
                        throw new TypeError();
                    }
                }while(i<l);
            }
            while(i<l){
                if(i in arr){
                    acc = callback.call(undefined, acc, arr[i], i, arr);
                }
                i++;
            }
            return acc;
        };
    }

    if(has("array-reduceright")){
        reduceRight = function reduceRight(arr, callback, initialValue){
            if(arguments.length > 2){
                return arr.reduceRight(callback, initialValue);
            }else{
                return arr.reduceRight(callback);
            }
        };
    }else{
        reduceRight = function reduceRight(arr, callback, initialValue){
            var l = arr.length,
                ivPresent = arguments.length > 2,
                acc, i;
            if(l===0 && !ivPresent){
                throw new TypeError("Reduce of empty array with no initial value");
            }
            i = l-1;
            if(ivPresent){
                acc = initialValue;
            }else{
                do{
                    if(i in arr){
                        acc = arr[i--];
                        break;
                    }
                    if(--i < 0){
                        throw new TypeError();
                    }
                }while(i>=0);
            }
            while(i>=0){
                if(i in arr){
                    acc = callback.call(undefined, acc, arr[i], i, arr);
                }
                i--;
            }
            return acc;
        };
    }

    uber.toArray = toArray;
    uber.indexOf = indexOf;
    uber.lastIndexOf = lastIndexOf;
    uber.every = every;
    uber.some = some;
    uber.forEach = forEach;
    uber.map = map;
    uber.filter = filter;
    uber.reduce = reduce;
    uber.reduceRight = reduceRight;

    return uber;
});
})(typeof define != "undefined" ? define : function(deps, factory){
    factory(has, uber); // use global has and uber
});
