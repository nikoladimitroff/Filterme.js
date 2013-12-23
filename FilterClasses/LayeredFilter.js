/// <reference path="Filter.js" />
/// <reference path="../ImageDataHelper.js" />
var LayeredFilter = (function () {

    function LayeredFilter(filters) {
        if (filters.constructor != Array)
            throw new TypeError("filters must be an array of filters");

        this.filters = filters;
    };

    inheritClassFrom(LayeredFilter, Filter);

    LayeredFilter.prototype.transformImage = function (imageDataHelper) {
        var filters = this.filters;
        for (var i = 0; i < filters.length; i++) {
            filters[i].transformImage(imageDataHelper);
        }
    };

    return LayeredFilter;
})();