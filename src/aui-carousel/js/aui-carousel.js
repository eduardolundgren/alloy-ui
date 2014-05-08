/**
 * The Carousel Component
 *
 * @module aui-carousel
 */

var Lang = A.Lang,

    getCN = A.getClassName,

    CSS_ITEM = getCN('carousel', 'item'),
    CSS_ITEM_ACTIVE = getCN('carousel', 'item', 'active'),
    CSS_ITEM_TRANSITION = getCN('carousel', 'item', 'transition'),
    CSS_MENU_ACTIVE = getCN('carousel', 'menu', 'active'),
    CSS_MENU_INDEX = getCN('carousel', 'menu', 'index'),
    CSS_MENU_ITEM = getCN('carousel', 'menu', 'item'),
    CSS_MENU_NEXT = getCN('carousel', 'menu', 'next'),
    CSS_MENU_PLAY = getCN('carousel', 'menu', 'play'),
    CSS_MENU_PAUSE = getCN('carousel', 'menu', 'pause'),
    CSS_MENU_PREV = getCN('carousel', 'menu', 'prev'),
    CSS_MENU_ITEM_DEFAULT = [CSS_MENU_ITEM, CSS_MENU_INDEX].join(' '),
    CSS_MENU_ITEM_ACTIVE = [CSS_MENU_ITEM, CSS_MENU_INDEX, CSS_MENU_ACTIVE].join(' '),

    SELECTOR_MENU_INDEX = '.' + CSS_MENU_INDEX,
    SELECTOR_MENU_PAUSE = '.' + CSS_MENU_PAUSE,
    SELECTOR_MENU_PLAY = '.' + CSS_MENU_PLAY,
    SELECTOR_MENU_PLAY_OR_PAUSE = [SELECTOR_MENU_PLAY, SELECTOR_MENU_PAUSE].join(),

    TPL_ITEM = '<li><a class="' + CSS_MENU_ITEM + ' {cssClasses}">{index}</a></li>',

    TPL_MENU = '<menu>' +
        '<li><a class="' + CSS_MENU_ITEM + ' ' + CSS_MENU_PLAY + '"></a></li>' +
        '<li><a class="' + CSS_MENU_ITEM + ' ' + CSS_MENU_PREV + '"></a></li>' +
        '{items}' +
        '<li><a class="' + CSS_MENU_ITEM + ' ' + CSS_MENU_NEXT + '"></a></li>' +
        '</menu>',

    UI_SRC = A.Widget.UI_SRC,

    MAP_EVENT_INFO = {
        src: UI_SRC
    };

/**
 * A base class for Carousel.
 *
 * Check the [live demo](http://alloyui.com/examples/carousel/).
 *
 * @class A.Carousel
 * @extends A.Component
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 * @include http://alloyui.com/examples/carousel/basic-markup.html
 * @include http://alloyui.com/examples/carousel/basic.js
 */
