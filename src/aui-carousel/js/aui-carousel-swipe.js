/**
 * The Carousel funcionality of swiping to go to the previous/next image.
 * Will be mixed into the Carousel automatically when loaded.
 *
 * @module aui-carousel-swipe
 */

var CSS_CAROUSEL_SWIPE = A.getClassName('carousel', 'swipe');

function CarouselSwipe() {}

CarouselSwipe.prototype = {
    /**
     * Construction logic executed during instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        this.onceAfter('render', this._uiSetSwipe);
        this.after('swipeChange', this._uiSetSwipe);
    },

    /**
     * Destructor lifecycle implementation.
     *
     * @method destructor
     * @protected
     */
    destructor: function() {
        if (this._scrollView) {
            this._scrollView.destroy();

            this._detachSwipeEvents();
        }
    },

    /**
     * Fired after the scroll view's `index` attribute changes.
     * Updates the carousel to reflect the swipe.
     *
     * @method _afterIndexChange
     * @param {EventFacade} event
     * @protected
     */
    _afterIndexChange: function(event) {
        this.set('activeIndex', event.newVal);

        if (this.get('playing')) {
            this._createIntervalRotationTask();
        }
    },

    /**
     * Attaches all events related to the swipe functionality.
     *
     * @method _attachSwipeEvents
     * @protected
     */
    _attachSwipeEvents: function() {
        this._eventHandles = [
            this._scrollView.pages.after('indexChange', A.bind(this._afterIndexChange, this)),
            this.on('showImage', this._onShowImage)
        ];
    },

    /**
     * Detaches all events related to the swipe functionality.
     *
     * @method _unbindSwipeEvents
     * @protected
     */
    _detachSwipeEvents: function() {
        (new A.EventHandle(this._eventHandles)).detach();
    },

    /**
     * Disables the swipe funcionality in the carousel.
     *
     * @method _disableScrollView
     * @protected
     */
    _disableScrollView: function() {
        if (this._scrollView) {
            this._scrollView.set('disabled', true);

            this.get('boundingBox').removeClass(CSS_CAROUSEL_SWIPE);

            this._detachSwipeEvents();
        }
    },

    /**
     * Enables the swipe funcionality in the carousel.
     *
     * @method _enableScrollView
     * @protected
     */
    _enableScrollView: function() {
        this.get('boundingBox').addClass(CSS_CAROUSEL_SWIPE);

        if (this._scrollView) {
            this._scrollView.set('disabled', false);
            this._attachSwipeEvents();
            return;
        }

        this._scrollView = new A.ScrollView({
            axis: 'x',
            contentBox: this.get('contentBox'),
            flick: {
                minDistance: 10,
                minVelocity: 0.3,
                axis: 'x'
            }
        });
        this._scrollView.plug(A.Plugin.ScrollViewPaginator, {
            index: this.get('activeIndex'),
            selector: this.get('itemSelector')
        });
        this._scrollView.render();

        this._attachSwipeEvents();
    },

    /**
     * Fired on the `showImage` event. This makes the view scroll to
     * the new image before the original logic for showing it happens.
     *
     * @method _onShowImage
     * @param {EventFacade} event
     * @protected
     */
    _onShowImage: function(event) {
        var activeIndex = this.get('activeIndex');

        if (this._scrollView && this._scrollView.pages.get('index') !== activeIndex) {
            this._scrollView.pages.scrollToIndex(
                activeIndex,
                0 // Zero duration, we'll use the original animation.
            );
        }
        else {
            // If the scroll view is already at the new index, then it was already
            // scrolled there, so we don't want the carousel to animate it.
            event.preventDefault();
        }
    },

    /**
     * Updates the UI according to the current value of `swipe`.
     *
     * @method _uiSetSwipe
     * @protected
     */
    _uiSetSwipe: function() {
        if (this.get('swipe')) {
            this._enableScrollView();
        }
        else {
            this._disableScrollView();
        }
    }
};

CarouselSwipe.ATTRS = {

    /**
     * Turns the swipe interaction on/off.
     *
     * @attribute swipe
     * @default true
     * @type Boolean
     */
    swipe: {
        value: true
    }
};

A.Base.mix(A.Carousel, [CarouselSwipe]);
