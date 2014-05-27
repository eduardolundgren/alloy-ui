YUI.add('aui-carousel-swipe-tests', function(Y) {
    var suite = new Y.Test.Suite('aui-carousel-swipe');

    suite.add(new Y.Test.Case({
        name: 'AUI Carousel Swipe Unit Tests',

        init: function() {
            this._container = Y.one('#container');
        },

        tearDown: function() {
            if (this._carousel) {
                this._carousel.destroy();
            }
        },

        createCarousel: function(config) {
            var content = Y.Node.create('<div id="content"></div>'),
                images = Y.one('#images');

            content.setHTML(images.getHTML());
            this._container.append(content);

            config = Y.mix({
                contentBox: '#content',
                height: 300,
                intervalTime: 1,
                itemSelector: '> div,img',
                width: 940
            }, config || {});

            return new Y.Carousel(config).render();
        },

        'should enable the swipe functionality by default': function() {
            this._carousel = this.createCarousel();

            Y.Assert.isTrue(
                this._carousel.get('boundingBox').hasClass('carousel-swipe'),
                'The bounding box should have the swipe CSS class'
            );

            this._carousel._scrollView.pages.scrollToIndex(1, 0);

            Y.Assert.areEqual(
                1,
                this._carousel.get('activeIndex'),
                'The carousel\'s index should have been updated'
            );

            this._carousel.set('playing', false);
            this._carousel._scrollView.pages.scrollToIndex(2, 0);

            Y.Assert.areEqual(
                2,
                this._carousel.get('activeIndex'),
                'The carousel\'s index should have been updated'
            );
        },

        'should scroll to image when carousel index changes': function() {
            var mock = new Y.Mock();

            this._carousel = this.createCarousel();

            Y.Mock.expect(mock, {
                callCount: 1,
                method: 'animationStart',
                args: [Y.Mock.Value.Object]
            });
            this._carousel.animation.on('start', mock.animationStart);

            this._carousel.set('activeIndex', 1);

            Y.Assert.areEqual(
                1,
                this._carousel._scrollView.pages.get('index'),
                'The scroll view\'s index should have been updated'
            );
            Y.Mock.verify(mock);

            // Should not have run the animation in this case.
            Y.Mock.expect(mock, {
                callCount: 0,
                method: 'animationStart',
                args: [Y.Mock.Value.Object]
            });
            this._carousel._scrollView.pages.scrollToIndex(2, 0);
            Y.Mock.verify(mock);
        },

        'should enable/disable swipe funcionality dynamically': function() {
            this._carousel = this.createCarousel();

            this._carousel.set('swipe', false);

            Y.Assert.isFalse(
                this._carousel.get('boundingBox').hasClass('carousel-swipe'),
                'The bounding box should not have the swipe CSS class'
            );
            Y.Assert.isTrue(
                this._carousel._scrollView.get('disabled'),
                'Scroll view should be disabled'
            );

            this._carousel.set('swipe', true);

            Y.Assert.isTrue(
                this._carousel.get('boundingBox').hasClass('carousel-swipe'),
                'The bounding box should have the swipe CSS class'
            );
            Y.Assert.isFalse(
                this._carousel._scrollView.get('disabled'),
                'Scroll view should not be disabled'
            );
        },

        'should be able to start the carousel without swipe': function() {
            this._carousel = this.createCarousel({
                swipe: false
            });

            Y.Assert.isFalse(
                this._carousel.get('boundingBox').hasClass('carousel-swipe'),
                'The bounding box should not have the swipe CSS class'
            );
            Y.Assert.isUndefined(
                this._carousel._scrollView,
                'Scroll view should not be defined'
            );
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: ['aui-carousel-swipe', 'node-base', 'test']
});
