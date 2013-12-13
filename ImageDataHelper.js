/// <reference path="Color.js" />
var ImageDataHelper = (function () {

    function ImageDataHelper(imageData) {
        this.imageData = imageData;
        this.data = imageData.data;
    }

    ImageDataHelper.prototype.arrayCoordinatesToXY = function (arrayCoordinate) {
        var coordinate = arrayCoordinate / 4;
        var x = ~~(coordinate / this.imageData.width);
        var y = ~~(coordinate % this.imageData.width);

        return {
            x: x,
            y: y,
        };
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

        var coord = (x * width + y) * 4;
        var neighbours = [coord];

        if (x > 0) {
            coord = ((x - 1) * width + y) * 4;
            neighbours.push(coord);
        }
        if (x < width - 1) {
            coord = ((x + 1) * width + y) * 4;
            neighbours.push(coord);
        }
        if (y > 0) {
            coord = (x * width + y + 1) * 4;
            neighbours.push(coord);
        }
        if (y < height - 1) {
            coord = (x * width + y - 1) * 4;
            neighbours.push(coord);
        }

        return neighbours;
    };

    ImageDataHelper.prototype.colorAt = function (arrayCoordinate) {
        return new Color(this.data[arrayCoordinate], this.data[arrayCoordinate + 1], this.data[arrayCoordinate + 2]);
    }

    return ImageDataHelper;
})();