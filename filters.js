/// <reference path="Color.js" />
/// <reference path="ImageDataHelper.js" />
if (window.netscape && netscape.security && netscape.security.PrivilegeManager) {
	netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
}

var context = document.getElementById("filter-canvas").getContext("2d");
var hiddenContext = document.getElementById("hidden-canvas").getContext("2d");
var imageDataHelper;

var imagePath = "leaves.jpg";
var image = new Image();
image.src = imagePath;

var targetColor = new Color(255, 255, 0);

var maxDistance = 150;

var areColorsTooDifferent = function (color1, color2, threshold) {
    threshold = threshold || 0.1 * 255; // Default value

	return Math.abs(color1.r - color2.r) >= threshold || 
		Math.abs(color1.g - color2.g) >= threshold || 
		Math.abs(color1.b - color2.b) >= threshold;
};

function targetColorPredicate(color1, color2) {
    return color1.calculateDistanceTo(color2) >= maxDistance; // If the geometric distance between the color is larger than a threshold
    //return areColorsTooDifferent(color1, color2); // If the 
};

function convertToGrayscale(color) {
    //return (color.r + color.g + color.b) / 3; // Arithmetic mean
    return ~~((color.calculateLength() / Color.basicColors.white.calculateLength()) * 255); // Geometric mean over maximum geometric mean ~ 441

};

var draw = function () {
	hiddenContext.drawImage(image, 0, 0);
	
	var imageData = hiddenContext.getImageData(0, 0, hiddenContext.canvas.width, hiddenContext.canvas.height);
	var data = imageData.data;
	imageDataHelper = new ImageDataHelper(imageData);

	for (var i = 0; i < data.length; i += 4) {
	    var color = imageDataHelper.colorAt(i);
		
	    if (targetColorPredicate(targetColor, color)) {
	        var grayscale = convertToGrayscale(color);
	        data[i] = data[i + 1] = data[i + 2] = grayscale;
		}
	}
	
    // Antialiasing
    
	for (var i = 0; i < data.length; i += 4) {
		var coordinate = i;
		var neighbours = imageDataHelper.getAreaColors(imageDataHelper.getNeighbours(coordinate, imageData), data);
		var totalColor = new Color(0, 0, 0);
		for (var k = 0; k < neighbours.length; k++) {
			var current = neighbours[k];
			
			totalColor.r += current.r;
			totalColor.g += current.g;
			totalColor.b += current.b;				
		}
		var pixel = imageDataHelper.colorAt(coordinate);
		totalColor.r /= neighbours.length;
		totalColor.g /= neighbours.length;
		totalColor.b /= neighbours.length;
		if (areColorsTooDifferent(totalColor, pixel)) {		
		    data[coordinate] = totalColor.r;
		    data[coordinate + 1] = totalColor.g;
		    data[coordinate + 2] = totalColor.b;	
		}
	}
	// End AA
	
	context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
};
image.onload = function () {
	draw();
}
