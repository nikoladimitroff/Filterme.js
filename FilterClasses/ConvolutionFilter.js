/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
/// <reference path="ConvolutionKernel.js" />
var ConvolutionFilter = (function () {

    function ConvolutionFilter(kernel) {
        if (kernel.constructor != ConvolutionKernel)
            throw new TypeError("kernel must be an instance of ConvolutionKernel");

        this.kernel = kernel;
    };

    inheritClassFrom(ConvolutionFilter, Filter);

    ConvolutionFilter.prototype.transformImage = function (imageDataHelper) {
        var data = imageDataHelper.data;
        var renderTarget = [];
        for (var i = 0; i < data.length; i += 4) {
            
            var transformed = this.kernel.multiplyImageAt(i, imageDataHelper);
            renderTarget.push(transformed);
        }

        for (var i = 0; i < renderTarget.length; i++) {
            var arrayCoordinate = i * 4;
            data[arrayCoordinate] = renderTarget[i].r;
            data[arrayCoordinate + 1] = renderTarget[i].g;
            data[arrayCoordinate + 2] = renderTarget[i].b;
        };
    };


    return ConvolutionFilter;
})();