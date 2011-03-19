(function(global, document){
    define(["uber/when", "uber/Deferred", "uber/dom"], function(when, Deferred, dom){
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

        function outputResult(test, result){
            var out = dom.byId("output"),
                name = test.name,
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
                if(result instanceof Error){
                    clsName = "error";
                }
            }
            li.innerHTML = name + ": " + text + " (" + test.elapsed + "ms)";
            if(clsName){
                li.className = clsName;
            }
            out.appendChild(li);
            li = null;
        }

        function forEach(array, callback){
            for(var i=0, l=array.length; i<l; i++){
                callback.call(null, array[i], i, array);
            }
        }

        function Test(kwArgs){
            Deferred.call(this, kwArgs ? kwArgs.canceller : undefined);

            if(kwArgs){
                this.name = kwArgs.name||"";
                this.test = kwArgs.test;
            }
        }
        Test.prototype = new Deferred;
        Test.prototype.run = (function(){
            function run(){
                var st, et, ret,
                    test = this.test,
                    self = this;

                if(!test){
                    this.reject("No test provided");
                    return;
                }

                st = this.startTime = new Date;
                try{
                    when(
                        test.apply(this, arguments),
                        function(res){
                            et = self.endTime = new Date;
                            self.elapsed = et - st;

                            self.resolve(res);
                        },
                        function(err){
                            et = self.endTime = new Date;
                            self.elapsed = et - st;

                            self.reject(err);
                        }
                    );
                }catch(e){
                    et = this.endTime = new Date;
                    this.elapsed = et - st;

                    this.reject(e);
                    return;
                }
            };

            return run;
        })();

        function TestGroup(kwArgs){
            Test.call(this, kwArgs);

            this.tests = (kwArgs.tests||[]).slice();
        }
        TestGroup.prototype = new Test;
        TestGroup.prototype.run = (function(){
            function run(){
                var tests = this.tests,
                    results = new Array(tests.length),
                    self = this;

                this.elapsed = 0;

                forEach(tests, function(test, i){
                    function onTestDone(res){
                        if(res instanceof Error){
                            results[i] = "error";
                        }else{
                            results[i] = res;
                        }
                        self.elapsed += test.elapsed;
                        if(nextTest){
                            nextTest.run();
                        }else{
                            self.resolve(results);
                        }
                    }
                    var nextTest = tests[i+1];

                    when(test, onTestDone, onTestDone);
                });

                this.startTime = new Date;
                tests.length && tests[0].run();
            }

            return run;
        })();

        var tests = [];
        function registerTest(name, testFunc){
            tests.push(new Test({ name: name, test: testFunc }));
        }
        function registerTests(name, testFuncs){
            var groupTests = [];
            for(var i=0, test; test=testFuncs[i]; i++){
                groupTests.push(new Test({ name: name + " (" + i + ")", test: test }));
            }
            tests.push(new TestGroup({ name: name + " (group)", tests: groupTests }));
        }

        function runTests(){
            forEach(tests, function(test, i){
                function onDone(res){
                    outputResult(test, res);
                    if(nextTest){
                        nextTest.run();
                    }
                }
                var nextTest = tests[i+1];
                when(test, onDone, onDone);
            });
            tests.length && tests[0].run();
        }

        return {
            ist: ist,
            isEqual: ist,
            outputResult: outputResult,
            registerTest: registerTest,
            registerTests: registerTests,
            runTests: runTests
        };
    });
})(this, document);
