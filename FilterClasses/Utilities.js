var Utilities = (function () {

    var Utilities = {};

    function checkCpuLittleEndianness() {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        // A 2x2 pixel area is enough for testing
        var imageData = context.getImageData(0, 0, 2, 2);
        // Create buffers
        var buf = new ArrayBuffer(imageData.data.length);
        var buf8 = new Uint8ClampedArray(buf);
        var data = new Uint32Array(buf);

        // Set a random byte
        data[1] = 0x0a0b0c0d;

        var isLittleEndian = true;
        if (buf[4] === 0x0a && buf[5] === 0x0b && buf[6] === 0x0c &&
            buf[7] === 0x0d) {
            isLittleEndian = false;
        }

        return isLittleEndian;
    };

    Object.defineProperty(Utilities, "isCpuLittleEndian", {
        writeable: false,
        value: checkCpuLittleEndianness(),
    });


    return Utilities;
})();