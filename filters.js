/// <reference path="FilterClasses/BlendFilter.js" />
/// <reference path="FilterClasses/AdditiveFiter.js" />
/// <reference path="FilterClasses/RotateFilter.js" />
/// <reference path="FilterClasses/LayeredFilter.js" />
/// <reference path="FilterClasses/InvertFilter.js" />
/// <reference path="FilterClasses/GrayscaleFilter.js" />
/// <reference path="FilterClasses/ConvolutionFilter.js" />
/// <reference path="FilterClasses/ConvolutionKernel.js" />
/// <reference path="FilterClasses/TargetColorFilter.js" />
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

var imagePath = "Images/tiger.jpg";
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

var draw = function () {
    var start = Date.now();
    hiddenContext.drawImage(image, 0, 0);
    var imageData = hiddenContext.getImageData(0, 0, hiddenContext.canvas.width, hiddenContext.canvas.height);
	var data = imageData.data;
	imageDataHelper = new ImageDataHelper(imageData);

	var targetColor = new Color(0, 0, 255);
	var maxDistance = 150;
	var grayscaleAlgo = Color.grayscaleAlgorithms.geometricMean;
	var usePerComponentPredicate = false;

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
	var red = new AdditiveFiter(new Color(40, 0, 0));
	var green = new AdditiveFiter(new Color(0, 40, 0));
	var blue = new AdditiveFiter(new Color(0, 0, 40));
	var edgeDetection = new ConvolutionFilter(ConvolutionKernel.predefinedKernels.edgeDetectionHard);
	var identity = new ConvolutionFilter(ConvolutionKernel.predefinedKernels.identity);
	var brighten = new ConvolutionFilter(ConvolutionKernel.computeLightnessModifyingKernel(1.5));
	var coloredEdgeDetection = new ConvolutionFilter(ConvolutionKernel.predefinedKernels.coloredEdgeDetection);
	var gaussian = new ConvolutionFilter(ConvolutionKernel.computeGaussianBlurKernel(10));

	var rotations = [new RotateFilter(0), new RotateFilter(Math.PI / 2), new RotateFilter(Math.PI), new RotateFilter(Math.PI * 1.5), red];
	//var filter = new BlendFilter([gaussian, edgeDetection]);
    //filter = new RotateFilter(Math.PI / 2);

	filter = new PixelizeFilter(10);
    filter.transformImage(imageDataHelper);
	//edgeDetection.transformImage(imageDataHelper);
	//gaussian.transformImage(imageDataHelper);
	//brighten.transformImage(imageDataHelper);
    // Antialiasing    
	//imageDataHelper.antialias();
    // End AA
	
	context.putImageData(imageDataHelper.imageData, 0, 0, 0, 0, imageData.width, imageData.height);

	console.log("done", Date.now() - start);
	filter.kernel.prettyPrint();
};
image.onload = function () {
    fixDimensions();
}
