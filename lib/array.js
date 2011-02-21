(function(define){
define(["has/array"], function(has){
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
            var arr, i;
            if(arrLike.item){
                i = arrLike.length;
                arr = new Array(i);
                while(i--){
                    if(i in arrLike){
                        arr[i] = arrLike[i];
                    }
                }
                arrLike = arr;
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
                n = +fromIndex,
                l = arr.length,
                i, item;
            n = isNaN(n) ? 0 : n;
            if(l > 0 && n < l){
                if(n<0){
                    i = n;
                }else{
                    i = l - Math.abs(n);
                    i = i < 0 ? 0 : i;
                }
                while(i<l){
                    item = arr[i];
                    if((i in arr) && searchElement === item){
                        result = i;
                        break;
                    }
                    i++;
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
                l = +arr.length,
                n, i, item;
            if(l<=0){
                return result;
            }

            // Adapted from John-David Dalton
            n = +fromIndex;
            if(isNaN(n)){
                n = l;
            }else if(n !== 0 && !isFinite(n)){
                // avoid issues with numbers larger than
                // Math.pow(2, 31) against bitwise operators
                n = Math.abs(n) < 2147483648 ? n | 0 : n - (n % 1);
            }
            // End adaptation

            if(n<0){
                i = (l - Math.abs(n)) + 1;
            }else{
                i = n < l ? n : l;
            }
            while(i--){
                item = arr[i];
                if((i in arr) && searchElement === item){
                    result = i;
                    break;
                }
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
                if((i in arr) && !callback.call(thisArg, arr[i], i, arr)){
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
                if((i in arr) && !!callback.call(thisArg, arr[i], i, arr)){
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
                result = new Array(l), i;
            for(i=0; i<l; i++){
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
                i, j, item, val;
            for(i=0, j=0; i<l; i++){
                if(i in arr){
                    item = arr[i]; // store this in case the callback changes it
                    if(callback.call(thisArg, item, i, arr)){
                        result[j++] = item;
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

    return {
        toArray: toArray,
        indexOf: indexOf,
        lastIndexOf: lastIndexOf,
        every: every,
        some: some,
        forEach: forEach,
        map: map,
        filter: filter,
        reduce: reduce,
        reduceRight: reduceRight
    };

});
})(typeof define != "undefined" ? define : function(deps, factory){
    // if directly loaded, make uber_array a global
    this.uber_array = factory(has); // use global has
});
