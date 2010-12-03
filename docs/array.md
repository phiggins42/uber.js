# Array helpers
All of these helpers (with the exception of `uber.toArray`) default to the browser implementation if it is available.

## uber.toArray(arrLike, *offset*, *startWith*)
Convert an Array-like object (arguments, NodeList, etc.) to an Array.

### Arguments
1. arrLike: (Object) The object to convert.
2. offset: (integer, optional) What index to start the conversion from.  Defaults to 0.
3. startWith: (Array, optional) An array to concatenate `arrLike` to.

### Returns
Array


## uber.indexOf(arr, searchElement, *fromIndex*)
Find the index of an object within an Array.

### Arguments
1. arr: (Array) The Array to search.
2. searchElement: (Object) The item to search for.
3. fromIndex: (integer, optional) The index to start searching from.

### Returns
The index of the item or `-1` if the item is not found.


## uber.lastIndexOf(arr, searchElement, *fromIndex*)

## uber.every(arr, callback, *thisArg*)

## uber.some(arr, callback, *thisArg*)

## uber.forEach(arr, callback, *thisArg*)

## uber.map(arr, callback, *thisArg*)

## uber.filter(arr, callback, *thisArg*)

## uber.reduce(arr, callback, *initialValue*)

## uber.reduceRight(arr, callback, *initialValue*)
