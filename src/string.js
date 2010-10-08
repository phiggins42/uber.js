(function(uber, has){

    uber.trim = (has("string-trim") && !has("bug-regexp-whitespace")) ?
        function(str){
            return str.trim();
        } :
        (function(){
            var whitespace ="\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002"+
                "\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029";
            var beginRE, endRE;
            if(has("bug-regexp-whitespace")){
                beginRE = new RegExp("^(\s|[" + whitespace + "])(\s|[" + whitespace + "])*");
                endRE = new RegExp("(\s|[" + whitespace + "])(\s|[" + whitespace + "])*$");
            }else{
                beginRE = /^\s\s*/;
                endRE = /\s\s*$/;
            }
            return function(str){
                return str.replace(beginRE, '').replace(endRE, '');
            }
        })();
})(uber, has);
