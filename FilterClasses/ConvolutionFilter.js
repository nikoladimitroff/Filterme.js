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

    ConvolutionFilter.computeGaussianBlurKernel = function (sigma) {
        var pi = Math.PI;
        var size = 7;
        var twoSigmaSquared = 2 * sigma * sigma;
        var lengthSquared = 0;
        var kernel = [];
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var index = i * size + j;
                var x = i - size,
                    y = j - size;
                kernel[index] = (1 / (pi * twoSigmaSquared) * Math.exp(-(x * x + y * y) / twoSigmaSquared))
            }
        }


        return new ConvolutionKernel(kernel);
    };

    ConvolutionFilter.predefinedKernels = {
        identity: new ConvolutionKernel([0, 0, 0,
                                        0, 1, 0,
                                        0, 0, 0]),
        sharpen: new ConvolutionKernel([0, -1, 0,
                                        -1, 5, -1,
                                        0, -1, 0]),
        edgeDetectionMedium: new ConvolutionKernel([0, 1, 0,
                                                    1, -4, 1,
                                                    0, 1, 0]),
        edgeDetectionHard: new ConvolutionKernel([-1, -1, -1,
                                              -1, 8, -1,
                                              -1, -1, -1]),

        gaussian: new ConvolutionKernel([
            0.00000067,	0.00002292,	0.00019117,	0.00038771,	0.00019117,	0.00002292,	0.00000067,
            0.00002292,	0.00078634,	0.00655965,	0.01330373,	0.00655965,	0.00078633,	0.00002292,
            0.00019117,	0.00655965,	0.05472157,	0.11098164,	0.05472157,	0.00655965,	0.00019117,
            0.00038771,	0.01330373,	0.11098164,	0.22508352,	0.11098164,	0.01330373,	0.00038771,
            0.00019117,	0.00655965,	0.05472157,	0.11098164,	0.05472157,	0.00655965,	0.00019117,
            0.00002292,	0.00078633,	0.00655965,	0.01330373,	0.00655965,	0.00078633,	0.00002292,
            0.00000067,	0.00002292,	0.00019117,	0.00038771,	0.00019117,	0.00002292,	0.00000067]),
    };

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