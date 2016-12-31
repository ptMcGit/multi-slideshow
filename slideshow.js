// SlideShow

// An object that can be used to create and manipulate slideshows.

// The slides correspond to objects in an array.
// Properties common to slides can be associated with HTML elements.
// Events can be associated with next and previous slide actions.
// The current slide can also be determined directly.

// Instructions:

//  1. Create an instance of SlideShow e.g. 'new Slideshow([{a:1,b:2},{a:3,b:4}])'
//      - notice that the argument is an array of objects (they represent unique information for each slide)
//
//  2. Use bindElement() to pass a special function that contains a setter/assignment that expresses the association of an HTML element with the corresponding property of the "slide class" e.g. 'function(that) { element.innerHTML = that.title; }'
//      - notice the use of 'that' to stand in place of the slide object
//
//  3. Use bindPrev- bindNextEvent to pass two arguments that associate an element and event to previous slide and next slide actions, respectively e.g. 'bindPrevEvent(element, "click")'
//      - when element generates a "click" event the slideshow moves to the previous slide.
//
//  4. Use setSlide() to set the first slide e.g. 'setSlide(0)'
//    - notice that the slide show is zero-indexed
//    - this can also be used to manipulate the slideshow index directly

function SlideShow(objectArray) {

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

SlideShow.prototype.bindElement = function(elementArray, property, attribute) {
    this.elementBindings[this.elementBindings.length] = function(){
        for(var i in elementArray)
            elementArray[i][property] = this[attribute];
    };
};

SlideShow.prototype.bindNextEvent = function(element, event) {
    element.addEventListener(
        event,
        function() { this.setSlide(1); }.bind(this),
        false);
};

SlideShow.prototype.bindPrevEvent = function(element, event){
    element.addEventListener(
        event,
        function() { this.setSlide(-1); }.bind(this),
        false);
};
