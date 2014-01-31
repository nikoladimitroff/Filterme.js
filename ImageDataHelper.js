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
            var neighbours = this.getAreaColors(this.getNeighbours(coordinate));
            var totalColor = new Color(0, 0, 0);
            for (var k = 0; k < neighbours.length; k++) {
                var current = neighbours[k];

                totalColor.r += current.r;
                totalColor.g += current.g;
                totalColor.b += current.b;
            }
            var pixel = this.colorAt(coordinate);
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