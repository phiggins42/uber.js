# Publish/Subscribe Framework

* [uber.subscribe](#subscribe)
* [uber.publish](#publish)
* [uber.cancelSubscriptions](#cancelSubscriptions)

#### Requires
* src/array.js
* src/function.js
* src/object.js
* src/dispatcher.js

## <a name="subscribe">uber.subscribe(topic, func)</a>

### Arguments
1. `topic` (String):
2. `func` (Function):

### Returns
[`uber.DispatcherHandle`](dispatcher.md#DispatcherHandle)


## <a name="publish">uber.publish(topic, args)</a>

### Arguments
1. `topic` (String):
2. `args` (Array):


## <a name="cancelSubscriptions">uber.cancelSubscriptions(topic)</a>

### Arguments
1. `topic` (String):
