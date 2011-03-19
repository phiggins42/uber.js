(function(global, define){
    define(["has/features", "./Deferred", "./function"], function(has, Deferred, func){
        var noop = function(){},
            reHTTP = /^https?:/,
            create, createHandlers;

        // Adapted from FuseJS
        function isSuccess(url, status){
            // http status code definitions
            // http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
            var useStatus = reHTTP.test(url) ||
                (url.slice(0, 6).indexOf(':') < 0 ?
                  reHTTP.test(global.location.protocol) : false);
            return useStatus ? (status >= 200 && status < 300 || status == 304) : status === 0;
        }

        function onReadyStateChange(data){
            if(data.fired){ return; }

            var xhr = data.xhr,
                status, statusText, responseText, responseXML, result, error;

            // Assume Firefox is throwing an error accessing status
            // caused by a 408 request timeout
            try{
                status = xhr.status;
                statusText = xhr.statusText;
            }catch(e){
                status = 408;
                statusText = 'Request Timeout';
            }

            // IE will return 1223 for 204 no content
            status = status == 1223 ? 204 : status;

            if(xhr.readyState == 4){
                if(typeof data.timeoutId != "undefined"){
                    global.clearTimeout(data.timeoutId);
                }
                responseText = String(xhr.responseText);
                responseXML = xhr.responseXML;
                result = {
                    args: data.args,
                    status: status,
                    statusText: statusText,
                    responseText: responseText
                };

                if(responseXML && has.isHostType(responseXML, 'documentElement')){
                    result.responseXML = responseXML;
                }
                // remove event handler to avoid memory leak in IE
                xhr.onreadystatechange = noop;

                if(!isSuccess(data.args.url, status)){
                    error = new Error("Status Code: " + status + ": " + statusText);
                    error.log = false;
                    data.deferred.reject(error);
                }else{
                    data.deferred.resolve(result);
                }

                data.fired = 1;
            }
        }

        function abort(xhr){
            if(xhr && has.isHostType(xhr, "abort") && xhr.readyState != 4){
                // clear onreadystatechange handler to stop some browsers calling
                // it when the request is aborted
                xhr.onreadystatechange = noop;
                xhr.abort();
            }
        }

        function onCancel(data){
            abort(data.xhr);
            return new Error("cancelled");
        }

        function onTimeout(data){
            abort(data.xhr);
            if(!data.fired && data.xhr && data.xhr.readyState != 4){
                data.deferred.reject(new Error("timeout"));
            }
        }

        function xhr(method, args){
            var d, x, data, handlers, cancel;

            try{
                x = create();
            }catch(e){
                d = new Deferred;
                d.reject(e);
                return d.promise;
            }

            data = {
                xhr: x,
                args: args
            };

            handlers = createHandlers(data);

            data.deferred = d = new Deferred(handlers.cancel);

            if(args.timeout){
                data.timeoutId = global.setTimeout(handlers.timeout, args.timeout);
            }

            // attach onreadystatechange event after open() to avoid some browsers
            // firing duplicate readyState events
            x.open(method, args.url, args.sync !== true, args.user || undefined, args.password || undefined);
            x.onreadystatechange = handlers.ready;

            var headers = args.headers;
            if(headers){
                // use regular for...in because we aren't worried about shadowed properties
                for(var i in headers){
                    x.setRequestHeader(i, headers[i]);
                }
            }

            try{
                x.send(args.data);
            }catch(e){
                handlers.cancel();
                throw e;
            }

            // force Firefox to handle readyState 4 for synchronous requests
            if(args.sync === true && !data.fired){
                handlers.ready();
            }

            return d.promise;
        }

        create = function(){
            throw new Error("XMLHttpRequest not available");
        };

        createHandlers = function(data){
            return {
                ready: func.curry(onReadyStateChange, data),
                cancel: func.curry(onCancel, data),
                timeout: func.curry(onTimeout, data)
            };
        };

        if(has("activex-enabled") !== null){
            try{
                new ActiveXObject("Msxml2.XMLHTTP");
                create = function(){
                    return new ActiveXObject("Msxml2.XMLHTTP");
                };
            }catch(e){
                try{
                    new ActiveXObject("Microsoft.XMLHTTP");
                    create = function(){
                        return new ActiveXObject("Microsoft.XMLHTTP");
                    };
                }catch(e){}
            }

            // The following is to prevent memory leaks in IE with ActiveXObjects
            global.__xhr_cache__ = {};
            createHandlers = (function(){
                var _nextXhrId = 0;
                function actualCreateHandlers(id){
                    function del(){ delete __xhr_cache__[id]; }
                    function get(){ return __xhr_cache__[id]; }
                    return {
                        ready: function(){
                            var data = get();
                            // Hasn't timed out, aborted, or been handled
                            if(data){
                                onReadyStateChange(data);
                                if(data.fired){
                                    del();
                                }
                            }
                        },
                        cancel: function(){
                            var data = get(), err;
                            // Hasn't timed out, or been handled
                            if(data){
                                err = onCancel(data);
                                del();
                            }
                            return err;
                        },
                        timeout: function(){
                            var data = get();
                            // Hasn't aborted, or been handled
                            if(data){
                                onTimeout(data);
                                del();
                            }
                        }
                    };
                }
                return function(data){
                    var id = _nextXhrId++;
                    __xhr_cache__[id] = data;
                    return actualCreateHandlers(id);
                };
            })();
        }else if(has("native-xhr")){
            create = function(){
                return new XMLHttpRequest();
            };
        }

        return xhr;
    });
})(this, typeof define != "undefined" ? define : function(deps, factory){
    this.uber_xhr = factory(has, uber_Deferred); // use global has and uber_deferred
});
