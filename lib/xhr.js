(function(global, define){
    define(["has/features", "./Deferred"], function(has, Deferred){
        // Can't pass in uber as "uber" to prevent IE from leaking
        global._uberXhrData = {};

        var _nextXhrId = 0,
            noop = function(){},
            getXMLHttpRequest;

        if(has("activex-enabled") !== null){
            try{
                new ActiveXObject("Msxml2.XMLHTTP");
                getXMLHttpRequest = function getXMLHttpRequest(){
                    return new ActiveXObject("Msxml2.XMLHTTP");
                };
            }catch(e){
                try{
                    new ActiveXObject("Microsoft.XMLHTTP");
                }catch(e){
                    getXMLHttpRequest = function getXMLHttpRequest(){
                        return new ActiveXObject("Microsoft.XMLHTTP");
                    };
                }
            }
        }else if(has("native-xhr")){
            getXMLHttpRequest = function getXMLHttpRequest(){
                return new XMLHttpRequest();
            };
        }else{
            getXMLHttpRequest = function getXMLHttpRequest(){
                throw new Error("XMLHttpRequest not available");
            };
        }


        // Adapted from FuseJS
        var reHTTP = /^https?:/;
        function isSuccess(url, status){
            // http status code definitions
            // http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
            var useStatus = reHTTP.test(url) ||
                (url.slice(0, 6).indexOf(':') < 0 ?
                  reHTTP.test(global.location.protocol) : false);
            return useStatus ? (status >= 200 && status < 300 || status == 304) : status === 0;
        }

        function createHandler(id){
            return function(){
                var data = _uberXhrData[id];

                // Either timed out, aborted, or already handled
                if(!data){ return; }

                var x = data.xhr,
                    t = data.timeoutId,
                    d = data.deferred,
                    status, statusText;

                // Assume Firefox is throwing an error accessing status
                // caused by a 408 request timeout
                try {
                    status = x.status;
                    statusText = x.statusText;
                } catch(e) {
                    status = 408;
                    statusText = 'Request Timeout';
                }

                // IE will return 1223 for 204 no content
                status = status == 1223 ? 204 : status;

                if(x.readyState == 4){
                    if(typeof t != "undefined"){
                        global.clearTimeout(t);
                    }
                    var responseText = String(x.responseText),
                        responseXML = x.responseXML,
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
                    x.onreadystatechange = noop;

                    if(!isSuccess(data.args.url, status)){
                        var error = new Error("Status Code: " + status + ": " + statusText);
                        error.log = false;
                        d.reject(error);
                    }else{
                        d.resolve(result);
                    }
                    delete _uberXhrData[id];
                }
            };
        }

        function createCanceller(id){
            return function(){
                var data = _uberXhrData[id],
                    x = data.xhr,
                    error;
                if(x && has.isHostType(x, "abort") && x.readyState != 4){
                    // clear onreadystatechange handler to stop some browsers calling
                    // it when the request is aborted
                    x.onreadystatechange = noop;
                    x.abort();
                }
                delete _uberXhrData[id];
                return new Error("cancelled");
            };
        }

        function createTimeoutHandler(id){
            return function(){
                var data = _uberXhrData[id],
                    xhr = data.xhr;

                if(has.isHostType(x, "abort") && xhr.readyState != 4){
                    // clear onreadystatechange handler to stop some browsers calling
                    // it when the request is aborted
                    xhr.onreadystatechange = noop;
                    xhr.abort();

                    data.deferred.reject(new Error("timeout"));
                    delete _uberXhrData[id];
                }
            };
        }

        function xhr(method, args){
            var d, x;

            try{
                x = getXMLHttpRequest();
            }catch(e){
                d = new Deferred;
                d.cancel();
                return d.promise;
            }

            var id = _nextXhrId++,
                canceller = createCanceller(id);

            d = new Deferred(canceller);

            var data = _uberXhrData[id] = {
                xhr: x,
                deferred: d,
                args: args
            };

            if(args.timeout){
                data.timeoutId = global.setTimeout(createTimeoutHandler(id), args.timeout);
            }

            var handler = createHandler(id);

            // attach onreadystatechange event after open() to avoid some browsers
            // firing duplicate readyState events
            x.open(method, args.url, args.sync !== true, args.user || undefined, args.password || undefined);
            x.onreadystatechange = handler;

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
                canceller();
                throw e;
            }

            // force Firefox to handle readyState 4 for synchronous requests
            if(args.sync === true){
                handler();
            }

            return d.promise;
        }

        return xhr;
    });
})(this, typeof define != "undefined" ? define : function(deps, factory){
    this.uber_xhr = factory(has, uber_Deferred); // use global has and uber_deferred
});
