/// <reference path="../ImageDataHelper.js" />
/// <reference path="../Color.js" />
/// <reference path="Filter.js" />
var BlendFilter = (function () {
    function BlendFilter(filters, weights) {
        // If the user passed numbers, convert them to single-element arrays
        if (filters.constructor != Array) {
            throw new TypeError("filters must be an array");
        }
        // In case the user has provided only a single weight
        if (!weights) {
            weights = [];
            var weight = 1 / filters.length;
            for (var i = 0; i < filters.length; i++) {
                weights.push(weight);
            }
        }
        else if (weights.constructor != Array) {
                throw new TypeError("weights must be an array");
        }
        
        var sum = 0;
        for (var i = 0; i < weights.length; i++) {
            sum += weights[i];
        }

        for (var i = 0; i < weights.length; i++) {
            weights[i] /= sum;
        }

        this.filters = filters;
        this.weights = weights;
    };

    inheritClassFrom(BlendFilter, Filter);

    BlendFilter.prototype.transformImage = function (imageDataHelper) {
        var data = imageDataHelper.data;
        var size = data.length / 4;
        var renderTarget = [];

        renderTarget = new Uint8Array(data.length);
        var buffer = new Uint8Array(data.length);
        buffer.set(data);
        
        this.filters[0].transformImage(imageDataHelper);
        //for (var i = 0; i < size; i++) {
        //    var color = imageDataHelper.colorAt(i).scalarMultiply(this.weights[0]);
        //    renderTarget.push(color);
        //}

        for (var j = 0; j < data.length; j += 4) {
            var transformed = imageDataHelper.colorAt(j).scalarMultiply(this.weights[0]);
            renderTarget[j] += transformed.r;
            renderTarget[j + 1] += transformed.g;
            renderTarget[j + 2] += transformed.b;
            renderTarget[j + 3] = 255;
        }
        data.set(buffer);

        for (var i = 1; i < this.filters.length; i++) {
            this.filters[i].transformImage(imageDataHelper);

            //for (var j = 0; j < size; j++) {
            //    var transformed = imageDataHelper.colorAt(j).scalarMultiply(this.weights[i]);
            //    renderTarget[j] = renderTarget[j].add(transformed);
            //}
            for (var j = 0; j < data.length; j += 4) {
                var transformed = imageDataHelper.colorAt(j).scalarMultiply(this.weights[i]);
                renderTarget[j] += transformed.r;
                renderTarget[j + 1] += transformed.g;
                renderTarget[j + 2] += transformed.b;
            }
            data.set(buffer);
        }

        data.set(renderTarget);

        //for (var i = 0; i < renderTarget.length; i++) {
        //    var index = i * 4;
        //    data[index] = renderTarget[i].r;
        //    data[index + 1] = renderTarget[i].g;
        //    data[index + 2] = renderTarget[i].b;
        //}
    };


    return BlendFilter;
})();