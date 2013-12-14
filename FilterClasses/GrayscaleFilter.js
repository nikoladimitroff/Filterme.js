/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
var GrayscaleFilter = (function () {

    function GrayscaleFilter(grayscaleAlgo) {
        this.grayscaleAlgo = grayscaleAlgo || Color.grayscaleAlgorithms.arithmeticMean;
    };

    inheritClassFrom(GrayscaleFilter, Filter);

    GrayscaleFilter.prototype.transformImage = function (imageDataHelper) {
        var data = imageDataHelper.data;
        for (var i = 0; i < data.length; i += 4) {
            var color = imageDataHelper.colorAt(i);
            var grayscale = color.toGrayscale(this.grayscaleAlgo);
            data[i] = data[i + 1] = data[i + 2] = grayscale;
        }
    };


    return GrayscaleFilter;
})();