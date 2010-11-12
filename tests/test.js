(function(global, document, uber){
    var toString = {}.toString,
        func = "[object Function]",
        arr = "[object Array]"
    ;

    function ist(a, b){
        var ta = typeof a,
            tb = typeof b;
        if(ta != tb){
            return false;
        }
        var sa = toString.call(a),
            sb = toString.call(b);
        if(sa != sb){
            return false;
        }
        if(sa == arr){
            if(a.length != b.length){
                return false;
            }
            for(var i=a.length; i--;){
                if(!ist(a[i], b[i])){
                    return false;
                }
            }
            return true;
        }
        return a === b;
    }

    function outputResult(name, result){
        var out = uber.byId("output"),
            li = document.createElement("li");

        li.innerHTML = name + ": " + (result === true ? "pass" : (result === false ? "fail" : result));
        if(!result){
            li.className = "error";
        }
        out.appendChild(li);
        li = null;
    }

    global['ist'] = ist;
    global['outputResult'] = outputResult;
})(this, document, uber);
