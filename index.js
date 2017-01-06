var MultiSlideShow;

(function(){
    'use strict';
    MultiSlideShow = function(objectArray) {

        if(!objectArray)
            throw new Error('Expect one argument.');

        if(!(objectArray instanceof Array))
            throw new TypeError('Expected an array, got ', objectArray, '.');

        this.elementBindings = [];

        this.currentSlide = objectArray[0];

        this.setSlide = (function() {
            var slides = objectArray;
            var slideIndex = 0;

            return function(val) {
                if(val !== undefined) {
                    slideIndex = val < 0 ?
                        (val + 1) % slides.length + (slides.length - 1) :
                        val % slides.length;
                    this.currentSlide = slides[slideIndex];
                    this.updateElements();
                    return slideIndex;
                }
                else return slideIndex;
            }.bind(this);

        }).apply(this);

        // this.updateElements = (function(){
        //     var that = this;
        //     return function() {
        //         if(this.elementBindings.length === 0) return;
        //         var f;
        //         for(f = 0; f < this.elementBindings.length; f++)
        //             this.elementBindings[f].apply(that);
        //     };
        // }.bind(this))();

    };

    MultiSlideShow.prototype.updateElements = function(){
        if(this.elementBindings.length === 0) return;
        var f;
        for(f = 0; f < this.elementBindings.length; f++)
            this.elementBindings[f].apply(this);
    };

    var isString = function(thing){
        return (typeof thing === 'string' || thing instanceof String);
    };

    MultiSlideShow.prototype.bindElement = function(elementArray, property, attribute) {
        if(!(elementArray instanceof Array))
            throw new TypeError('Expecting an array for elementArray, got ', elementArray,'.');

        if (!(isString(property)))
            throw new TypeError('Expecting a string for property, got', property,'.');

        if (!(isString(attribute)))
            throw new TypeError('Expecting a string for attribute, got', attribute,'.');

        this.elementBindings[this.elementBindings.length] = function(){
            var i;
            for(i = 0; i < elementArray.length; i++) {
                elementArray[i][property] = this.currentSlide[attribute];
            }
        };

    };

    MultiSlideShow.prototype.bindEvent = function(val, element, event) {

        if (parseInt(val) !== val)
            throw new TypeError('Expecting integer for val, got ', val,'.');

        if (typeof element !== 'object')
            throw new TypeError('Expecting an object for element, got ', element,'.');

        if (!(isString(event)))
            throw new TypeError('Expecting a string for event, got ', event,'.');

        element.addEventListener(
            event,
            function() { this.setSlide(val); }.bind(this),
            false);
    };

    MultiSlideShow.prototype.bindNextEvent = function(){
        this.bindEvent.apply(this, [this.setSlide() + 1].concat(Array.prototype.slice.call(arguments)));
    };

    MultiSlideShow.prototype.bindPrevEvent = function(){
        this.bindEvent.apply(this, [this.setSlide() - 1].concat(Array.prototype.slice.call(arguments)));
    };
})();

module.exports = MultiSlideShow;
