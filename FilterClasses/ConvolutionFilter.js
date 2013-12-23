/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
/// <reference path="ConvolutionKernel.js" />
/// <reference path="Utilities.js" />
var ConvolutionFilter = (function () {

    function ConvolutionFilter(kernel) {
        if (kernel.constructor != ConvolutionKernel)
            throw new TypeError("kernel must be an instance of ConvolutionKernel");

        this.kernel = kernel;
    };

    inheritClassFrom(ConvolutionFilter, Filter);

    ConvolutionFilter.prototype.transformImage = function (imageDataHelper) {
        var size = imageDataHelper.data.length / 4;
        var imageData = imageDataHelper.data;
        var renderTarget = [];
        for (var i = 0; i < size; i++) {
            var transformed = this.kernel.multiplyImageAt(i * 4, imageDataHelper);
            renderTarget.push(transformed);
        }

        var arrayCoordinate = 0;
        for (var i = 0; i < renderTarget.length; i++) {
            arrayCoordinate = i * 4;
            imageData[arrayCoordinate] = renderTarget[i].r;
            imageData[arrayCoordinate + 1] = renderTarget[i].g;
            imageData[arrayCoordinate + 2] = renderTarget[i].b;
        }
    };


    return ConvolutionFilter;
})();