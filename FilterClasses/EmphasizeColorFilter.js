/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
var EmphasizeColorFilter = (function () {

    function EmphasizeColorFilter(targetColor, predicateThreshold, grayscaleAlgo, usePerComponentPredicate) {
        if (targetColor.constructor != Color)
            throw new TypeError("targetColor must be a instance of Color");
        if (predicateThreshold.constructor != Number || predicateThreshold <= 0)
            throw new TypeError("predicateThreshold must be a positive number");

        this.targetColor = targetColor;
        this.predicateThreshold = predicateThreshold;
        this.grayscaleAlgo = grayscaleAlgo || Color.grayscaleAlgorithms.arithmeticMean;
        this.usePerComponentPredicate = Boolean(usePerComponentPredicate);
    };

    inheritClassFrom(EmphasizeColorFilter, Filter);

    EmphasizeColorFilter.prototype.targetColorPredicate = function (color) {
        // In case we are using per component different
        if (this.usePerComponentPredicate) {
            return Color.areTooDifferentPerComponent(this.targetColor, color, this.predicateThreshold);
        }

        // If the geometric distance between the color is larger than a threshold
        return this.targetColor.calculateDistanceTo(color) >= this.predicateThreshold;
    };

    EmphasizeColorFilter.prototype.transformImage = function (imageDataHelper) {
        var data = imageDataHelper.data;
        for (var i = 0; i < data.length; i += 4) {
            var color = imageDataHelper.colorAt(i);

            if (this.targetColorPredicate(color)) {
                var grayscale = color.toGrayscale(this.grayscaleAlgo);
                data[i] = data[i + 1] = data[i + 2] = grayscale;
            }
        }
    };


    return EmphasizeColorFilter;
})();