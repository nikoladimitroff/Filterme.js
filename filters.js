/// <reference path="FilterClasses/BlendFilter.js" />
/// <reference path="FilterClasses/AdditiveFilter.js" />
/// <reference path="FilterClasses/RotateFilter.js" />
/// <reference path="FilterClasses/LayeredFilter.js" />
/// <reference path="FilterClasses/InvertFilter.js" />
/// <reference path="FilterClasses/GrayscaleFilter.js" />
/// <reference path="FilterClasses/ConvolutionFilter.js" />
/// <reference path="FilterClasses/ConvolutionKernel.js" />
/// <reference path="FilterClasses/EmphasizeColorFilter.js" />
/// <reference path="Color.js" />
/// <reference path="FilterClasses/ColorSwapFilter.js" />
/// <reference path="ImageDataHelper.js" />
/// <reference path="jquery-2.0.0.js" />
/// <reference path="FilterClasses/PixelateFilter.js" />
$(document).ready(function () {
    var context = document.getElementById("filter-canvas").getContext("2d");
    var hiddenContext = document.getElementById("hidden-canvas").getContext("2d");

    var imageSources = ["Images/walle.jpg", "Images/tiger.jpg", "Images/leaves.jpg", "Images/blue-red.jpg"];

    var loaded = 0;
    // Show the overlay while loading images
    $("#loading-overlay").show();
    function onImageLoaded() {
        loaded++;
        if (loaded == imageSources.length) {
            viewmodel.selectedFilter(viewmodel.filters()[0]);
            viewmodel.selectedImage(viewmodel.images()[0]);
            // Hide it before drawing the first image
            $("#loading-overlay").hide();
            run();
        }
    }

    var images = [];
    for (var i = 0; i < imageSources.length; i++) {
        var image = new Image();
        image.src = imageSources[i];
        image.onload = onImageLoaded;
        image.name = imageSources[i].substr(imageSources[i].lastIndexOf("/") + 1);
        images.push(image);
    }

    function generateFilters() {
        var targetColor = new Color(255, 0, 0);
        var maxDistance = 100;
        var grayscaleAlgo = Color.grayscaleAlgorithms.geometricMean;
        var usePerComponentPredicate = false;

        var targetColorFilter1 = new EmphasizeColorFilter(targetColor, maxDistance, Color.grayscaleAlgorithms.arithmeticMean, false);
        var targetColorFilter2 = new EmphasizeColorFilter(targetColor, maxDistance, Color.grayscaleAlgorithms.arithmeticMean, true);
        targetColorFilter1.name = "Emphasize red, threshold 100, Geometric distance";
        targetColorFilter2.name = "Emphasize red, threshold 100, Per component";

        var colorSwapFilter = new ColorSwapFilter(new Color(237, 78, 0), new Color(15, 85, 171), 125, false);
        colorSwapFilter.name = "Color Swap, (almost) Red & (almost) Blue, threshold: " + colorSwapFilter.predicateThreshold;

        var oddRotation = new RotateFilter(66 * Math.PI / 180);
        oddRotation.name = "Rotation at 66 degrees";

        kernel = new ConvolutionKernel([
            0, 0, 0,
            -100, 0, 10,
            0, 0, 0
        ], 1000);
        var experiment = new ConvolutionFilter(kernel);
        experiment.name = "My own experiment, don't mind it";

        var red = new AdditiveFilter(new Color(40, 0, 0));
        red.name = "Additive Red (40)";
        var green = new AdditiveFilter(new Color(0, 40, 0));
        green.name = "Additive Green (40)";
        var blue = new AdditiveFilter(new Color(0, 0, 40));
        blue.name = "Additive Blue (40)";
        var grayscaleArithmetic = new GrayscaleFilter(Color.grayscaleAlgorithms.arithmeticMean);
        grayscaleArithmetic.name = "Grayscale Arithmetic";
        var grayscaleGeometric = new GrayscaleFilter(Color.grayscaleAlgorithms.geometricMean);
        grayscaleGeometric.name = "Grayscale Geometric";
        var edgeDetection = new ConvolutionFilter(ConvolutionKernel.predefinedKernels.edgeDetectionHard);
        edgeDetection.name = "Edge Detection";
        var emboss = new ConvolutionFilter(ConvolutionKernel.predefinedKernels.emboss);
        emboss.name = "Emboss";
        var identity = new ConvolutionFilter(ConvolutionKernel.predefinedKernels.identity);
        identity.name = "Identity";
        var brighten = new ConvolutionFilter(ConvolutionKernel.computeLightnessModifyingKernel(1.5));
        brighten.name = "Lightness, 1.5";
        var dim = new ConvolutionFilter(ConvolutionKernel.computeLightnessModifyingKernel(0.5));
        dim.name = "Lightness, 0.5";
        var coloredEdgeDetection = new ConvolutionFilter(ConvolutionKernel.predefinedKernels.coloredEdgeDetection);
        coloredEdgeDetection.name = "Colored Edge Detection";
        var pixelate = new PixelateFilter(10);
        pixelate.name = "Pixelate, level 10";
        var sharpen = new ConvolutionFilter(ConvolutionKernel.predefinedKernels.sharpen);
        sharpen.name = "Sharpen";
        var gaussian = new ConvolutionFilter(ConvolutionKernel.computeGaussianBlurKernel(10));
        gaussian.name = "Gaussian, radius 10";

        var array = [
            identity, targetColorFilter1, targetColorFilter2, colorSwapFilter, experiment, oddRotation, red, green, blue, grayscaleArithmetic, grayscaleGeometric,
            edgeDetection, emboss, brighten, dim, coloredEdgeDetection, pixelate, sharpen, gaussian
        ];

        //for (var i = 0; i < array.length; i++) {
        //    array[i] = ko.observable(array[i]);
        //}

        return array;
    }

    var filters = ko.observableArray(generateFilters());

    images = ko.observableArray(images);
    var viewmodel = {
        filters: filters,
        selectedFilter: ko.observable(),
        images: images,
        selectedImage: ko.observable(),
        antialias: ko.observable(true),
        showUI: ko.observable(true),
    };

    var fixDimensions = function fixDimensions() {
        // main
        var canvasContainer = $("#canvas-container");
        context.canvas.width = hiddenContext.canvas.width = canvasContainer.width();
        context.canvas.height = hiddenContext.canvas.height = canvasContainer.height();

        // Scale image so that it fills the entire screen
        var imageToCanvasWidth = context.canvas.width / viewmodel.selectedImage().width,
            imageToCanvasHeight = context.canvas.height / viewmodel.selectedImage().height;

        context.scale(imageToCanvasWidth, imageToCanvasHeight);
        hiddenContext.scale(imageToCanvasWidth, imageToCanvasHeight);
    };

    var draw = function (progress) {
        //var start = Date.now();
        hiddenContext.drawImage(viewmodel.selectedImage(), 0, 0);
        var imageData = hiddenContext.getImageData(0, 0, hiddenContext.canvas.width, hiddenContext.canvas.height);
        var helper = new ImageDataHelper(imageData);
        viewmodel.selectedFilter().transformImage(helper, progress);
        if (viewmodel.antialias())
            helper.antialias();

        context.putImageData(helper.imageData, 0, 0);
        console.log(context.canvas.width, context.canvas.height);
    };

    window.addEventListener("keydown", function (args) {
        if (args.keyCode == "T".charCodeAt(0)) {
            var data = context.canvas.toDataURL();
            window.open(data, "_blank");
        }
    });

    function spreadArrayEvenly(arraySize) {
        for (var i = 1; i < arraySize; i++) {
            var j = arraySize / i;
            if (j == ~~j && i >= j) {
                return {
                    width: j,
                    height: i
                };
            }
        }
        return { width: arraySize, height: 1 };
    }

    function drawMultipleNamedFilters(filters, context, hiddenContext) {
        var matrixSize = spreadArrayEvenly(filters.length);
        var size = {
            width: hiddenContext.canvas.width / matrixSize.width,
            height: hiddenContext.canvas.height / matrixSize.height
        };

        var fontSize = size.height / 5;
        context.font = fontSize + "px Segoe UI";
        for (var i = 0; i < matrixSize.height; i++) {
            for (var j = 0; j < matrixSize.width; j++) {
                var imageData = hiddenContext.getImageData(context.canvas.width / 2 - size.width / 2, context.canvas.height / 2 - size.height / 2, size.width, size.height);
                var helper = new ImageDataHelper(imageData);
                var filter = filters[i * matrixSize.width + j];
                filter.transformImage(helper);
                helper.antialias();
                context.putImageData(helper.imageData, j * size.width, i * size.height);
                context.save();
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.fillStyle = "white";
                var text = filter.name;
                context.fillText(text, j * size.width, (i + 1) * size.height - fontSize, size.width);
                context.restore();
            }
        }
    }

    function run() {
        fixDimensions();
        $("#loading-overlay").toggle();
        setTimeout(function () {
            draw();
            $("#loading-overlay").toggle();
        }, 10);
    }

    $("#repaint-button").click(function () {
        run();
    });


    ko.applyBindings(viewmodel);
});