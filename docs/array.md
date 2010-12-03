# Array helpers
All of these helpers (with the exception of `uber.toArray`) default to the browser implementation if it is available.

## uber.toArray(arrLike, *offset*, *startWith*)
Convert an Array-like object (arguments, NodeList, etc.) to an Array.

### Arguments
1. `arrLike` (Object): The object to convert.
2. `offset` (integer, *optional*): What index to start the conversion from.  Defaults to 0.
3. `startWith` (Array, *optional*): An array to concatenate `arrLike` to.

### Returns
Array


## uber.indexOf(arr, searchElement, *fromIndex*)
Find the index of the first occurrence of an object within an Array.

### Arguments
1. `arr` (Array): The Array to search.
2. `searchElement` (Object): The item to search for.
3. `fromIndex` (integer, *optional*): The index to start searching from.

### Returns
The index of the item or `-1` if the item is not found.


## uber.lastIndexOf(arr, searchElement, *fromIndex*)
Find the index of the last occurrence of an object within an Array.

### Arguments
1. `arr` (Array): The Array to search.
2. `searchElement` (Object): The item to search for.
3. `fromIndex` (integer, *optional*): The index to start searching from.

### Returns
The last index of the item or `-1` if the item is not found.


## uber.every(arr, callback, *thisArg*)
Determine if every element of an Array meets a specified criteria.

### Arguments
1. `arr` (Array): The Array to check.
2. `callback` (Function): A function to run on each element present in `arr`.
> #### Arguments
> 1. `item` (Object): An item in `arr`.
> 2. `index` (integer): The index of `item` within `arr`.
> 3. `obj` (Array): The Array being traversed.  This is `arr`.
> 
> #### Returns
> Boolean
3. `thisArg` (Object, *optional*): The scope to run `callback` in.

### Returns
Boolean: `true` if `callback` returns true for every element in `arr`, otherwise `false`.


## uber.some(arr, callback, *thisArg*)
Determine if at least one element of an Array meets a specified criteria.

### Arguments
1. `arr` (Array): The Array to check.
2. `callback` (Function): A function to run on each element present in `arr`.
> #### Arguments
> 1. `item` (Object): An item in `arr`.
> 2. `index` (integer): The index of `item` within `arr`.
> 3. `obj` (Array): The Array being traversed.  This is `arr`.
> 
> #### Returns
> Boolean
3. `thisArg` (Object, *optional*): The scope to run `callback` in.

### Returns
Boolean: `true` if `callback` returns true for at least one element in `arr`, otherwise `false`.


## uber.forEach(arr, callback, *thisArg*)
Call `callback` on each element of an Array (skipping `undefined` values).

### Arguments
1. `arr` (Array): The Array to traverse.
2. `callback` (Function): A function to run on each element present in `arr`.
> #### Arguments
> 1. `item` (Object): An item in `arr`.
> 2. `index` (integer): The index of `item` within `arr`.
> 3. `obj` (Array): The Array being traversed.  This is `arr`.

3. `thisArg` (Object, *optional*): The scope to run `callback` in.


## uber.map(arr, callback, *thisArg*)
Construct a new Array from the results of calling `callback` on each element of an Array (skipping `undefined` values).

### Arguments
1. `arr` (Array): The Array to traverse.
2. `callback` (Function): A function to run on each element present in `arr`.
> #### Arguments
> 1. `item` (Object): An item in `arr`.
> 2. `index` (integer): The index of `item` within `arr`.
> 3. `obj` (Array): The Array being traversed.  This is `arr`.
> 
> #### Returns
> Object
3. `thisArg` (Object, *optional*): The scope to run `callback` in.

### Returns
Array


## uber.filter(arr, callback, *thisArg*)
Construct a new Array from the items of an Array for which calling `callback` returns true (skipping `undefined` values).

### Arguments
1. `arr` (Array): The Array to traverse.
2. `callback` (Function): A function to run on each element present in `arr`.
> #### Arguments
> 1. `item` (Object): An item in `arr`.
> 2. `index` (integer): The index of `item` within `arr`.
> 3. `obj` (Array): The Array being traversed.  This is `arr`.
> 
> #### Returns
> Boolean
3. `thisArg` (Object, *optional*): The scope to run `callback` in.

### Returns
Array


## uber.reduce(arr, callback, *initialValue*)

### Arguments
1. `arr` (Array): The Array to traverse.
2. `callback` (Function): A function to run on each element present in `arr`.
> #### Arguments
> 1. `previousValue` (Object): The value of the previous item in `arr` or the value of the previous call to `callback`.
> 2. `currentValue` (Object): The value of the current item in `arr`.
> 3. `currentIndex` (integer): The index of `item` within `arr`.
> 4. `obj` (Array): The Array being traversed.  This is `arr`.
> 
> #### Returns
> Object
3. `initialValue` (Object, *optional*): 

### Returns
Object


## uber.reduceRight(arr, callback, *initialValue*)

### Arguments
1. `arr` (Array): The Array to traverse.
2. `callback` (Function): A function to run on each element present in `arr`.
> #### Arguments
> 1. `previousValue` (Object): The value of the previous item in `arr` or the value of the previous call to `callback`.
> 2. `currentValue` (Object): The value of the current item in `arr`.
> 3. `currentIndex` (integer): The index of `item` within `arr`.
> 4. `obj` (Array): The Array being traversed.  This is `arr`.
> 
> #### Returns
> Object

3. `initialValue` (Object, *optional*): 

### Returns
Object