var Carousel = A.Component.create({
    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: 'carousel',

    /**
     * Static property used to define the default attribute
     * configuration for the `A.Carousel`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Index of the first visible item of the carousel.
         *
         * @attribute activeIndex
         * @default 0
         * @type Number
         */
        activeIndex: {
            value: 0,
            setter: '_setActiveIndex'
        },

        /**
         * Duration of the animation in seconds when change index on
         * `A.Carousel`.
         *
         * @attribute animationTime
         * @default 0.5
         * @type Number
         */
        animationTime: {
            value: 0.5
        },

        /**
         * Height of the images being used in the carousel.
         *
         * @attribute imageHeight
         * @default 200
         * @type Number
         */
        imageHeight: {
            value: 200
        },

        /**
         * Width of the images being used in the carousel.
         *
         * @attribute imageWidth
         * @default 600
         * @type Number
         */
        imageWidth: {
            value: 600
        },

        /**
         * Interval time in seconds between an item transition.
         *
         * @attribute intervalTime
         * @default 2
         * @type Number
         */
        intervalTime: {
            value: 2
        },

        /**
         * CSS Selector whitch determines the items to be loaded to the
         * `A.Carousel`.
         *
         * @attribute itemSelector
         * @default >* (All first childs)
         * @type String
         */
        itemSelector: {
            value: '>*'
        },

        /**
         * Node container of the navigation items.
         *
         * @attribute nodeMenu
         * @default null
         * @type Node | String
         */
        nodeMenu: {
            value: null,
            setter: '_setNodeMenu'
        },

        /**
         * CSS selector to match the navigation items.
         *
         * @attribute nodeMenuItemSelector
         * @default .carousel-menu-item
         * @type String
         */
        nodeMenuItemSelector: {
            value: '.' + CSS_MENU_ITEM
        },

        /**
         * Determines if `A.Carousel` will pause on mouse enter or play when
         * mouse leave.
         *
         * @attribute pauseOnHover
         * @type Boolean
         */
        pauseOnHover: {
            value: false,
            validator: Lang.isBoolean
        },

        /**
         * Attributes that determines the status of transitions between
         * items.
         *
         * @attribute playing
         * @default true
         * @type Boolean
         */
        playing: {
            value: true
        }
    },

    UI_ATTRS: ['pauseOnHover'],

    prototype: {
        animation: null,
        nodeSelection: null,
        nodeMenu: null,
        hoverEventHandles: null,

        /**
         * Construction logic executed during `A.Carousel` instantiation.
         * Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this;

            instance.animation = new A.Anim({
                duration: instance.get('animationTime'),
                to: {
                    opacity: 1
                }
            });
        },

        /**
         * Destructor lifecycle implementation.
         *
         * @method destructor
         * @protected
         */
        destructor: function() {
            this._detachResponsiveEvents();
        },

        /**
         * Render the `A.Carousel` component instance. Lifecycle.
         *
         * @method renderUI
         * @protected
         */
        renderUI: function() {
            var instance = this;

            instance._updateNodeSelection();
            instance.nodeMenu = instance.get('nodeMenu');

            instance._updateMenuNodes();
        },

        /**
         * Bind the events on the `A.Carousel` UI. Lifecycle.
         *
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            var instance = this;

            instance.after({
                activeIndexChange: instance._afterActiveIndexChange,
                animationTimeChange: instance._afterAnimationTimeChange,
                intervalTimeChange: instance._afterIntervalTimeChange,
                itemSelectorChange: instance._afterItemSelectorChange,
                nodeMenuItemSelectorChange: instance._afterNodeMenuItemSelectorChange,
                playingChange: instance._afterPlayingChange
            });

            instance._bindMenu();

            if (instance.get('playing') === true) {
                instance._afterPlayingChange({
                    prevVal: false,
                    newVal: true
                });
            }
        },

        /**
         * Sync the `A.Carousel` UI. Lifecycle.
         *
         * @method syncUI
         * @protected
         */
        syncUI: function() {
            var instance = this;

            instance._uiSetActiveIndex(instance.get('activeIndex'));
        },

        /**
         * Set the `activeIndex` attribute which
         * activates a certain item on `A.Carousel` based on its index.
         *
         * @method item
         * @param val
         */
        item: function(val) {
            var instance = this;

            instance.set('activeIndex', val);
        },

        /**
         * Go to the next index.
         *
         * @method next
         */
        next: function() {
            var instance = this;

            instance._updateIndexNext();
        },

        /**
         * Set the `playing` attribute
         * to false which pauses the animation.
         *
         * @method pause
         */
        pause: function() {
            var instance = this;

            instance.set('playing', false);
        },

        /**
         * Set the `playing` attribute
         * to true which starts the animation.
         *
         * @method play
         */
        play: function() {
            var instance = this;

            instance.set('playing', true);
        },

        /**
         * Go to previous index.
         *
         * @method prev
         */
        prev: function() {
            var instance = this;

            instance._updateIndexPrev();
        },

        /**
         * Fire after `activeIndex` attribute changes.
         *
         * @method _afterActiveIndexChange
         * @param event
         * @protected
         */
        _afterActiveIndexChange: function(event) {
            var instance = this;

            instance._uiSetActiveIndex(
                event.newVal, {
                    prevVal: event.prevVal,
                    animate: instance.get('playing'),
                    src: event.src
                }
            );
        },

        /**
         * Fire after `animationTime` attribute changes.
         *
         * @method _afterAnimationTimeChange
         * @param event
         * @protected
         */
        _afterAnimationTimeChange: function(event) {
            var instance = this;

            instance.animation.set('duration', event.newVal);
        },

        /**
         * Fire after `itemSelector` attribute change.
         *
         * @method _afterItemSelectorChange
         * @param event
         * @protected
         */
        _afterItemSelectorChange: function() {
            var instance = this;

            instance._updateNodeSelection();
            instance._updateImagesResponsiveness();
        },

        /**
         * Fire after `nodeMenuItemSelector` attribute change.
         *
         * @method _afterNodeMenuItemSelectorChange
         * @param event
         * @protected
         */
        _afterNodeMenuItemSelectorChange: function(event) {
            var instance = this;

            instance.nodeMenuItemSelector = event.newVal;

            instance._updateMenuNodes();

            instance._bindMenu();
        },

        /**
         * Fire after `intervalTime` attribute changes.
         *
         * @method _afterIntervalTimeChange
         * @param event
         * @protected
         */
        _afterIntervalTimeChange: function() {
            var instance = this;

            instance._clearIntervalRotationTask();
            instance._createIntervalRotationTask();
        },

        /**
         * Fire after `playing` attribute changes.
         *
         * @method _afterPlayingChange
         * @param event
         * @protected
         */
        _afterPlayingChange: function(event) {
            var instance = this;

            var menuPlayItem = instance.nodeMenu.one(SELECTOR_MENU_PLAY_OR_PAUSE);
            var playing = event.newVal;

            var fromClass = CSS_MENU_PAUSE;
            var toClass = CSS_MENU_PLAY;

            var rotationTaskMethod = '_clearIntervalRotationTask';

            if (playing) {
                fromClass = CSS_MENU_PLAY;
                toClass = CSS_MENU_PAUSE;

                rotationTaskMethod = '_createIntervalRotationTask';
            }

            instance[rotationTaskMethod]();

            if (menuPlayItem) {
                menuPlayItem.replaceClass(fromClass, toClass);
            }
        },

        /**
         * Attach delegate to the carousel menu.
         *
         * @method _bindMenu
         * @protected
         */
        _bindMenu: function() {
            var instance = this;

            var menu = instance.nodeMenu;

            var nodeMenuItemSelector = instance.get('nodeMenuItemSelector');

            if (instance._menuClickDelegateHandler) {
                instance._menuClickDelegateHandler.detach();
            }
            instance._menuClickDelegateHandler = menu.delegate(
                'click',
                instance._onClickDelegate,
                nodeMenuItemSelector,
                instance
            );

            instance.nodeMenuItemSelector = nodeMenuItemSelector;
        },

        /**
         * Clear the rotation task interval.
         *
         * @method _clearIntervalRotationTask
         * @protected
         */
        _clearIntervalRotationTask: function() {
            var instance = this;

            clearInterval(instance._intervalRotationTask);
        },

        /**
         * Create an random number to be current index.
         *
         * @method _createIndexRandom
         * @protected
         */
        _createIndexRandom: function() {
            var instance = this;

            return Math.ceil(Math.random() * instance.nodeSelection.size()) - 1;
        },

        /**
         * Create an timer for the rotation task.
         *
         * @method _createIntervalRotationTask
         * @protected
         */
        _createIntervalRotationTask: function() {
            var instance = this;

            instance._clearIntervalRotationTask();

            instance._intervalRotationTask = setInterval(
                function() {
                    instance._updateIndexNext({
                        animate: true
                    });
                },
                instance.get('intervalTime') * 1000
            );
        },

        /**
         * Detaches all events related to responsiveness.
         *
         * @method _detachResponsiveEvents
         * @protected
         */
        _detachResponsiveEvents: function() {
            if (this._responsiveHandles) {
                (new A.EventHandle(this._responsiveHandles)).detach();
            }
        },

        /**
         * Checks if the mouse is inside the menu region.
         *
         * @method  _isMouseInsideMenu
         * @param  {EventFacade} event
         * @return {Boolean}
         */
        _isMouseInsideMenu: function(event) {
            var region = this.get('nodeMenu').get('region');
            return (region.left > event.clientX || event.clientX > region.right ||
                region.top > event.clientY || event.clientY > region.bottom);
        },

        /**
         * Checks if the carousel is responsive.
         *
         * @method _isResponsive
         * @protected
         */
        _isResponsive: function() {
            return !this.get('width');
        },

        /**
         * Fire when animation ends.
         *
         * @method _onAnimationEnd
         * @param event
         * @param newImage
         * @param oldImage
         * @param newMenuItem
         * @param oldMenuItem
         * @protected
         */
        _onAnimationEnd: function(event, newImage, oldImage) {
            if (oldImage) {
                oldImage.removeClass(CSS_ITEM_TRANSITION);
            }

            newImage.setStyle('opacity', '1');
        },

        /**
         * Fire when animation starts.
         *
         * @method _onAnimationStart
         * @param event
         * @param newImage
         * @param oldImage
         * @param newMenuItem
         * @param oldMenuItem
         * @protected
         */
        _onAnimationStart: function(event, newImage, oldImage, newMenuItem, oldMenuItem) {
            newImage.addClass(CSS_ITEM_ACTIVE);

            if (newMenuItem) {
                newMenuItem.addClass(CSS_MENU_ACTIVE);
            }

            if (oldImage) {
                oldImage.replaceClass(CSS_ITEM_ACTIVE, CSS_ITEM_TRANSITION);
            }

            if (oldMenuItem) {
                oldMenuItem.removeClass(CSS_MENU_ACTIVE);
            }
        },

        /**
         * Fired when the mouse enters the carousel. If it has also entered the
         * menu the slideshow will be resumed.
         *
         * @method _onCarouselEnter
         * @param {EventFacade} event
         * @protected
         */
        _onCarouselEnter: function(event) {
            if (this._isMouseInsideMenu(event)) {
                this._pauseOnEnter();
            }
        },

        /**
         * Fired when the mouse leaves the carousel, which will resume the slideshow.
         *
         * @method _onCarouselLeave
         * @protected
         */
        _onCarouselLeave: function() {
            this._playOnLeave();
        },

        /**
         * Fire when a click is fired on menu.
         *
         * @method _onClickDelegate
         * @param event
         * @protected
         */
        _onClickDelegate: function(event) {
            var instance = this;

            event.preventDefault();

            var currentTarget = event.currentTarget;

            var handler;

            if (currentTarget.hasClass(CSS_MENU_INDEX)) {
                handler = instance._onMenuItemClick;
            }
            else if (currentTarget.hasClass(CSS_MENU_PREV)) {
                handler = instance._updateIndexPrev;
            }
            else if (currentTarget.hasClass(CSS_MENU_NEXT)) {
                handler = instance._updateIndexNext;
            }
            else if (currentTarget.test(SELECTOR_MENU_PLAY_OR_PAUSE)) {
                handler = instance._onMenuPlayClick;
            }

            if (handler) {
                handler.apply(instance, arguments);
            }
        },

        /**
         * Fired when the mouse enters the menu. If it's coming from the carousel
         * the slideshow will be resumed.
         *
         * @method _onMenuEnter
         * @param {EventFacade} event
         * @protected
         */
        _onMenuEnter: function(event) {
            if (event.relatedTarget && event.relatedTarget.hasClass(CSS_ITEM)) {
                this._playOnLeave();
            }
        },

        /**
         * Execute when delegates handle menuItem click.
         *
         * @method _onMenuItemClick
         * @param event
         * @protected
         */
        _onMenuItemClick: function(event) {
            var instance = this;

            event.preventDefault();

            var newIndex = instance.menuNodes.indexOf(event.currentTarget);

            instance.set('activeIndex', newIndex, MAP_EVENT_INFO);
        },

        /**
         * Fired when the mouse leaves the menu. If it's going to the carousel
         * the slideshow will be paused.
         *
         * @method _onMenuLeave
         * @param {EventFacade} event
         * @protected
         */
        _onMenuLeave: function(event) {
            if (event.relatedTarget && event.relatedTarget.hasClass(CSS_ITEM)) {
                this._pauseOnEnter();
            }
        },

        /**
         * Execute when delegates handle play click.
         *
         * @method _onMenuPlayClick
         * @param event
         * @protected
         */
        _onMenuPlayClick: function() {
            this.set('playing', !this.get('playing'));
        },

        /**
         * Called when the mouse enters the carousel with pauseOnHover set to
         * true. Pauses the slideshow unless it was already paused.
         *
         * @method _pauseOnEnter
         * @protected
         */
        _pauseOnEnter: function() {
            if (this.get('playing')) {
                this.pause();
                this._pausedOnEnter = true;
            }
        },

        /**
         * Called when the mouse leaves the carousel with pauseOnHover set to
         * true. If the slideshow was paused due to entering the carousel before,
         * this will resume it.
         *
         * @method _playOnLeave
         * @protected
         */
        _playOnLeave: function() {
            if (this._pausedOnEnter) {
                this.play();
                this._pausedOnEnter = false;
            }
        },

        /**
         * Render the menu in DOM.
         *
         * @method _renderMenu
         * @protected
         */
        _renderMenu: function() {
            var instance = this,
                activeIndex = instance.get('activeIndex'),
                items = [],
                i,
                len = instance.nodeSelection.size();

            for (i = 0; i < len; i++) {
                items.push(
                    Lang.sub(TPL_ITEM, {
                        cssClasses: activeIndex === i ? CSS_MENU_ITEM_ACTIVE : CSS_MENU_ITEM_DEFAULT,
                        index: i
                    })
                );
            }

            var menu = A.Node.create(Lang.sub(TPL_MENU, {
                items: items.join(' ')
            }));

            instance.get('contentBox').appendChild(menu);

            return menu;
        },

        /**
         * Set the `activeIndex` attribute.
         *
         * @method _setActiveIndex
         * @param val
         * @protected
         */
        _setActiveIndex: function(val) {
            var instance = this;

            if (val === 'rand') {
                val = instance._createIndexRandom();
            }
            else {
                val = Math.max(Math.min(val, instance.nodeSelection.size()), -1);
            }

            return val;
        },

        /**
         * Set the `nodeMenu` attribute.
         *
         * @method _setNodeMenu
         * @param val
         * @protected
         */
        _setNodeMenu: function(val) {
            var instance = this;

            return A.one(val) || instance._renderMenu();
        },

        /**
         * Set the `activeIndex` on the UI.
         *
         * @method _uiSetActiveIndex
         * @param newVal
         * @param objOptions
         * @protected
         */
        _uiSetActiveIndex: function(newVal, objOptions) {
            var instance = this;

            var oldImage = null;
            var oldMenuItem = null;
            var onStart = null;
            var onEnd = null;

            var newImage = instance.nodeSelection.item(newVal);

            var menuNodes = instance.menuNodes;

            var newMenuItem = menuNodes.item(newVal);

            instance.animation.set('node', newImage);

            if (objOptions && !Lang.isUndefined(objOptions.prevVal)) {
                var prevVal = objOptions.prevVal;

                newImage.setStyle('opacity', '0');

                oldMenuItem = menuNodes.item(prevVal);
                oldImage = instance.nodeSelection.item(prevVal);

                oldImage.replaceClass(CSS_ITEM_ACTIVE, CSS_ITEM_TRANSITION);

                instance.animation.stop();
            }
            else {
                newImage.addClass(CSS_ITEM_ACTIVE);

                newImage.setStyle('opacity', '1');
            }

            onStart = instance.animation.on(
                'start',
                function(event) {
                    instance._onAnimationStart(event, newImage, oldImage, newMenuItem, oldMenuItem);

                    onStart.detach();
                }
            );

            onEnd = instance.animation.on(
                'end',
                function(event) {
                    instance._onAnimationEnd(event, newImage, oldImage, newMenuItem, oldMenuItem);

                    onEnd.detach();
                }
            );

            if (objOptions) {
                if (objOptions.animate) {
                    instance.animation.run();
                }
                else {
                    instance.animation.fire('start');
                    instance.animation.fire('end');
                }

                if (objOptions.src === UI_SRC && objOptions.animate) {
                    instance._createIntervalRotationTask();
                }
            }
        },

        /**
         * Sets the height on the widget's bounding box element
         *
         * @method _uiSetHeight
         * @protected
         * @param {String | Number} val
         */
        _uiSetHeight: function(val) {
            A.Carousel.superclass._uiSetHeight.call(this, val);

            this._updateHeight();
        },

        /**
         * Sets `pauseOnHover` on the UI.
         *
         * @method _uiSetPauseOnHover
         * @param {Boolean} val The value of the property.
         * @protected
         */
        _uiSetPauseOnHover: function(val) {
            var boundingBox = this.get('boundingBox'),
                nodeMenu = this.get('nodeMenu');

            if (val) {
                this.hoverEventHandles = [
                    boundingBox.on('mouseenter', A.bind(this._onCarouselEnter, this)),
                    boundingBox.on('mouseleave', A.bind(this._onCarouselLeave, this)),
                    nodeMenu.on('mouseenter', A.bind(this._onMenuEnter, this)),
                    nodeMenu.on('mouseleave', A.bind(this._onMenuLeave, this))
                ];
            }
            else {
                (new A.EventHandle(this.hoverEventHandles)).detach();
                this.hoverEventHandles = null;
            }
        },

        /**
         * Sets the width on the widget's bounding box element
         *
         * @method _uiSetWidth
         * @protected
         * @param {String | Number} val
         */
        _uiSetWidth: function(val) {
            A.Carousel.superclass._uiSetWidth.call(this, val);

            if (val) {
                this._detachResponsiveEvents();

                this.get('boundingBox').removeClass('row');

                this.get('boundingBox').setStyle('width', this.get('width'));
                this.get('boundingBox').setStyle('height', this.get('height'));
            }
            else {
                if (!this._responsiveHandles) {
                    this._responsiveHandles = [
                        A.on('windowresize', A.bind(this._updateHeight, this)),
                        this.after('imageWidthChange', this._updateHeight),
                        this.after('imageHeightChange', this._updateHeight)
                    ];
                }

                this.get('boundingBox').addClass('row');

                this.get('boundingBox').setStyle('width', '');
                this.get('boundingBox').setStyle('height', '');
            }

            this._updateImagesResponsiveness();
            this._updateHeight();
        },

        /**
         * Updates the carousel's image nodes to be responsive or not, depending
         * on the current configuration.
         *
         * @method _updateImagesResponsiveness
         * @protected
         */
        _updateImagesResponsiveness: function() {
            var style;

            if (this._isResponsive()) {
                this.nodeSelection.addClass('col-xs-12');

                this.nodeSelection.each(function(image) {
                    style = {
                        height: image.getStyle('height'),
                        width: image.getStyle('width')
                    };

                    image.setStyle('height', 'inherit');
                    image.setStyle('width', '');

                    if (image.getStyle('backgroundImage') !== 'none') {
                        A.mix(style, {
                            'backgroundRepeat': image.getStyle('backgroundRepeat'),
                            'backgroundSize': image.getStyle('backgroundSize')
                        });

                        image.setStyle('backgroundRepeat', 'no-repeat');
                        image.setStyle('backgroundSize', 'contain');
                    }

                    if (!image.getData('unresponsiveStyle')) {
                        image.setData('unresponsiveStyle', style);
                    }
                });
            }
            else {
                this.nodeSelection.removeClass('col-xs-12');

                this.nodeSelection.each(function(image) {
                    if (image.getData('unresponsiveStyle')) {
                        image.setStyles(image.getData('unresponsiveStyle'));
                    }
                });
            }
        },

        /**
         * Set the `activeIndex` to the next index.
         *
         * @method _updateIndexNext
         * @param options
         * @protected
         */
        _updateIndexNext: function(options) {
            var instance = this;

            var currentIndex = instance.get('activeIndex');
            var nodeSelectionSize = instance.nodeSelection.size();

            var newIndex = currentIndex + 1;

            if (newIndex > (nodeSelectionSize - 1)) {
                newIndex = 0;
            }

            if (options) {
                options.src = UI_SRC;
            }

            instance.set('activeIndex', newIndex, options);
        },

        /**
         * Set the `activeIndex` to the previous index.
         *
         * @method _updateIndexPrev
         * @param options
         * @protected
         */
        _updateIndexPrev: function(options) {
            var instance = this;

            var currentIndex = instance.get('activeIndex');

            var newIndex = currentIndex - 1;

            if (newIndex < 0) {
                newIndex = instance.nodeSelection.size() - 1;
            }

            if (options) {
                options.src = UI_SRC;
            }

            instance.set('activeIndex', newIndex, options);
        },

        /**
         * Set the `menuNodes` attribute based on the selector menu index.
         *
         * @method _updateMenuNodes
         * @param options
         * @protected
         */
        _updateMenuNodes: function() {
            var instance = this;

            instance.nodeMenu = instance.get('nodeMenu');
            instance.menuNodes = instance.nodeMenu.all(SELECTOR_MENU_INDEX);
        },

        /**
         * Update the `nodeSelection` by adding the CSS_ITEM class.
         *
         * @method _updateMenuNodes
         * @param options
         * @protected
         */
        _updateNodeSelection: function() {
            var instance = this,
                itemSelector = instance.get('itemSelector'),
                nodeSelection = instance.get('contentBox').all(itemSelector);

            nodeSelection.addClass(CSS_ITEM);

            instance.nodeSelection = nodeSelection;
        },

        /**
         * Scales the carousel to fit on the screen, based on the current image's
         * original size. If the carousel's width was set to a fixed value this
         * function won't do anything though.
         *
         * @method _updateHeight
         * @protected
         */
        _updateHeight: function() {
            var boundingBox = this.get('boundingBox'),
                boundingBoxWidth = parseInt(boundingBox.getComputedStyle('width'), 10),
                height,
                width;

            if (!this._isResponsive()) {
                return;
            }

            width = this.get('imageWidth');
            height = this.get('height') ? this.get('height') : this.get('imageHeight');
            boundingBox.setStyle('height', ((height * boundingBoxWidth) / width) + 'px');
        },

        _intervalRotationTask: null
    }
});

A.Carousel = Carousel;
