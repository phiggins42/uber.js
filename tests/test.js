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
            li = document.createElement("li"),
            text, clsName;

        if(result === true){
            text = "pass";
        }else if(result === false){
            text = "fail";
            clsName = "error";
        }else if(toString.call(result) == arr){
            var errs = [], fails = [];
            for(var i=0, l=result.length; i<l; i++){
                if(result[i] === false){
                    fails.push(i);
                }else if(result[i] == "error"){
                    errs.push(i);
                }
            }
            text = "";
            if(fails.length){
                text = "fail: " + fails.join(", ");
            }
            if(errs.length){
                text += (text ? "; " : "") + "error: " + errs.join(", ");
            }
            if(text){
                clsName = "error";
            }else{
                text = "pass";
            }
        }else{
            text = result;
            if(result == "error"){
                clsName = "error";
            }
        }
        li.innerHTML = name + ": " + text;
        if(clsName){
            li.className = clsName;
        }
        out.appendChild(li);
        li = null;
    }

    var tests = [];
    function registerTest(name, testFunc){
        tests.push({ name: name, test: testFunc });
    }
    function registerTests(name, testFuncs){
        tests.push({
            name: name,
            test: function(){
                var results = new Array(testFuncs.length);
                for(var i=0; test=testFuncs[i]; i++){
                    try{
                        results[i] = test();
                    }catch(e){
                        results[i] = "error";
                        throw e;
                    }
                }
                return results;
            }
        });
    }

    function runTests(){
        for(var i=0, test; test=tests[i]; i++){
            try{
                var result = test.test();
            }catch(e){
                result = "error";
            }
            outputResult(test.name, result);
        }
    }

    uber.domReady().then(runTests);

    global['ist'] = global["isEqual"] = ist;
    global['outputResult'] = outputResult;
    global['registerTest'] = registerTest;
    global['registerTests'] = registerTests;
})(this, document, uber);
