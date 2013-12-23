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
	var filter;
    //filter = new TargetColorFilter(targetColor, maxDistance, grayscaleAlgo, usePerComponentPredicate);
    filter = new ConvolutionFilter(kernel);
    //filter = new ConvolutionFilter(ConvolutionFilter.predefinedKernels.edgeDetectionHard);
	//filter = new GrayscaleFilter();
	//filter = new ColorSwapFilter(Color.basicColors.white, Color.basicColors.blue, 150);
    //filter = new InvertFilter();

    filter = new LayeredFilter([
        new ConvolutionFilter(ConvolutionKernel.predefinedKernels.blur),
        new ConvolutionFilter(ConvolutionKernel.computeLightnessModifyingKernel(5)),
        new ConvolutionFilter(kernel),
        new ConvolutionFilter(ConvolutionKernel.computeLightnessModifyingKernel(1/5))
    ]);

    //filter = new ConvolutionFilter(ConvolutionKernel.predefinedKernels.edgeDetectionHard);

    //filter = new RotateFilter(Math.PI / 2);

    filter.transformImage(imageDataHelper);
    // Antialiasing    
	//imageDataHelper.antialias();
    // End AA
	
	context.putImageData(imageDataHelper.imageData, 0, 0, 0, 0, imageData.width, imageData.height);

	console.log("done", Date.now() - start);

};
image.onload = function () {
    fixDimensions();
}
