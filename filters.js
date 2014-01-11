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
/// <reference path="FilterClasses/PixelizeFilter.js" />
if (window.netscape && netscape.security && netscape.security.PrivilegeManager) {
	netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
}

var context = document.getElementById("filter-canvas").getContext("2d");
var hiddenContext = document.getElementById("hidden-canvas").getContext("2d");

var imagePath = "Images/walle.jpg";
var image = new Image();
image.src = imagePath;

var fixDimensions = function fixDimensions() {
    // main
    var canvasContainer = $("#canvas-container");
    context.canvas.width = hiddenContext.canvas.width = canvasContainer.width();
    context.canvas.height = hiddenContext.canvas.height = canvasContainer.height();

    // Scale image so that it fills the entire screen
    var imageToCanvasWidth = context.canvas.width / image.width,
        imageToCanvasHeight = context.canvas.height / image.height;

    context.scale(imageToCanvasWidth, imageToCanvasHeight);
    hiddenContext.scale(imageToCanvasWidth, imageToCanvasHeight);
    draw();
};
//$(window).resize(fixDimensions);


var imageDataHelper;
var kernel;

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

var filters;
var draw = function () {
    var start = Date.now();
    hiddenContext.drawImage(image, 0, 0);
    var imageData = hiddenContext.getImageData(0, 0, hiddenContext.canvas.width, hiddenContext.canvas.height);
	var data = imageData.data;
	imageDataHelper = new ImageDataHelper(imageData);

	var targetColor = new Color(255, 0, 0);
	var maxDistance = 100;
	var grayscaleAlgo = Color.grayscaleAlgorithms.geometricMean;
	var usePerComponentPredicate = false;

	var targetColorFilter = new EmphasizeColorFilter(targetColor, maxDistance, 1);

	kernel = ConvolutionKernel.predefinedKernels.emboss;
	kernel = new ConvolutionKernel([
        0, 0, 0,
        -100, 0, 10,
        0, 0, 0
	], 1000);
    //kernel = ConvolutionKernel.computeLightnessModifyingKernel(1/10);
	kernel = new ConvolutionKernel([ -1, -1, -1, -1, -1,
	                                 -1, -1, -1, -1, -1,
	                                 -1, -1, 30, -1, -1,
	                                 -1, -1, -1, -1, -1,
	                                 -1, -1, -5, -1, -1,
	], 100);

	var red = new AdditiveFilter(new Color(40, 0, 0));
	red.name = "Red";
	var green = new AdditiveFilter(new Color(0, 40, 0));
	green.name = "Green";
	var blue = new AdditiveFilter(new Color(0, 0, 40));
	blue.name = "Blue";
	var grayscale = new GrayscaleFilter();
	grayscale.name = "Grayscale";
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
	var pixelize = new PixelizeFilter(10);
	pixelize.name = "Pixelize";
	var sharpen = new ConvolutionFilter(ConvolutionKernel.predefinedKernels.sharpen);
	sharpen.name = "Sharpen";
	var gaussian = new ConvolutionFilter(ConvolutionKernel.computeGaussianBlurKernel(10));
	gaussian.name = "Gaussian";

	var rotations = [new RotateFilter(0), new RotateFilter(Math.PI / 2), new RotateFilter(Math.PI), new RotateFilter(Math.PI * 1.5), red];
	var filter = new BlendFilter(rotations);
    //filter = new RotateFilter(Math.PI / 2);

	//edgeDetection.transformImage(imageDataHelper);
	//gaussian.transformImage(imageDataHelper);
	//brighten.transformImage(imageDataHelper);
    // Antialiasing    
	//imageDataHelper.antialias();
    // End AA

    //filters = [identity, brighten, pixelize, red, green, blue, coloredEdgeDetection, edgeDetection, emboss];
    //filters = [identity, brighten, dim, pixelize, gaussian, sharpen, coloredEdgeDetection, edgeDetection, emboss];
    filters = [identity, red, green, blue, grayscale]
    var matrixSize = spreadArrayEvenly(filters.length);
    var size = {
        width: hiddenContext.canvas.width / matrixSize.width,
        height: hiddenContext.canvas.height / matrixSize.height
    }

    var fontSize = size.height / 5;
    context.font = fontSize + "px Segoe UI";
    for (var i = 0; i < matrixSize.height; i++) {
        for (var j = 0; j < matrixSize.width; j++) {
            var imageData = hiddenContext.getImageData(context.canvas.width / 2 - size.width / 2, context.canvas.height / 2 - size.height / 2, size.width, size.height);
            var helper = new ImageDataHelper(imageData);
            var filter = filters[i * matrixSize.width + j]
            filter.transformImage(helper);

            context.putImageData(helper.imageData, j * size.width, i * size.height);
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.fillStyle = "white";
            var text = filter.name;
            context.fillText(text, j * size.width, (i + 1) * size.height - fontSize, size.width);
            context.restore();
        }
    }



   // imageDataHelper.antialias();
	console.log("done", Date.now() - start);
	//filter.kernel.prettyPrint();
};

window.addEventListener("keydown", function (args) {
    if (args.keyCode == "T".charCodeAt(0)) {
        var data = context.canvas.toDataURL();
        console.log(data);
        window.open(data, "_blank");
    }
});

image.onload = function () {
    fixDimensions();
}
