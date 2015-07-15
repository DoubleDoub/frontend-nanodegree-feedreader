/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
         it('all feeds have an url property that is longer than an empty string', function() {
            for (var i = allFeeds.length - 1; i >= 0; i--) {
                expect(typeof allFeeds[i].url).toBe('string');
                expect(allFeeds[i].url).toBeDefined();
                expect(allFeeds[i].url.length).toBeGreaterThan(0);
            }
         });

        /* Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('all feeds have a name property that is longer than an empty string', function() {
            for (var i = allFeeds.length - 1; i >= 0; i--) {
                expect(typeof allFeeds[i].name).toBe('string');
                expect(allFeeds[i].name).toBeDefined();
                expect(allFeeds[i].name.length).toBeGreaterThan(0);
            }
        });

    });


    /* Write a new test suite named "The menu" */
    describe('The menu', function() {

        /* Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it('body element should have a class of menu-hidden by default', function() {
            expect($('body')[0].classList.contains('menu-hidden')).toEqual(true);
        });

        // test to ensure that the menu is truly hidden off the canvas
        // @reviewer Additional test.
        it('should be offcanvas by default', function() {
            var left = Math.ceil($(".menu").position().left);
            var width = parseInt('-' + String($(".menu").width()));
            // transform translate on x axis should cover its width
            expect(left).toBeLessThan(width);
        });

         /* Write a test that ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * should have two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */
        it('should be visible and toggle back into hiding when clicked', function(done) {
            //show menu by triggering click event on the element that is being listened too, to toggle the menu
            $('.menu-icon-link').click();
            var width = parseInt('-' + String($(".menu").width()));
            // async because menu is being animated and it takes time to reflect in the dom
            setTimeout(function(){
                //check elements postion
                var left = Math.ceil($(".menu").position().left);
                expect(left).toEqual(0);
                // check presence of css class
                expect($('body')[0].classList.contains('menu-hidden')).toEqual(false);

                // hide the menu again
                $('.menu-icon-link').click();
                // test if menu is offcanvas again
                setTimeout(function(){
                    // check if position has been translated enough to cover its width
                    var left = Math.ceil($(".menu").position().left);
                    expect(left).toBeLessThan(width);
                    // check for presence of css class 
                    expect($('body')[0].classList.contains('menu-hidden')).toEqual(true);
                    // now we are done
                    done();
                },500);
            },500);
        });
    });

    /* Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function() {

        /* Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test wil require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        var callback;
        
        beforeEach(function(done) {
            // create callback function
            // we need a reference to check if loadFeed has been called with it
            callback = (function (done) {
                return function(){
                    done();
                };
            })(done);

            spyOn(window, 'loadFeed').and.callThrough();

            loadFeed(0, callback);
        });

        it('should at least contain one entry after loadFeed has been called', function(done){
            // check if loadFeed has been called (@reviewer a little overkill for learning purposes)
            expect(window.loadFeed).toHaveBeenCalledWith(0, callback);
            expect($('.feed').length).toBeGreaterThan(0);
            // check for entry
            console.log(typeof $('.feed').find('.entry'));
            console.log([] instanceof Array);

            expect($('.feed').find('.entry').length).toBeGreaterThan(0);
            done();
        });
    });

    /*  Write a new test suite named "New Feed Selection" */
    describe('New Feed Selection', function() {
        /* Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        var oldInnerHtml,
            newInnerHtml;

        beforeEach(function(done){
            loadFeed(0, function() {
                //get html of the first feed entry before fetching new content
                oldInnerHtml = $('.feed').children('a')[0].innerHTML;
                loadFeed(1, function() {
                    //get html after loading new feed content
                    newInnerHtml = $('.feed').children('a')[0].innerHTML;
                    done();
                });
            });
        });

        //cleanup after ourselfes
        afterEach(function() {
            oldInnerHtml = null;
            newInnerHtml = null;
        });

        it('should not have the same content', function(done){
            // there should be at least one entry
            expect($('.feed').length).toBeGreaterThan(0);
            // compare the different html
            expect(newInnerHtml).not.toEqual(oldInnerHtml);
            done();
        });
    });

    /* Additional test for future functionality */
    describe('Add feed feature', function(){
        
        it('button should display an input field for users to provide an url to a new rss feed ', function(){
            $('.add-feed-button').click();
            //need an inputfield
            expect($('.custom-feed-input').length).toBeGreaterThan(0);

            //need to have a sumbit button
            expect($('.submit-feed-button').length).toBeGreaterThan(0);
        });

        it('input field should add feed item to feed list in the menu', function(){
            var oldLength = allFeeds.length;

            $('.submit-feed-button').click();
            // should contain more items then before
            expect(allFeeds.length).toBeGreaterThan(oldLength);

            // jquery object should contain as much items as allFeeds array does
            expect($('.feedList').length).toEqual(allFeeds.length);

            // id property should have been set on the new object in the array
            expect(allFeeds[allFeeds.length-1].id).toEqual($('.feedList').length-1);

            //should have at least one item with this class
            expect($('.custom-feed-list-item').length).toBeGreaterThan(0);
        });

        it('clicking the newly added feed in the menu should show new content', function(){
            spyOn(window, 'loadFeed').and.callThrough();

            $('.custom-feed-list-item')[0].click();
            // clicking the new feed must call loadFeed
            expect(window.loadFeed).toHaveBeenCalledWith(allFeeds.length-1);
            // loadFeed has been tested so it should be ok
        });
    });

}());
