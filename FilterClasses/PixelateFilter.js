/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
var PixelateFilter = (function () {
    function PixelateFilter(level) {
        if (level.constructor != Number) {
            throw new TypeError("level must be an instance of Number");
        }
        this.level = ~~level;
    };

    inheritClassFrom(PixelateFilter, Filter);

    PixelateFilter.prototype.transformImage = function (imageDataHelper) {
        var data = imageDataHelper.data;
        var step = 4 * this.level;
        var levelOverTwo = ~~(this.level / 2);
        
        // Loop trough the image but skip all rows and columns whose indices are not divisible by our pixelation level
        for (var x = 0; x < imageDataHelper.imageData.width; x += this.level) {
            for (var y = 0; y < imageDataHelper.imageData.height; y += this.level) {
                var index = imageDataHelper.xyToArrayCoordinate(x, y);
                var color = imageDataHelper.colorAt(index);
                // Get the indices of all colors in the square with size = this.level and set their color to the color of pixel in the middle
                var neighbours = imageDataHelper.getExtendedVirtualNeighbours(index, this.level);
                for (var j = 0; j < neighbours.length; j++) {
                    data[neighbours[j]] = color.r;
                    data[neighbours[j] + 1] = color.g;
                    data[neighbours[j] + 2] = color.b;
                }
            }
        }
    };

    return PixelateFilter;
})();