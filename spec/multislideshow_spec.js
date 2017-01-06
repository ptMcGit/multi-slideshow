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

    describe("post-initialization", function(){

        var ms, e;

        beforeEach(function(){
            ms = new MultiSlideshow(testSlides);
            e = new MockElement();
        });

        describe("#bindElement", function(){

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

            it("invokes addEventListener with the event", function(){
                spyOn(e,'addEventListener');
                ms.bindEvent(2, e, 'click');
                expect(e.addEventListener.calls.mostRecent().args[0]).toEqual('click');
            });

            it("modifies an 'event' method on the bound element", function(){
                var e1 = e.click;
                ms.bindEvent(2, e, 'click');
                expect(e1).not.toEqual(e.click);
            });

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
