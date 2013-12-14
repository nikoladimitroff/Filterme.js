/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
var ConvolutionKernel = (function () {

    function ConvolutionKernel(data) {
        if (data.constructor != Array)
            throw new TypeError("data must be an array of numbers");

        var size = Math.sqrt(data.length);
        if (size != ~~size) {
            throw new RangeError("data must be a square matrix");
        }


        this.data = data;
        this.size = size;
    };

    ConvolutionKernel.prototype.multiplyImageAt = function (arrayCoordinate, imageDataHelper) {
        if (imageDataHelper.constructor != ImageDataHelper)
            throw new TypeError("imageDataHelper must be an instance of ImageDataHelper");

        var areaColors = imageDataHelper.getAreaColors(imageDataHelper.getExtendedVirtualNeighbours(arrayCoordinate, this.size));
        var total = new Color(0, 0, 0);
        for (var i = 0; i < areaColors.length; i++) {
            var multiplied = areaColors[i].scalarMultiply(this.data[i]);
            total.r += multiplied.r;
            total.g += multiplied.g;
            total.b += multiplied.b;
        };

        return total;
    };

    ConvolutionKernel.prototype.normalize = function () {
        var sum = 0;
        for (var i = 0; i < this.data.length; i++) {
            sum += this.data[i];
        };
        for (var i = 0; i < this.data.length; i++) {
            this.data[i] /= sum;
        };
    };

    return ConvolutionKernel;
})();