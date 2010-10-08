(function(uber){
    uber.indexOf = has("array-indexof") ?
        function(arr, searchElement, fromIndex){
            if(arguments.length > 2){
                return arr.indexOf(searchElement, fromIndex);
            }else{
                return arr.indexOf(searchElement);
            }
        } :
        function(arr, searchElement, fromIndex){
            var result = -1,
                n = parseInt(fromIndex, 10)||0,
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
                    if(typeof item != "undefined"){
                        if(searchElement === item){
                            result = k;
                            break;
                        }
                    }
                    k++;
                }
            }
            return result;
        };
    
    uber.lastIndexOf = has("array-lastindexof") ?
        function(arr, searchElement, fromIndex){
            if(arguments.length > 2){
                return arr.lastIndexOf(searchElement, fromIndex);
            }else{
                return arr.lastIndexOf(searchElement);
            }
        } :
        function(arr, searchElement, fromIndex){
            var result = -1,
                l = arr.length,
                n = parseInt(fromIndex, 10)||l,
                k, item;
            if(l > 0){
                if(n>=0){
                    k = Math.min(n, l-1);
                }else{
                    k = l - Math.abs(n);
                }
                while(k>=0){
                    item = arr[k];
                    if(typeof item != "undefined"){
                        if(searchElement === item){
                            result = k;
                            break;
                        }
                    }
                    k--;
                }
            }
            return result;
        };

    uber.every = has("array-every") ?
        function(arr, callback, thisArg){
            if(arguments.length > 2){
                return arr.every(callback, thisArg);
            }else{
                return arr.every(callback);
            }
        } :
        function(arr, callback, thisArg){
            for(var i=0, l=arr.length; i<l; i++){
                if(i in arr && !callback.call(thisArg, arr[i], i, arr)){
                    return false;
                }
            }
            return true;
        };

    uber.some = has("array-some") ?
        function(arr, callback, thisArg){
            if(arguments.length > 2){
                return arr.some(callback, thisArg);
            }else{
                return arr.some(callback);
            }
        } :
        function(arr, callback, thisArg){
            for(var i=0, l=arr.length; i<l; i++){
                if(i in arr && !!callback.call(thisArg, arr[i], i, arr)){
                    return true;
                }
            }
            return false;
        };

    uber.forEach = has("array-foreach") ? 
        function(arr, callback, thisArg){
            if(arguments.length > 2){
                return arr.forEach(callback, thisArg);
            }else{
                return arr.forEach(callback);
            }
        } :
        function(arr, callback, thisArg){
            for(var i=0, l=arr.length; i<l; i++){
                if(i in arr){
                    callback.call(thisArg, arr[i], i, arr);
                }
            }
        };
    
    uber.map = has("array-map") ?
        function(arr, callback, thisArg){
            if(arguments.length > 2){
                return arr.map(callback, thisArg);
            }else{
                return arr.map(callback);
            }
        } :
        function(arr, callback, thisArg){
            var l = arr.length,
                result = new Array(l);
            for(var i=0; i<l; i++){
                if(i in arr){
                    result[i] = callback.call(thisArg, arr[i], i, arr);
                }
            }
            return result;
        };
    
    uber.filter = has("array-filter") ?
        function(arr, callback, thisArg){
            if(arguments.length > 2){
                return arr.filter(callback, thisArg);
            }else{
                return arr.filter(callback);
            }
        } :
        function(arr, callback, thisArg){
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
    
    uber.reduce = has("array-reduce") ?
        function(arr, callback, initialValue){
            if(arguments.length > 2){
                return arr.reduce(callback, initialValue);
            }else{
                return arr.reduce(callback);
            }
        } :
        function(arr, callback, initialValue){
            var l = arr.length,
                ivPresent = arguments.length > 2,
                acc, i;
            if(l==0 && !ivPresent){
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

    uber.reduceRight = has("array-reduceright") ?
        function(arr, callback, initialValue){
            if(arguments.length > 2){
                return arr.reduceRight(callback, initialValue);
            }else{
                return arr.reduceRight(callback);
            }
        } :
        function(arr, callback, initialValue){
            var l = arr.length,
                ivPresent = arguments.length > 2,
                acc, i;
            if(l==0 && !ivPresent){
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
})(uber);
