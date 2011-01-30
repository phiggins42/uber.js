(function(global, document){
    define(["uber/promise", "uber/deferred", "uber/dom", "uber/dom-event"], function(promise, defd, dom, event){
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

        function Test(kwArgs){
            defd.Deferred.call(this, kwArgs ? kwArgs.canceller : undefined);

            if(kwArgs){
                this.name = kwArgs.name||"";
                this.test = kwArgs.test;
            }
        }
        Test.prototype = new defd.Deferred;
        Test.prototype.constructor = Test;

        function TestGroup(kwArgs){
            Test.call(this, kwArgs);

            this.tests = (kwArgs.tests||[]).slice(0);
        }
        TestGroup.prototype = new Test;
        TestGroup.prototype.constructor = TestGroup;

        (function(){
            var run = function run(){
                try{
                    var self = this;
                    this.startTime = new Date;
                    promise.when(
                        this.test(),
                        function(res){
                            self.endTime = new Date;
                            self.elapsed = self.endTime - self.startTime;
                            self.resolve(res);
                        },
                        function(err){
                            self.endTime = new Date;
                            self.elapsed = self.endTime - self.startTime;
                            self.reject(err);
                        }
                    );
                }catch(e){
                    this.endTime = new Date;
                    this.elapsed = this.endTime - this.startTime;
                    this.reject(e);
                }
            };

            Test.prototype.run = run;
        })();

        (function(){
            var run = function run(){
                var tests = this.tests,
                    results = new Array(tests.length),
                    self = this,
                    onTestDone;

                this.elapsed = 0;
                for(var i=0, test; test=tests[i]; i++){
                    onTestDone = (function(index, thisTest, nextTest){
                        return function(res){
                            if(res instanceof Error){
                                results[index] = "error";
                            }else{
                                results[index] = res;
                            }
                            self.elapsed += thisTest.elapsed;
                            if(nextTest){
                                nextTest.run();
                            }else{
                                self.resolve(results);
                            }
                        };
                    })(i, test, tests[i+1]);
                    promise.when(test, onTestDone, onTestDone);
                }

                this.startTime = new Date;
                tests.length && tests[0].run();
            };

            TestGroup.prototype.run = run;
        })();

        var tests = [];
        function registerTest(name, testFunc){
            tests.push(new Test({ name: name, test: testFunc }));
        }
        function registerTests(name, testFuncs){
            var groupTests = [];
            for(var i=0, test; test=testFuncs[i]; i++){
                groupTests.push(new Test({ test: test }));
            }
            tests.push(new TestGroup({ name: name + " (group)", tests: groupTests }));
        }

        function runTests(){
            var onTestDone;
            for(var i=0, l=tests.length; i<l; i++){
                onTestDone = (function(thisTest, nextTest){
                    return function(res){
                        outputResult(thisTest, res);
                        if(nextTest){
                            nextTest.run();
                        }
                    };
                })(tests[i], tests[i+1]);
                promise.when(tests[i], onTestDone, onTestDone);
            }
            tests.length && tests[0].run();
        }

        event.domReady().then(runTests);

        return {
            ist: ist,
            isEqual: ist,
            outputResult: outputResult,
            registerTest: registerTest,
            registerTests: registerTests
        };
    });
})(this, document);
