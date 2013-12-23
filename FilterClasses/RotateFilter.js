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
        var originX = imageDataHelper.imageData.width,
            originY = imageDataHelper.imageData.height;
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