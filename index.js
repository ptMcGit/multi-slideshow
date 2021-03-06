var MultiSlideshow;

(function(){
    'use strict';
    MultiSlideshow = function(objectArray) {

        if(!objectArray)
            throw new Error('Expect one argument.');

        if(!(objectArray instanceof Array))
            throw new TypeError('Expected an array, got ', objectArray, '.');

        var slides = objectArray;
        var slideIndex = 0;
        this.currentSlide = slides[slideIndex];

        this.elementBindings = [];

        this.setSlide = (function() {

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

        this.shuffleSlides = (function(){
            // random number from 0 to max; excluding max
            // Thanks, Mozilla!

            var randnum = function(maxval) {
                var min = Math.ceil(0);
                var max = Math.floor(maxval);
                return Math.floor(Math.random() * (max - min)) + min;
            };

            return function(){
                var i;
                var randomSlides = [];
                var randomI;

                for(i = 0; i < slides.length + randomSlides.length; i++) {
                    randomI = randnum(slides.length);
                    randomSlides.push(slides[randomI]);
                    slides.splice(randomI,1);
                }
                slides = randomSlides;
            };
        })();

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

    MultiSlideshow.prototype.updateElements = function(){
        if(this.elementBindings.length === 0) return;
        var f;
        for(f = 0; f < this.elementBindings.length; f++)
            this.elementBindings[f].apply(this);
    };

    var isString = function(thing){
        return (typeof thing === 'string' || thing instanceof String);
    };

    MultiSlideshow.prototype.bindElement = function(elementArray, property, attribute) {
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

    MultiSlideshow.prototype.bindEvent = function(val, element, event) {

        if (typeof element !== 'object')
            throw new TypeError('Expecting an object for element, got ', element,'.');

        if (!(isString(event)))
            throw new TypeError('Expecting a string for event, got ', event,'.');

        if(parseInt(val) === val)
            element.addEventListener(
                event,
                function() { this.setSlide(val); }.bind(this),
                false);
        else if(val && Object.prototype.toString.call(val) === '[object Function]')
            element.addEventListener(
                event,
                function(){ this.setSlide(val.apply(this)); }.bind(this),
                false);
        else
            throw new TypeError('Expecting integer or function for val, got ', val,'.');
    };

    MultiSlideshow.prototype.bindNextEvent = function(){
        this.bindEvent.apply(this, [function(){ return this.setSlide() + 1;}].concat(Array.prototype.slice.call(arguments)));
    };

    MultiSlideshow.prototype.bindPrevEvent = function(){
        this.bindEvent.apply(this, [function(){ return this.setSlide() - 1;}].concat(Array.prototype.slice.call(arguments)));
    };
})();

module.exports = MultiSlideshow;
