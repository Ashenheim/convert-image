/* global window, document */

const $ = require('jquery');
const ConvertImage = require('./partial/convert-image.js');
const ReadImage = require('./partial/read-image.js');

$(document).ready(function() {
    let convertimage = new ConvertImage({
        image: 'assets/media/narley_2.jpg',
        maxWidth: 60
    });
    let readImage = new ReadImage({
        element: '#imageInput',
        onChange: (image) => convertimage.changeImage(image)
    });

    $('#buttonCanvas').on('click', () => convertimage.preview('#preview'));
    $('#buttonTemplate').on('click', () => convertimage.output('#output'));
});
