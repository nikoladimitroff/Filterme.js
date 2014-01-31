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
        var renderTarget = new Uint8ClampedArray(imageData.length);
        for (var i = 0; i < size; i++) {
            var index = 4 * i;
            var transformed = this.kernel.multiplyImageAt(index, imageDataHelper);
            renderTarget[index] = transformed.r;
            renderTarget[index + 1] = transformed.g;
            renderTarget[index + 2] = transformed.b;
            renderTarget[index + 3] = imageDataHelper.data[index + 3];
        }

        imageData.set(renderTarget);
    };


    return ConvolutionFilter;
})();