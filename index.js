function MultiSlideShow(objectArray) {

    if(!objectArray)
        throw new Error('Expect one argument.');

    if(!(objectArray instanceof Array))
        throw new TypeError('Expected an array, got ', objectArray, '.');

    this.elementBindings = [];

    this.setProto = function(p) {
        Object.setPrototypeOf(this, p);
        this.updateElements();
    };

    this.setSlide = (function() {
        var slides = objectArray;
        var slideIndex = 0;

        return function(val) {
            slideIndex += val;
            if (slideIndex < 0) slideIndex = (slides.length - 1);
            if (slideIndex == slides.length) slideIndex = 0;
            this.setProto(slides[slideIndex]);
        }.bind(this);

    }).apply(this);

    this.updateElements = (function(){
        var that = this;
        return function() {
            if(this.elementBindings.length === 0) return;
            var f;
            for(f = 0; f < this.elementBindings.length; f++)
                this.elementBindings[f].apply(that);
        };
    }.bind(this))();

}

MultiSlideShow.prototype.bindElement = function(elementArray, property, attribute) {
    this.elementBindings[this.elementBindings.length] = function(){
        for(var i in elementArray)
            elementArray[i][property] = this[attribute];
    };
};

MultiSlideShow.prototype.bindNextEvent = function(element, event) {
    element.addEventListener(
        event,
        function() { this.setSlide(1); }.bind(this),
        false);
};

MultiSlideShow.prototype.bindPrevEvent = function(element, event){
    element.addEventListener(
        event,
        function() { this.setSlide(-1); }.bind(this),
        false);
};

module.exports = MultiSlideShow;
