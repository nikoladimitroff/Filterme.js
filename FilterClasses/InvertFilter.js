/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
var InvertFilter = (function () {

    function InvertFilter() {

    };

    inheritClassFrom(InvertFilter, Filter);


    InvertFilter.prototype.transformImage = function (imageDataHelper) {
        var data = imageDataHelper.data;
        for (var i = 0; i < data.length; i += 4) {
            var inverted = imageDataHelper.colorAt(i).invert();
            data[i] = inverted.r;
            data[i + 1] = inverted.g;
            data[i + 2] = inverted.b;

        }
    };


    return InvertFilter;
})();