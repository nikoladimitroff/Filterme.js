/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
var ConvolutionKernel = (function () {

    function ConvolutionKernel(data, bias) {
        if (data.constructor != Array)
            throw new TypeError("data must be an array of numbers");

        var size = Math.sqrt(data.length);
        if (size != ~~size) {
            throw new RangeError("data must be a square matrix");
        }


        this.kernel = data;
        this.size = size;
        this.bias = bias || 0;
    };

    ConvolutionKernel.prototype.multiplyImageAt = function (arrayCoordinate, imageDataHelper) {
        if (imageDataHelper.constructor != ImageDataHelper)
            throw new TypeError("imageDataHelper must be an instance of ImageDataHelper");

        var areaColors = imageDataHelper.getAreaColors(imageDataHelper.getExtendedVirtualNeighbours(arrayCoordinate, this.size));
        var total = new Color(0, 0, 0);
        for (var i = 0; i < areaColors.length; i++) {
            var multiplied = areaColors[i].scalarMultiply(this.kernel[i]);
            total.r += multiplied.r;
            total.g += multiplied.g;
            total.b += multiplied.b;
        };
        total.r += this.bias;
        total.g += this.bias;
        total.b += this.bias;

        return total;
    };

    ConvolutionKernel.prototype.normalize = function () {
        var sum = 0;
        for (var i = 0; i < this.kernel.length; i++) {
            sum += this.kernel[i];
        };
        for (var i = 0; i < this.kernel.length; i++) {
            this.kernel[i] /= sum;
        };
    };


    // Predefined kernels and kernel-generation methods
    Object.defineProperty(ConvolutionKernel, "predefinedKernels", {
        writable: false,
        value: {}
    });

    Object.defineProperties(ConvolutionKernel.predefinedKernels, {
        identity: {
            writable: false,
            value: new ConvolutionKernel([0, 0, 0,
                                          0, 1, 0,
                                          0, 0, 0]),
        },
        brighten: { 
            writable: false,
            value: new ConvolutionKernel([10])
        },
        sharpen: {
            writable: false,
            value: new ConvolutionKernel([-1, -1, -1,
                                          -1, 9, -1,
                                          -1, -1, -1])
        },
        emboss: { 
            writable: false, 
            value: new ConvolutionKernel([-1, -1,  0,
                                          -1,  0,  1,
                                          0, 1, 1],
                                        128)
        },
        coloredEdgeDetection: { 
            writable: false, 
            value: new ConvolutionKernel([1, 1, 1,
                                          1, -7, 1,
                                          1, 1, 1])
        },
        edgeDetectionMedium: { 
            writable: false, 
            value: new ConvolutionKernel([0, 1, 0,
                                          1, -4, 1,
                                          0, 1, 0])
        },
        edgeDetectionHard: { 
            writable: false, 
            value: new ConvolutionKernel([-1, -1, -1,
                                          -1, 8, -1,
                                          -1, -1, -1])
        },

        blur: {
            writable: false,
            value: new ConvolutionKernel([0, 0, 1, 0, 0,
                                          0, 1, 1, 1, 0,
                                          1, 1, 1, 1, 1,
                                          0, 1, 1, 1, 0,
                                          0, 0, 1, 0, 0])
        },
        gaussian: {
            writable: false,
            value: new ConvolutionKernel([
            0.00000067, 0.00002292, 0.00019117, 0.00038771, 0.00019117, 0.00002292, 0.00000067,
            0.00002292, 0.00078634, 0.00655965, 0.01330373, 0.00655965, 0.00078633, 0.00002292,
            0.00019117, 0.00655965, 0.05472157, 0.11098164, 0.05472157, 0.00655965, 0.00019117,
            0.00038771, 0.01330373, 0.11098164, 0.22508352, 0.11098164, 0.01330373, 0.00038771,
            0.00019117, 0.00655965, 0.05472157, 0.11098164, 0.05472157, 0.00655965, 0.00019117,
            0.00002292, 0.00078633, 0.00655965, 0.01330373, 0.00655965, 0.00078633, 0.00002292,
            0.00000067, 0.00002292, 0.00019117, 0.00038771, 0.00019117, 0.00002292, 0.00000067])
        },
    });

ConvolutionKernel.computeGaussianBlurKernel = function (radius) {
    var pi = Math.PI;
    var sigma = radius / 6;
    var radius = radius | 1; // Make radius odd
    var radiusOverTwo = ~~(radius / 2); // Make it integer
    var twoSigmaSquared = 2 * sigma * sigma;
    var mainConstant = (1 / (pi * twoSigmaSquared));
    var lengthSquared = 0;
    var kernel = [];
    
    for (var y = radiusOverTwo; y > -radiusOverTwo - 1; y--) {
        for (var x = -radiusOverTwo; x < radiusOverTwo + 1; x++) {            
            kernel.push(mainConstant * Math.exp(-(x * x + y * y) / twoSigmaSquared));
        }
    }

    var result = new ConvolutionKernel(kernel);
    result.normalize();
    return result;
};

ConvolutionKernel.computeLightnessModifyingKernel = function (lightnessModifier) {
    return new ConvolutionKernel([lightnessModifier]);
};

ConvolutionKernel.motionBlurDirections = {
    topToBottom: 0,
    leftToRight: 1,
    topLeftToBottomRight: 2,
    bottomLeftToTopRight: 3,
};

ConvolutionKernel.computeMotionBlur = function (size, direction) {
    if (size % 2 == 0)
        throw new RangeError("Kernel size must be an odd number");

    var iterationFunction;
    switch (direction) {
        case ConvolutionKernel.motionBlurDirections.topToBottom:
            iterationFunction = function (index) {
                return [index - size, index + size];
            };
            break;

        case ConvolutionKernel.motionBlurDirections.leftToRight:
            iterationFunction = function (index) {
                var row = size * ~~(index / size);
                return [(index - 1) % size + row, (index + 1) % size + row];
            };
            break;

        case ConvolutionKernel.motionBlurDirections.topLeftToBottomRight:
            iterationFunction = function (index) {
                return [index - size - 1, index + size + 1];
            };
            break;

        case ConvolutionKernel.motionBlurDirections.bottomLeftToTopRight:
            iterationFunction = function (index) {
                return [index - size + 1, index + size - 1];
            };
            break;

        default:
            throw new RangeError("Direction must be chosen amongst ConvolotionKernel.motionBlurDirections");
    };


    var kernel = [];
    var kernelLength = size * size;
    // Fill it with zeros
    for (var i = 0; i < kernelLength; i++) {
        kernel[i] = 0;
    }
    // Write ones whereever needed
    var startIndex = ((size * size) - 1) / 2;
    var visited = [startIndex];
    while (visited.length != 0) {
        var current = visited.pop();
        var next = iterationFunction(current);
        if (kernel[next[0]] == 0) {
            kernel[next[0]] = 1;
            visited.push(next[0]);
        }
        if (kernel[next[1]] == 0) {
            kernel[next[1]] = 1;
            visited.push(next[1]);
        }
    }
    var result = new ConvolutionKernel(kernel);
    result.normalize();
    return result;
};

ConvolutionKernel.prototype.prettyPrint = function () {
    for (var i = 0; i < this.size; i++) {
        var line = "";
        for (var j = 0; j < this.size; j++) {
            line += this.kernel[i * this.size + j].toFixed(3) + ", ";
        }
        console.log(line);
    };
};

ConvolutionKernel.predefinedKernels.blur.normalize();

return ConvolutionKernel;
})();