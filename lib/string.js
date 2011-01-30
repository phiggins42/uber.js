(function(define){
define(["has/strings", "has/bugs"], function(has){
    var trim;

    if(has("string-trim") && !has("bug-es5-trim")){
        trim = function trim(str){
            return str.trim();
        };
    }else{
        var wsPlus = /^\s+/, ws = /\s/, whitespace;
        if(has("bug-es5-regexp")){
            whitespace = "[\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002"+
                "\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]";
            wsPlus = new RegExp("^" + whitespace + "+");
            ws = new RegExp(whitespace);
        }
        trim = function trim(str){
            str = str.replace(wsPlus, '');
            var i = str.length;
            while(ws.test(str.charAt(--i)));
            return str.substring(0, i + 1);
        };
    }

    return {
        trim: trim
    };
});
})(typeof define != "undefined" ? define : function(deps, factory){
    this.uber_string = factory(has); // use global has
});
