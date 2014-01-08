/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
var AdditiveFilter = (function () {
    function AdditiveFilter(color) {
        if (color.constructor != Color) {
            throw new TypeError("color must be an instance of Color");
        }
        this.color = color;
    };

    inheritClassFrom(AdditiveFilter, Filter);

    AdditiveFilter.prototype.transformImage = function (imageDataHelper) {
        var data = imageDataHelper.data;
        var color = this.color;

        for (var i = 0; i < data.length; i += 4) {
            data[i] += color.r;
            data[i + 1] += color.g;
            data[i + 2] += color.b;
        }
    };

    return AdditiveFilter;
})();