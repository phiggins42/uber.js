(function(uber, has, global){
    var whenEvent, preventDefault, stopPropagation;

    var _trySetKeyCode = function(evt, code){
        try{
            // squelch errors when keyCode is read-only
            // (e.g. if keyCode is ctrl or shift)
            return (evt.keyCode = code);
        }catch(e){
            return 0;
        }
    }

    if(has("event-preventdefault")){
        preventDefault = function preventDefault(evt){
            evt.preventDefault();
        };
    }else{
        preventDefault = function preventDefault(evt){
            // Setting keyCode to 0 is the only way to prevent certain keypresses (namely
            // ctrl-combinations that correspond to menu accelerator keys).
            // Otoh, it prevents upstream listeners from getting this information
            // Try to split the difference here by clobbering keyCode only for ctrl 
            // combinations. If you still need to access the key upstream, bubbledKeyCode is
            // provided as a workaround.
			evt = evt || global.event;
            evt.bubbledKeyCode = evt.keyCode;
            if(evt.ctrlKey){ _trySetKeyCode(evt, 0); }
            evt.returnValue = false;
        };
    }

    if(has("event-stoppropagation")){
        stopPropagation = function stopPropagation(evt){
            evt.stopPropagation();
        };
    }else{
        stopPropagation = function stopPropagation(evt){
            evt.cancelBubble = true; 
        };
    }

    function stopEvent(evt){
        uber.preventDefault(evt);
        uber.stopPropagation(evt);
    }

	var _uberId = 0, getUberId;
	
	var div = document.createElement("div"),
		docEl = document.documentElement,
		hasUniqueNumber = (typeof div.uniqueNumber == 'number' &&
			docEl.uniqueNumber == 'number' &&
			div.uniqueNumber != docEl.uniqueNumber),
		hasAEL = has("dom-addeventlistener"),
		hasAE = has("dom-attachevent");
	
	if(hasUniqueNumber){
		getUberId = function getUberId(node){
			return node.uniqueNumber;
		}
	}else{
		getUberId = function getUberId(node){
			if(typeof node._uberId != "undefined"){
				return node._uberId;
			}
			return node._uberId = _uberId++;
		}
	}

	var normalizeEventName;
	if(hasAEL){
		normalizeEventName = function normalizeEventName(/*String*/ name){
			// Generally, name should be lower case, unless it is special
			// somehow (e.g. a Mozilla DOM event).
			// Remove 'on'.
			return name.slice(0,2) =="on" ? name.slice(2) : name;
		};
	}else{
		normalizeEventName = function normalizeEventName(/*String*/ eventName){
			// Generally, eventName should be lower case, unless it is
			// special somehow (e.g. a Mozilla event)
			// ensure 'on'
			return eventName.slice(0,2) != "on" ? "on" + eventName : eventName;
		};
	}

	var dispatcherCache = {}, listen, oldListen = uber.listen,
		isNode, _listen;

	if(hasAEL){
		_listen = function _listen(obj, eventName, dispatcher){
			obj.addEventListener(eventName, dispatcher, false);
		};
	}else if(hasAE){
		// IE
		_listen = function _listen(obj, eventName, dispatcher){
			obj.attachEvent(eventName, dispatcher);
		};
	}else{
		// DOM0
		console.log("here");
	}
	
	function listen(obj, method, func){
		if(!obj.nodeType){
			return oldListen.apply(this, arguments);
		}
		var id = getUberId(obj), d;
		if(!dispatcherCache[id]){
			d = dispatcherCache[id] = uber.createDispatcher();
		}else{
			d = dispatcherCache[id];
		}
		_listen(obj, normalizeEventName(method), d);
		return d.add(func);
	}

    uber.preventDefault = preventDefault;
    uber.stopPropagation = stopPropagation;
    uber.stopEvent = stopEvent;
	uber.listen = listen;
})(uber, has, this);
