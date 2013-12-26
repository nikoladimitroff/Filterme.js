/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
var EmphasizeFilter = (function () {

    function add(x, y) {
        return x + y;
    };

    function multiply(x, y) {
        return x * y;
    };

    function EmphasizeFilter(channels, scalars, useMultiplication) {
        // If the user passed numbers, convert them to single-element arrays
        if (channels.constructor == Number) {
            channels = [channels];
            scalars = [scalars];
        }

        for (var i = 0; i < channels; i++) {
            if (channels[i] > 2 || channels[i] < 0)
                throw new RangeError("invalid channel - " + channels[i]);
        }

        this.channels = channels;
        this.scalars = scalars;
        // Use a helper function that does the required operation
        this.operator = useMultiplication ? multiply : add;
    };

    inheritClassFrom(EmphasizeFilter, Filter);

    EmphasizeFilter.prototype.transformImage = function (imageDataHelper) {
        var data = imageDataHelper.data;
        for (var i = 0; i < data.length; i += 4) {
            for (var j = 0; j < this.channels.length; j++) {
                // For each channel, compute its sum / product with the factor
                data[i + this.channels[j]] = this.operator(data[i + this.channels[j]], this.scalars[j]);
            }
        }
    };


    return EmphasizeFilter;
})();