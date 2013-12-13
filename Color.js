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

    Color.prototype.calculateLength = function () {
        return Math.sqrt(
                    this.r * this.r +
                    this.g * this.g +
                    this.b * this.b
                );
    }

    Color.prototype.calculateDistanceTo = function (color2) {
        return Math.sqrt(
                    (this.r - color2.r) * (this.r - color2.r) +
                    (this.g - color2.g) * (this.g - color2.g) +
                    (this.b - color2.b) * (this.b - color2.b)
                );
    }


    return Color;
})();