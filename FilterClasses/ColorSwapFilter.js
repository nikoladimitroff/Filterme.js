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
                var lightnessRatio = color.toHsl().l / this.color1.toHsl().l;

                data[i] = ~~(this.color2.r * lightnessRatio);
                data[i + 1] = ~~(this.color2.g * lightnessRatio);
                data[i + 2] = ~~(this.color2.b * lightnessRatio);
            }
            if (this.targetColorPredicate(this.color2, color)) {
                var lightnessRatio = color.toHsl().l / this.color2.toHsl().l;

                data[i] = ~~(this.color1.r * lightnessRatio);
                data[i + 1] = ~~(this.color1.g * lightnessRatio);
                data[i + 2] = ~~(this.color1.b * lightnessRatio);
            }
        }
    };


    return ColorSwapFilter;
})();