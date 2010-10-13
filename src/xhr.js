(function(uber, has){

    var getXHR = uber.getXHR = (function(){
        if(has("activex-enabled") !== null){
            try{
                new ActiveXObject("Msxml2.XMLHTTP");
                getXHR = function getXHR(){
                    return new ActiveXObject("Msxml2.XMLHTTP");
                };
            }catch(e){
                try{
                    new ActiveXObject("Microsoft.XMLHTTP");
                }catch(e){
                    getXHR = function getXHR(){
                        return new ActiveXObject("Microsoft.XMLHTTP");
                    };
                }
            }
        }else if(has("native-xhr")){
            getXHR = function getXHR(){
                return new XMLHttpRequest();
            };
        }else{
            getXHR = function getXHR(){
                throw new Error("XMLHttpRequest not available");
            };
        }
        return getXHR;
    })();

})(uber, has);
