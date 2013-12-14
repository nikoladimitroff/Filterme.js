/// <reference path="FilterClasses/InvertFilter.js" />
/// <reference path="FilterClasses/GrayscaleFilter.js" />
/// <reference path="FilterClasses/ConvolutionFilter.js" />
/// <reference path="FilterClasses/ConvolutionKernel.js" />
/// <reference path="FilterClasses/ConvolutionFilter.js" />
/// <reference path="FilterClasses/ConvolutionKernel.js" />
/// <reference path="FilterClasses/TargetColorFilter.js" />
/// <reference path="Color.js" />
/// <reference path="ImageDataHelper.js" />
/// <reference path="jquery-2.0.0.js" />
if (window.netscape && netscape.security && netscape.security.PrivilegeManager) {
	netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
}

var context = document.getElementById("filter-canvas").getContext("2d");
var hiddenContext = document.getElementById("hidden-canvas").getContext("2d");

var imagePath = "leaves.jpg";
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
    hiddenContext.drawImage(image, 0, 0);
    var imageData = hiddenContext.getImageData(0, 0, hiddenContext.canvas.width, hiddenContext.canvas.height);
	var data = imageData.data;
	imageDataHelper = new ImageDataHelper(imageData);

	var targetColor = new Color(255, 0, 0);
	var maxDistance = 100;
	var grayscaleAlgo = Color.grayscaleAlgorithms.arithmeticMean;
	var usePerComponentPredicate = false;

	kernel = ConvolutionKernel.predefinedKernels.emboss;

	var filter;
    //filter = new TargetColorFilter(targetColor, maxDistance, grayscaleAlgo, usePerComponentPredicate);
    filter = new ConvolutionFilter(kernel);
    //filter = new ConvolutionFilter(ConvolutionFilter.predefinedKernels.edgeDetectionHard);
    //filter = new GrayscaleFilter();
	//filter = new InvertFilter();

    filter.transformImage(imageDataHelper);
    // Antialiasing    
	//imageDataHelper.antialias();
	// End AA
	
	context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);

	console.log("done");

};
image.onload = function () {
    fixDimensions();
}
