const $ = require('jquery');

module.exports = class ConvertImage {
    constructor(params) {
        this.params = params;
        this.data;
        this.input = $(this.params.element);
        this.init();
        this.onChange = params.onChange;
    }

    init() {
        let self = this;
        this.input.on('change', function() {
            self.readInput(this);
        });
    }

    readInput(input) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            let dataURI;
            let self = this;

            reader.onload = (event) => {
                dataURI = event.target.result;
                this.data = dataURI;
                if (this.data) {
                    this.onChange(dataURI);
                }
            };

            reader.readAsDataURL(input.files[0]);
        }
    }
};
