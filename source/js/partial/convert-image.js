const $ = require('jquery');
const Mustache = require('mustache');

class ConvertImage {
    constructor(params) {
        this.canvas = document.createElement('canvas');
        this.data = [];
        this.init(params);
    }

    init(params) {
        this.previewTemplate = $('#previewTemplate').html();
        this.outputTemplate = $('#outputTemplate').html();
        if ( typeof params === 'string' ) {
            this.image = params;
        } else {
            this.image = params.image;
            this.backgroundColor = params.backgroundColor;
            this.maxWidth = params.maxWidth;
        }
        this.drawCanvas();
    }

    changeImage(image) {
        this.image = image;
        this.drawCanvas();
    }

    drawCanvas() {
        let image;
        let context = this.canvas.getContext('2d');
        let sizeCorrection = 1.55;

        if ( this.image ) {

            image = new Image();
            image.src = this.image;

            image.onload = () => {
                if (image.width > this.maxWidth) {
                    this.data.width = this.maxWidth;
                    this.data.height = Math.round( ( ( this.maxWidth / image.width ) * image.height ) / sizeCorrection );
                } else {
                    this.data.height = image.height;
                    this.data.width = image.width / sizeCorrection;
                }

                this.canvas.height = this.data.height;
                this.canvas.width = this.data.width;

                // draw the canvas
                if (this.backgroundColor) {
                    context.rect(0, 0, this.data.width, this.data.height);
                    context.fillStyle = this.backgroundColor;
                    context.fill();
                }
                context.drawImage(image, 0, 0, this.data.width, this.data.height);
                this.data.pixels = context.getImageData(0, 0, this.data.width, this.data.height).data;

                this.convertToHex();
            };
        }

    }

    convertRGB(r,g,b,a) {
        let value;
        function componentToHex(c) {
            let hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }
        if (a === 255) {
            value = `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
        } else if ( a === 0 ) {
            value = 'transparent';
        } else {
            a = a / 255;
            value = `rgba(${r},${g},${b},${a.toFixed(5)})`;
        }
        return value;
    }

    convertToHex() {
        let newArray = [];
        let chunk = 4;
        for (let i = 0; i < this.data.pixels.length; i+=chunk) {
            let r = this.data.pixels[i+0];
            let g = this.data.pixels[i+1];
            let b = this.data.pixels[i+2];
            let a = this.data.pixels[i+3];
            newArray.push(this.convertRGB(r,g,b,a));
        }

        var newArray2 = [];

        while (newArray.length > 0) {
            newArray2.push(newArray.splice(0, this.data.width));
        }

        this.data.pixels = newArray2;
    }

    renderCanvas(element) {
        $(element).html(this.canvas);
    }

    preview(element) {
        let render = Mustache.render(this.previewTemplate, this.data);
        $(element).html(render);
    }

    output(element) {
        let render = Mustache.render(this.outputTemplate, this.data);
        $(element).html(render);
    }

}

module.exports = ConvertImage;
