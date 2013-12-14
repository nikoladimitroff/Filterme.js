/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
var Filter = (function () {

    function Filter() {

    };

    Filter.prototype.transformImage = function (imageDataHelper) {
        throw new TypeError("Method is abstract");
    };

    return Filter;
})();

var inheritClassFrom = function (derived, base) {
    derived.prototype = new base();
    derived.prototype.constructor = derived;
};