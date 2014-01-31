Filterme.js
===========

A JavaScript library that applies filters to images.
Performance may not be the best, but compare it with Paint.NET for example, the difference ain't that much and Paint.NET is pretty much written in unsafe C# code so it ain't that bad.

See the demo [here](http://demos.dimitroff.bg/filterme)

# Usage

1. Draw your image on an HTML canvas.
2. Get the image data using `context.getImageData`
3. Instantiate an `ImageDataHelper` - `var helper = new ImageDataHelper(imageData);`
4. Instantiate an image filter. For example, `var grayscale = new GrayscaleFilter();`
5. Call the filter's `transformImage` method - `grayscale.transformImage(helper);`
6. The filter performs the transformation in-place. Draw the same image data back to the canvas using `context.putImageData(helper.imageData, 0, 0);`

# TODO list (known issues)

*   Missing a namespace, gonna add it soon