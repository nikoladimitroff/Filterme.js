///#source 1 1 /Filters/Color.js
"use strict";
var Color = (function () {
    function Color(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    // Both functions below taken directly from http://www.easyrgb.com/index.php?X=MATH&H=18#text18
    function rgbToHsl(color) {
        var min = Math.min(Math.min(color.r, color.g), color.b);    //Min. value of RGB
        var max = Math.max(Math.max(color.r, color.g), color.b);    //Max. value of RGB
        var delta = max - min;             //Delta RGB value

        // Predefine hue, lightness and saturation
        var H, L, S;
        L = (max - min) / 2;

        if (delta == 0)                     //This is a gray, no chroma...
        {
            H = 0;                                //HSL results from 0 to 1
            S = 0;
        }
        else                                    //Chromatic data...
        {
            if (L < 0.5) S = delta / (max + min)
            else S = delta / (2 - max - min)

            var del_R = (((max - color.r) / 6) + (delta / 2)) / delta,
                del_G = (((max - color.g) / 6) + (delta / 2)) / delta,
                del_B = (((max - color.b) / 6) + (delta / 2)) / delta;

            if (color.r == max) H = del_B - del_G;
            else if (color.g == max) H = (1 / 3) + del_R - del_B;
            else if (color.b == max) H = (2 / 3) + del_G - del_R;

            if (H < 0) H += 1;
            if (H > 1) H -= 1;
        }
        return {
            h: H,
            s: S,
            L: L
        };
    }
    
    function hslToRgb(H, S, L) {
        // Predefine variables
        var R, G, B; 
        if (S == 0)                       //HSL from 0 to 1
        {
            R = L * 255                      //RGB results from 0 to 255
            G = L * 255
            B = L * 255
        }
        else {
            var var_1, var_2;
            if (L < 0.5) var_2 = L * (1 + S)
            else var_2 = (L + S) - (S * L)

            var_1 = 2 * L - var_2

            R = 255 * hslToRgb_2(var_1, var_2, H + (1 / 3))
            G = 255 * hslToRgb_2(var_1, var_2, H)
            B = 255 * hslToRgb_2(var_1, var_2, H - (1 / 3))
        }

        return new Color(R, G, B);
    }
    
    function hslToRgb_2(v1, v2, vH)             //Function Hue_2_RGB
    {
        if (vH < 0) vH += 1;
        if (vH > 1) vH -= 1;
        if ((6 * vH) < 1) return (v1 + (v2 - v1) * 6 * vH);
        if ((2 * vH) < 1) return (v2);
        if ((3 * vH) < 2) return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);
        return (v1)
    }

    Color.basicColors = {
        white: new Color(255, 255, 255),
        black: new Color(0, 0, 0),
        red: new Color(255, 0, 0),
        green: new Color(0, 255, 0),
        blue: new Color(0, 0, 255)
    };

    Color.grayscaleAlgorithms = {
        arithmeticMean: 0,
        geometricMean: 1,
    };

    Color.areTooDifferentPerComponent = function (color1, color2, threshold) {
        threshold = threshold || 0.1 * 255; // Default value

        return Math.abs(color1.r - color2.r) >= threshold ||
            Math.abs(color1.g - color2.g) >= threshold ||
            Math.abs(color1.b - color2.b) >= threshold;
    };


    Color.lerp = function (color1, color2, distance) {
        return new Color(
            color1.r * (1 - distance) + color2.r * distance,
            color1.g * (1 - distance) + color2.g * distance,
            color1.b * (1 - distance) + color2.b * distance);
    };

    Color.fromHsl = function (h, s, l) {
        return hslToRgb(h, s, l);
    };

    Color.prototype.toHsl = function () {
        return rgbToHsl(this);
    };

    Color.prototype.calculateLength = function () {
        return Math.sqrt(
                    this.r * this.r +
                    this.g * this.g +
                    this.b * this.b
                );
    }

    Color.prototype.calculateDistanceTo = function (color) {
        return Math.sqrt(
                    (this.r - color.r) * (this.r - color.r) +
                    (this.g - color.g) * (this.g - color.g) +
                    (this.b - color.b) * (this.b - color.b)
                );
    }

    Color.prototype.toGrayscale = function convertToGrayscale(grayscaleAlgorithm) {
        switch (grayscaleAlgorithm) {
            case Color.grayscaleAlgorithms.arithmeticMean:
                return (this.r + this.g + this.b) / 3;

            case Color.grayscaleAlgorithms.geometricMean:
                // Get the ratio of the geometric mean and the maximum geometric mean. Multiply that by 255 and convert to int
                return ~~((this.calculateLength() / Color.basicColors.white.calculateLength()) * 255);

            default:
                throw new RangeError("No such algorithm exists");
        }
    };

    Color.prototype.invert = function invert() {
        return new Color(255 - this.r, 255 - this.g, 255 - this.b);
    };

    Color.prototype.perComponentMultiply = function (color) {
        return new Color(this.r * color.r, this.g * color.g, this.b * color.b);
    };

    Color.prototype.scalarMultiply = function (scale) {
        return new Color(this.r * scale, this.g * scale, this.b * scale);
    };

    Color.prototype.add = function (color) {
        return new Color(this.r + color.r, this.g + color.g, this.b + color.b);
    };

    Color.prototype.substract = function (color) {
        return new Color(this.r - color.r, this.g - color.g, this.b - color.b);
    };

    Color.prototype.clamp = function () {
        this.r = Math.min(Math.max(0, this.r), 255);
        this.g = Math.min(Math.max(0, this.g), 255);
        this.b = Math.min(Math.max(0, this.b), 255);
    };

    return Color;
})();
///#source 1 1 /Filters/ImageDataHelper.js
/// <reference path="Color.js" />
var ImageDataHelper = (function () {

    function ImageDataHelper(imageData) {
        this.imageData = imageData;
        this.data = imageData.data;
    }

    ImageDataHelper.prototype.arrayCoordinatesToXY = function (arrayCoordinate) {
        var coordinate = arrayCoordinate / 4;
        var x = ~~(coordinate % this.imageData.width);
        var y = ~~(coordinate / this.imageData.width);

        return {
            x: x,
            y: y,
        };
    };

    ImageDataHelper.prototype.xyToArrayCoordinate = function (x, y) {
        return (x + this.imageData.width * y) * 4;
    };

    ImageDataHelper.prototype.getAreaColors = function (area) {
        var colors = [];
        var data = this.data; // Shortcut it
        for (var i = 0; i < area.length; i++) {
            var coord = area[i];
            colors.push(new Color(data[coord], data[coord + 1], data[coord + 2]));
        }

        return colors;
    }

    ImageDataHelper.prototype.getNeighbours = function (arrayCoordinate) {
        var xy = this.arrayCoordinatesToXY(arrayCoordinate);
        var x = xy.x,
            y = xy.y;

        // Shortcut stuff
        var data = this.data; 
        var width = this.imageData.width,
            height = this.imageData.height;

        var coord = this.xyToArrayCoordinate(x, y);
        var neighbours = [coord];

        if (x > 0) {
            coord = this.xyToArrayCoordinate(x - 1, y);
            neighbours.push(coord);
        }
        if (x < width - 1) {
            coord = this.xyToArrayCoordinate(x + 1, y);
            neighbours.push(coord);
        }
        if (y > 0) {
            coord = this.xyToArrayCoordinate(x, y + 1);
            neighbours.push(coord);
        }
        if (y < height - 1) {
            coord = this.xyToArrayCoordinate(x, y - 1);
            neighbours.push(coord);
        }

        return neighbours;
    };

    ImageDataHelper.prototype.getExtendedVirtualNeighbours = function (arrayCoordinates, size) {
        var xy = this.arrayCoordinatesToXY(arrayCoordinates);
        var topLeft = {
            row: xy.y - ~~(size / 2),
            col: xy.x - ~~(size / 2),
        };

        var neighbours = [];

        var rows = this.imageData.height,
            columns = this.imageData.width;

        for (var row = topLeft.row; row < topLeft.row + size; row++) {
            for (var col = topLeft.col; col < topLeft.col + size; col++) {
                // Normalize coordinates
                var actualRow = row, actualCol = col;
                if (actualRow < 0)
                    actualRow = 0;
                else if (actualRow > rows - 1)
                    actualRow = rows - 1;
                if (actualCol < 0)
                    actualCol = 0;
                else if (actualCol > columns - 1)
                    actualCol = columns - 1;

                neighbours.push(this.xyToArrayCoordinate(actualCol, actualRow));
            }
        }

        return neighbours;
    };

    ImageDataHelper.prototype.colorAt = function (arrayCoordinate) {
        return new Color(this.data[arrayCoordinate], this.data[arrayCoordinate + 1], this.data[arrayCoordinate + 2]);
    }

    ImageDataHelper.prototype.antialias = function () {
        var data = this.data;

        for (var i = 0; i < data.length; i += 4) {
            var coordinate = i;
            var neighbours = imageDataHelper.getAreaColors(imageDataHelper.getNeighbours(coordinate));
            var totalColor = new Color(0, 0, 0);
            for (var k = 0; k < neighbours.length; k++) {
                var current = neighbours[k];

                totalColor.r += current.r;
                totalColor.g += current.g;
                totalColor.b += current.b;
            }
            var pixel = imageDataHelper.colorAt(coordinate);
            totalColor.r /= neighbours.length;
            totalColor.g /= neighbours.length;
            totalColor.b /= neighbours.length;
            if (Color.areTooDifferentPerComponent(totalColor, pixel)) {
                data[coordinate] = totalColor.r;
                data[coordinate + 1] = totalColor.g;
                data[coordinate + 2] = totalColor.b;
            }
        }
    };

    return ImageDataHelper;
})();
///#source 1 1 /Filters/Utilities.js
var Utilities = (function () {

    var Utilities = {};

    function checkCpuLittleEndianness() {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        // A 2x2 pixel area is enough for testing
        var imageData = context.getImageData(0, 0, 2, 2);
        // Create buffers
        var buf = new ArrayBuffer(imageData.data.length);
        var buf8 = new Uint8ClampedArray(buf);
        var data = new Uint32Array(buf);

        // Set a random byte
        data[1] = 0x0a0b0c0d;

        var isLittleEndian = true;
        if (buf[4] === 0x0a && buf[5] === 0x0b && buf[6] === 0x0c &&
            buf[7] === 0x0d) {
            isLittleEndian = false;
        }

        return isLittleEndian;
    };

    Object.defineProperty(Utilities, "isCpuLittleEndian", {
        writeable: false,
        value: checkCpuLittleEndianness(),
    });

    return Utilities;
})();
///#source 1 1 /Filters/FilterClasses/Filter.js
/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
"use strict";
var Filter = (function () {

    function Filter() {

    };

    Filter.prototype.transformImage = function (imageDataHelper) {
        throw new TypeError("Method is abstract");
    };

    return Filter;
})();

