describe("MultiSlideshow", function(){
    var MultiSlideshow = require("../index.js");

    function MockElement(){
        this.click = function(){};
        this.mockDesc = 'mock element';
        this.longMockDesc = 'mock element long';
        this.addEventListener = function(event, func, bool) {
            this[event] = func;
        };
    }

    var testSlides = [
        {name: 'name1', desc: 'desc1', longDesc: 'long desc1'},
        {name: 'name2', desc: 'desc2', longDesc: 'long desc2'},
        {name: 'name3', desc: 'desc3', longDesc: 'long desc3'},
    ];

    describe("initialization", function(){

        it("raises an exception unless initialization parameter is an array", function(){
            expect(function(){ new MultiSlideshow('string'); })
                .toThrowError(TypeError);
        });

        it("raises an exception with no parameters", function(){
            expect(function(){ new MultiSlideshow(); })
                .toThrowError();
        });

    });

    describe("post-initialization", function(){

        var ms, e;

        beforeEach(function(){
            ms = new MultiSlideshow(testSlides);
            e = new MockElement();
        });

        describe("#bindElement", function(){

            it("will throw an error if first param is not an array", function(){
                expect(function(){
                    ms.bindElement(
                        e,
                        'mockDesc',
                        'desc');})
                    .toThrowError(TypeError);
            });

            it("will throw an error if second param is not a string", function(){
                expect(function(){
                    ms.bindElement(
                        e,
                        undefined,
                        'desc');})
                    .toThrowError(TypeError);
            });

            it("will throw an error if third param is not given", function(){
                expect(function(){
                    ms.bindElement(
                        e,
                        'mockDesc');})
                    .toThrowError(TypeError);
            });

            it("is used to make a property of a slide assignable to a property of an element", function(){
                ms.bindElement(
                    [e],
                    'mockDesc',
                    'desc'
                );
                ms.setSlide(1);
                expect(e.mockDesc).toEqual('desc2');
            });

            it("is used to make a property of a slide assignable to a property of multiple elements", function(){
                this.f = new MockElement();
                ms.bindElement(
                    [e, this.f],
                    'mockDesc',
                    'desc'
                );

                ms.setSlide(1);
                expect(e.mockDesc).toEqual('desc2');
                expect(this.f.mockDesc).toEqual('desc2');
            });

        });

        describe("#setSlide", function(){

            it("changes the current slide by an index corresponding to the original object", function(){
                ms.setSlide(0);
                ms.setSlide(2);
                expect(ms.currentSlide).toEqual(testSlides[2]);
            });

            it("returns the current slide index when invoked with no arguments.", function(){
                ms.setSlide(0);
                expect(ms.setSlide()).toEqual(0);
            });

        });

        describe("#bindEvent", function(){
            it("changes the current slide to a specific slide", function(){
                ms.setSlide(0);
                ms.bindEvent(2, e, 'click');
                e.click();
                expect(ms.currentSlide).toEqual(testSlides[2]);
            });

            it("when applied through #bindNextEvent, it changes current slide to the next 'slide'", function(){
                ms.setSlide(0);
                ms.bindNextEvent(e, 'click');
                e.click();
                expect(ms.currentSlide).toEqual(testSlides[1]);
            });

            it("when applied through #bindPrevEvent, it changes current slide to the previous 'slide'", function(){
                ms.setSlide(0);
                ms.bindPrevEvent(e, 'click');
                e.click();
                expect(ms.currentSlide).toEqual(testSlides.splice(-1,1)[0]);
            });

        });

    });

});
