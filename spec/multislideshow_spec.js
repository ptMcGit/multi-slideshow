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
    ]

    describe("initialization", function(){

        it("raises an exception unless initialization parameter is an array", function(){
            expect(function(){ new MultiSlideshow('string') })
                .toThrowError(TypeError);
        });

        it("raises an exception with no parameters", function(){
            expect(function(){ new MultiSlideshow() })
                .toThrowError();
        });


    });


    describe("post-initialization", function(){

        beforeEach(function(){
            this.ms = new MultiSlideshow(testSlides);
            this.e = new MockElement();
        });

        describe("#bindElement", function(){

            it("is used to make a property of a slide assignable to a property of an element", function(){
                this.ms.bindElement(
                    [this.e],
                    'mockDesc',
                    'desc'
                );

                this.ms.setSlide(1);
                expect(this.e.mockDesc).toEqual('desc2');
            });

            it("is used to make a property of a slide assignable to a property of multiple elements", function(){
                this.f = new MockElement();
                this.ms.bindElement(
                    [this.e, this.f],
                    'mockDesc',
                    'desc'
                );

                this.ms.setSlide(1);
                expect(this.e.mockDesc).toEqual('desc2');
                expect(this.f.mockDesc).toEqual('desc2');
            });

        });

        describe("#setSlide", function(){

            it("changes the prototype of it's instance by index i.e. changes the slide", function(){
                this.ms.setSlide(0);
                expect(Object.getPrototypeOf(this.ms)).toEqual(testSlides[0]);
                this.ms.setSlide(2);
                expect(Object.getPrototypeOf(this.ms)).toEqual(testSlides[2]);
            });

        });

        describe("bound next event", function(){

            it("changes the prototype of the instance to the next 'slide'", function(){
                var p1 = Object.getPrototypeOf(this.ms)
                this.ms.bindNextEvent(this.e, 'click')
                this.e.click()
                expect(Object.getPrototypeOf(this.ms)).toEqual(testSlides[1]);
            });

        });

        describe("bound previous event", function(){

            it("changes the prototype of the instance to the previous 'slide'", function(){
                var p1 = Object.getPrototypeOf(this.ms)
                this.ms.bindPrevEvent(this.e, 'click')
                this.e.click()
                expect(Object.getPrototypeOf(this.ms)).toEqual(testSlides.splice(-1,1)[0])
            });

        });

    });

});
