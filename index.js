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
            elementArray[i][property] = this[attribute];
        }
    };
};

MultiSlideShow.prototype.bindEvent = function(val, element, event) {

        if (typeof element !== 'object')
            throw new TypeError('Expecting an object for element, got', element,'.');

        if (!(isString(event)))
            throw new TypeError('Expecting a string for event, got', event,'.');

    element.addEventListener(
        event,
        function() { this.setSlide(val); }.bind(this),
        false);
};

MultiSlideShow.prototype.bindNextEvent = function(){
    this.bindEvent.apply(this, [1].concat(Array.prototype.slice.call(arguments)));
};

MultiSlideShow.prototype.bindPrevEvent = function(){
    this.bindEvent.apply(this, [-1].concat(Array.prototype.slice.call(arguments)));
};
};


// MultiSlideShow.prototype.bindNextEvent = function(element, event) {
//     if (!(typeof element === 'object'))
//         throw new TypeError('Expecting an object for element, got', element,'.');

//     if (!(isString(event)))
//         throw new TypeError('Expecting a string for event, got', event,'.');

//     element.addEventListener(
//         event,
//         function() { this.setSlide(1); }.bind(this),
//         false);
// };

// MultiSlideShow.prototype.bindPrevEvent = function(element, event){
//     if (!(typeof element === 'object'))
//         throw new TypeError('Expecting an object for element, got', element,'.');

//     if (!(isString(event)))
//         throw new TypeError('Expecting a string for event, got', event,'.');

//     element.addEventListener(
//         event,
//         function() { this.setSlide(-1); }.bind(this),
//         false);
// };

module.exports = MultiSlideShow;
