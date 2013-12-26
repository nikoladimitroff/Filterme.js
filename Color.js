var Color = (function () {
    function Color(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    // Both functions below taken directly from http://www.easyrgb.com/index.php?X=MATH&H=18#text18
    function rgbToHsl(color) {
        var min = Math.min(Math.min(color.r, color.g), color.b);    //Min. value of RGB
        var max = Math.max(Math.max(color.r, color.g), color.b);    //Max. value of RGB
        var delta = max - min;             //Delta RGB value

        // Predefine hue, lightness and saturation
        var H, L, S;
        L = (max - min) / 2;

        if (delta == 0)                     //This is a gray, no chroma...
        {
            H = 0;                                //HSL results from 0 to 1
            S = 0;
        }
        else                                    //Chromatic data...
        {
            if (L < 0.5) S = delta / (max + min)
            else S = delta / (2 - max - min)

            var del_R = (((max - color.r) / 6) + (delta / 2)) / delta,
                del_G = (((max - color.g) / 6) + (delta / 2)) / delta,
                del_B = (((max - color.b) / 6) + (delta / 2)) / delta;

            if (color.r == max) H = del_B - del_G;
            else if (color.g == max) H = (1 / 3) + del_R - del_B;
            else if (color.b == max) H = (2 / 3) + del_G - del_R;

            if (H < 0) H += 1;
            if (H > 1) H -= 1;
        }
        return {
            h: H,
            s: S,
            L: L
        };
    }
    
    function hslToRgb(H, S, L) {
        // Predefine variables
        var R, G, B; 
        if (S == 0)                       //HSL from 0 to 1
        {
            R = L * 255                      //RGB results from 0 to 255
            G = L * 255
            B = L * 255
        }
        else {
            var var_1, var_2;
            if (L < 0.5) var_2 = L * (1 + S)
            else var_2 = (L + S) - (S * L)

            var_1 = 2 * L - var_2

            R = 255 * hslToRgb_2(var_1, var_2, H + (1 / 3))
            G = 255 * hslToRgb_2(var_1, var_2, H)
            B = 255 * hslToRgb_2(var_1, var_2, H - (1 / 3))
        }

        return new Color(R, G, B);
    }
    
    function hslToRgb_2(v1, v2, vH)             //Function Hue_2_RGB
    {
        if (vH < 0) vH += 1;
        if (vH > 1) vH -= 1;
        if ((6 * vH) < 1) return (v1 + (v2 - v1) * 6 * vH);
        if ((2 * vH) < 1) return (v2);
        if ((3 * vH) < 2) return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);
        return (v1)
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

    Color.areTooDifferentPerComponent = function (color1, color2, threshold) {
        threshold = threshold || 0.1 * 255; // Default value

        return Math.abs(color1.r - color2.r) >= threshold ||
            Math.abs(color1.g - color2.g) >= threshold ||
            Math.abs(color1.b - color2.b) >= threshold;
    };


    Color.lerp = function (color1, color2, distance) {
        return new Color(
            color1.r * (1 - distance) + color2.r * distance,
            color1.g * (1 - distance) + color2.g * distance,
            color1.b * (1 - distance) + color2.b * distance);
    };

    Color.fromHsl = function (h, s, l) {
        return hslToRgb(h, s, l);
    };

    Color.prototype.toHsl = function () {
        return rgbToHsl(this);
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

    Color.prototype.add = function (color) {
        return new Color(this.r + color.r, this.g + color.g, this.b + color.b);
    };

    Color.prototype.substract = function (color) {
        return new Color(this.r - color.r, this.g - color.g, this.b - color.b);
    };

    Color.prototype.clamp = function () {
        this.r = Math.min(Math.max(0, this.r), 255);
        this.g = Math.min(Math.max(0, this.g), 255);
        this.b = Math.min(Math.max(0, this.b), 255);
    };

    return Color;
})();