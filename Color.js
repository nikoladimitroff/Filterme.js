var Color = (function () {
    function Color(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
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

    Color.prototype.clamp = function () {
        return new Color(
                Math.min(Math.max(0, this.r), 255),
                Math.min(Math.max(0, this.g), 255),
                Math.min(Math.max(0, this.b), 255));
    };


    Color.areTooDifferentPerComponent = function (color1, color2, threshold) {
        threshold = threshold || 0.1 * 255; // Default value

        return Math.abs(color1.r - color2.r) >= threshold ||
            Math.abs(color1.g - color2.g) >= threshold ||
            Math.abs(color1.b - color2.b) >= threshold;
    };


    return Color;
})();