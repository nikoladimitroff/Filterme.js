/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
var EmphasizeColorFilter = (function () {

    function EmphasizeColorFilter(targetColor, threshold, grayscaleAlgo, usePerComponentPredicate) {
        if (targetColor.constructor != Color)
            throw new TypeError("targetColor must be a instance of Color");
        if (threshold.constructor != Number || threshold <= 0)
            throw new TypeError("threshold must be a positive number");

        this.targetColor = targetColor;
        this.threshold = threshold;
        this.grayscaleAlgo = grayscaleAlgo || Color.grayscaleAlgorithms.arithmeticMean;
        this.usePerComponentPredicate = Boolean(usePerComponentPredicate);
    };

    inheritClassFrom(EmphasizeColorFilter, Filter);

    EmphasizeColorFilter.prototype.targetColorPredicate = function (color) {
        // In case we are using per component difference
        if (this.usePerComponentPredicate) {
            return Color.areTooDifferentPerComponent(this.targetColor, color, this.threshold);
        }
        // If the geometric distance between the color is larger than a threshold
        return this.targetColor.calculateDistanceTo(color) >= this.threshold;
    };

    EmphasizeColorFilter.prototype.transformImage = function (imageDataHelper) {
        var data = imageDataHelper.data;
        for (var i = 0; i < data.length; i += 4) {
            var color = imageDataHelper.colorAt(i);
            // If the predicate is true, that is the color is different enough than our target
            if (this.targetColorPredicate(color)) {
                var grayscale = color.toGrayscale(this.grayscaleAlgo);
                data[i] = data[i + 1] = data[i + 2] = grayscale;
            }
        }
    };


    return EmphasizeColorFilter;
})();