var inheritClassFrom = function (derived, base) {
    derived.prototype = new base();
    derived.prototype.constructor = derived;
};
///#source 1 1 /Filters/FilterClasses/AdditiveFilter.js
/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
var AdditiveFiter = (function () {
    function AdditiveFiter(color) {
        if (color.constructor != Color) {
            throw new TypeError("color must be an instance of Color");
        }
        this.color = color;
    };

    inheritClassFrom(AdditiveFiter, Filter);

    AdditiveFiter.prototype.transformImage = function (imageDataHelper) {
        var data = imageDataHelper.data;
        var color = this.color;

        for (var i = 0; i < data.length; i += 4) {
            data[i] += color.r;
            data[i + 1] += color.g;
            data[i + 2] += color.b;
        }
    };

    return AdditiveFiter;
})();
///#source 1 1 /Filters/FilterClasses/BlendFilter.js
/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
var BlendFilter = (function () {
    function BlendFilter(filters, weights) {
        // If the user passed numbers, convert them to single-element arrays
        if (filters.constructor != Array) {
            throw new TypeError("filters must be an array");
        }
        // In case the user has provided only a single weight
        if (!weights) {
            weights = [];
            var weight = 1 / filters.length;
            for (var i = 0; i < filters.length; i++) {
                weights.push(weight);
            }
        }
        else if (weights.constructor != Array) {
            throw new TypeError("weights must be an array");
        }
        
        var sum = 0;
        for (var i = 0; i < weights.length; i++) {
            sum += weights[i];
        }

        for (var i = 0; i < weights.length; i++) {
            weights[i] /= sum;
        }

        this.filters = filters;
        this.weights = weights;
    };

    inheritClassFrom(BlendFilter, Filter);

    BlendFilter.prototype.transformImage = function (imageDataHelper) {
        var data = imageDataHelper.data;
        var size = data.length / 4;
        var renderTarget = [];

        renderTarget = new Uint8Array(data.length);
        var buffer = new Uint8Array(data.length);
        buffer.set(data);
        
        this.filters[0].transformImage(imageDataHelper);

        for (var j = 0; j < data.length; j += 4) {
            var transformed = imageDataHelper.colorAt(j).scalarMultiply(this.weights[0]);
            renderTarget[j] += transformed.r;
            renderTarget[j + 1] += transformed.g;
            renderTarget[j + 2] += transformed.b;
            renderTarget[j + 3] = 255;
        }
        data.set(buffer);

        for (var i = 1; i < this.filters.length; i++) {
            this.filters[i].transformImage(imageDataHelper);

            for (var j = 0; j < data.length; j += 4) {
                var transformed = imageDataHelper.colorAt(j).scalarMultiply(this.weights[i]);
                renderTarget[j] += transformed.r;
                renderTarget[j + 1] += transformed.g;
                renderTarget[j + 2] += transformed.b;
            }
            data.set(buffer);
        }

        data.set(renderTarget);
    };

    return BlendFilter;
})();
///#source 1 1 /Filters/FilterClasses/ColorSwapFilter.js
/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
var ColorSwapFilter = (function () {

    function ColorSwapFilter(color1, color2, predicateThreshold, usePerComponentPredicate) {
        if (color1.constructor != Color)
            throw new TypeError("color1 must be a instance of Color");
        if (color2.constructor != Color)
            throw new TypeError("color2 must be a instance of Color");
        if (predicateThreshold.constructor != Number || predicateThreshold <= 0)
            throw new TypeError("predicateThreshold must be a positive number");

        this.color1 = color1;
        this.color2 = color2;
        this.predicateThreshold = predicateThreshold;
        this.usePerComponentPredicate = Boolean(usePerComponentPredicate);
    };

    inheritClassFrom(ColorSwapFilter, Filter);

    ColorSwapFilter.prototype.targetColorPredicate = function (color1, color2) {
        // In case we are using per component different
        if (this.usePerComponentPredicate) {
            return !Color.areTooDifferentPerComponent(color1, color2, this.predicateThreshold);
        }

        // If the geometric distance between to color is larger than a threshold
        return color1.calculateDistanceTo(color2) <= this.predicateThreshold
    };

    ColorSwapFilter.prototype.transformImage = function (imageDataHelper) {
        var data = imageDataHelper.data;
        for (var i = 0; i < data.length; i += 4) {
            var color = imageDataHelper.colorAt(i);
            // If the color closely resembles on the spefied, swap
            if (this.targetColorPredicate(this.color1, color)) {
                data[i] = this.color2.r;
                data[i + 1] = this.color2.g;
                data[i + 2] = this.color2.b;
            }
            if (this.targetColorPredicate(this.color2, color)) {
                data[i] = this.color1.r;
                data[i + 1] = this.color1.g;
                data[i + 2] = this.color1.b;
            }
        }
    };


    return ColorSwapFilter;
})();
///#source 1 1 /Filters/FilterClasses/TargetColorFilter.js
/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
var TargetColorFilter = (function () {

    function TargetColorFilter(targetColor, predicateThreshold, grayscaleAlgo, usePerComponentPredicate) {
        if (targetColor.constructor != Color)
            throw new TypeError("targetColor must be a instance of Color");
        if (predicateThreshold.constructor != Number || predicateThreshold <= 0)
            throw new TypeError("predicateThreshold must be a positive number");

        this.targetColor = targetColor;
        this.predicateThreshold = predicateThreshold;
        this.grayscaleAlgo = grayscaleAlgo || Color.grayscaleAlgorithms.arithmeticMean;
        this.usePerComponentPredicate = Boolean(usePerComponentPredicate);
    };

    inheritClassFrom(TargetColorFilter, Filter);

    TargetColorFilter.prototype.targetColorPredicate = function (color) {
        // In case we are using per component different
        if (this.usePerComponentPredicate) {
            return Color.areTooDifferentPerComponent(this.targetColor, color, this.predicateThreshold);
        }

        // If the geometric distance between the color is larger than a threshold
        return this.targetColor.calculateDistanceTo(color) >= this.predicateThreshold;
    };

    TargetColorFilter.prototype.transformImage = function (imageDataHelper) {
        var data = imageDataHelper.data;
        for (var i = 0; i < data.length; i += 4) {
            var color = imageDataHelper.colorAt(i);

            if (this.targetColorPredicate(color)) {
                var grayscale = color.toGrayscale(this.grayscaleAlgo);
                data[i] = data[i + 1] = data[i + 2] = grayscale;
            }
        }
    };


    return TargetColorFilter;
})();
///#source 1 1 /Filters/FilterClasses/ConvolutionKernel.js
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
///#source 1 1 /Filters/FilterClasses/ConvolutionFilter.js
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
///#source 1 1 /Filters/FilterClasses/GrayscaleFilter.js
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
///#source 1 1 /Filters/FilterClasses/InvertFilter.js
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
///#source 1 1 /Filters/FilterClasses/PixelizeFilter.js
/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
var PixelizeFilter = (function () {
    function PixelizeFilter(level) {
        if (level.constructor != Number) {
            throw new TypeError("level must be an instance of Number");
        }
        this.level = ~~level;
    };

    inheritClassFrom(PixelizeFilter, Filter);

    PixelizeFilter.prototype.transformImage = function (imageDataHelper) {
        imageDataHelper = imageDataHelper || new ImageDataHelper();
        var data = imageDataHelper.data;
        var step = 4 * this.level;
        var levelOverTwo = ~~(this.level / 2);
        
        for (var x = 0; x < imageDataHelper.imageData.width; x += this.level) {
            for (var y = 0; y < imageDataHelper.imageData.height; y += this.level) {
                var index = imageDataHelper.xyToArrayCoordinate(x, y);
                var color = imageDataHelper.colorAt(index);
                var neighbours = imageDataHelper.getExtendedVirtualNeighbours(index, this.level);
                for (var j = 0; j < neighbours.length; j++) {
                    data[neighbours[j]] = color.r;
                    data[neighbours[j] + 1] = color.g;
                    data[neighbours[j] + 2] = color.b;
                }
            }
        }

    };

    return PixelizeFilter;
})();
///#source 1 1 /Filters/FilterClasses/RotateFilter.js
/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
var RotateFilter = (function () {

    function RotateFilter(angle) {
        if (angle.constructor != Number)
            throw new TypeError("angle must be a number");

        var cosine = Math.cos(angle),
            sine = Math.sin(angle);

        Object.defineProperties(this, {
            "cosine": {
                get: function () {
                    return cosine;
                },
                enumerable: false,
            },
            "sine": {
                get: function () {
                    return sine;
                },
                enumerable: false,
            }
        });

        Object.defineProperty(this, "angle", {
            get: function () {
                return angle;
            },
            set: function (value) {
                angle = value || 0;
                cosine = Math.cos(angle);
                sine = Math.sine(angle);
            },
        });
    };

    inheritClassFrom(RotateFilter, Filter);

    RotateFilter.prototype.transformImage = function (imageDataHelper) {
        var data = imageDataHelper.data;
        var renderTarget = [];

        var s = this.sine;
        var c = this.cosine;
        var originX = imageDataHelper.imageData.width / 2,
            originY = imageDataHelper.imageData.height / 2;
        for (var i = 0; i < data.length; i += 4) {

            var coordinates = imageDataHelper.arrayCoordinatesToXY(i);
            // Matrix transformation as usual -> M = T * R * T^-1, 
            // Wolfram alpha says that it is {{c, -s, x - c x + s y}, {s, c, y -(s x) - c y}, {0, 0, 1}}, where (x, y) is the origin, c is the cosine and s is the sine of the angle

            var x = c * coordinates.x - s * coordinates.y + (originX - c * originX + s * originY);
            var y = s * coordinates.x + c * coordinates.y + (originY - s * originX - c * originY);

            x = ~~x;
            y = ~~y;
            var transformed = imageDataHelper.colorAt(imageDataHelper.xyToArrayCoordinate(x, y));
            renderTarget.push(transformed);
        }

        for (var i = 0; i < renderTarget.length; i++) {
            var arrayCoordinate = i * 4;
            data[arrayCoordinate] = renderTarget[i].r;
            data[arrayCoordinate + 1] = renderTarget[i].g;
            data[arrayCoordinate + 2] = renderTarget[i].b;
        };
    };


    return RotateFilter;
})();
///#source 1 1 /Filters/FilterClasses/LayeredFilter.js
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
