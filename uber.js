(function(g, d, define){
    define(["has"], function(has){
        return {
            isHostType: has.isHostType,
            clearElement: has.clearElement
        };
    });
})(this, document, typeof define != "undefined" ? define : function(deps, factory){
    // if directly loaded, make uber a global
    this.uber = factory(has); // use global has
});
