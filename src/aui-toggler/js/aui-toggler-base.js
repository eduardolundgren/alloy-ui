/**
 * The Toggler Component
 *
 * @module aui-toggler
 */

var Lang = A.Lang,
    isBoolean = Lang.isBoolean,
    isObject = Lang.isObject,
    isUndefined = Lang.isUndefined,

    toInt = Lang.toInt,

    DASH = '-',
    DOT = '.',
    EMPTY_STR = '',
    PIXEL = 'px',

    ANIMATED = 'animated',
    ANIMATING = 'animating',
    BIND_DOM_EVENTS = 'bindDOMEvents',
    CLICK = 'click',
    COLLAPSED = 'collapsed',
    CONTENT = 'content',
    CUBIC_BEZIER = 'cubic-bezier',
    DOWN = 'down',
    ENTER = 'enter',
    ESC = 'esc',
    EXPANDED = 'expanded',
    EXPANDED_CHANGE = 'expandedChange',
    GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',
    GUTTER = 'gutter',
    HEADER = 'header',
    HELPER = 'helper',
    KEYDOWN = 'keydown',
    LEFT = 'left',
    LINEAR = 'linear',
    MARGIN_TOP = 'marginTop',
    MINUS = 'minus',
    NUM_MINUS = 'num_minus',
    NUM_PLUS = 'num_plus',
    OFFSET_HEIGHT = 'offsetHeight',
    PARENT_NODE = 'parentNode',
    PLUS = 'plus',
    RIGHT = 'right',
    SPACE = 'space',
    TOGGLER = 'toggler',
    TRANSITION = 'transition',
    TRANSITION_END = 'transitionEnd',
    TRANSITION_START = 'transitionStart',
    UP = 'up',
    WRAPPER = 'wrapper',

    getCN = A.getClassName,

    CSS_TOGGLER_CONTENT = getCN(TOGGLER, CONTENT),
    CSS_TOGGLER_CONTENT_COLLAPSED = getCN(TOGGLER, CONTENT, COLLAPSED),
    CSS_TOGGLER_CONTENT_EXPANDED = getCN(TOGGLER, CONTENT, EXPANDED),
    CSS_TOGGLER_CONTENT_WRAPPER = getCN(TOGGLER, CONTENT, WRAPPER),
    CSS_TOGGLER_HEADER = getCN(TOGGLER, HEADER),
    CSS_TOGGLER_HEADER_COLLAPSED = getCN(TOGGLER, HEADER, COLLAPSED),
    CSS_TOGGLER_HEADER_EXPANDED = getCN(TOGGLER, HEADER, EXPANDED),

    CSS_TOGGLER_CONTENT_STATE = {
        'false': CSS_TOGGLER_CONTENT_COLLAPSED,
        'true': CSS_TOGGLER_CONTENT_EXPANDED
    },

    CSS_TOGGLER_HEADER_STATE = {
        'false': CSS_TOGGLER_HEADER_COLLAPSED,
        'true': CSS_TOGGLER_HEADER_EXPANDED
    },

    TPL_CONTENT_WRAPPER = '<div class="' + CSS_TOGGLER_CONTENT_WRAPPER + '"></div>';

/**
 * A base class for Toggler.
 *
 * Check the [live demo](http://alloyui.com/examples/toggler/).
 *
 * @class A.Toggler
 * @extends A.Base
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 */
var Toggler = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property Toggler.NAME
     * @type String
     * @static
     */
    NAME: TOGGLER,

    /**
     * Static property used to define the default attribute
     * configuration for the Toggler.
     *
     * @property Toggler.ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Determine if the Toggler transitions will animate.
         *
         * @attribute animated
         * @default false
         * @type Boolean
         * @writeOnce
         */
        animated: {
            validator: isBoolean,
            value: false,
            writeOnce: true
        },

        /**
         * Determine if the Toggler transitions are being animated in that moment.
         *
         * @attribute animating
         * @default false
         * @type Boolean
         */
        animating: {
            validator: isBoolean,
            value: false
        },

        /**
         * Determine if the Toggler should bind DOM events or not.
         *
         * @attribute bindDOMEvents
         * @default true
         * @type Boolean
         * @writeOnce
         */
        bindDOMEvents: {
            validator: isBoolean,
            value: true,
            writeOnce: true
        },

        /**
         * The content of a Toogler instance.
         *
         * @attribute content
         */
        content: {
            setter: A.one
        },

        /**
         * Determine if the content starts as toggled on/off on page load.
         *
         * @attribute expanded
         * @default true
         * @type Boolean
         */
        expanded: {
            validator: isBoolean,
            value: true
        },

        /**
         * The header of a Toogler instance.
         *
         * @attribute header
         */
        header: {
            setter: A.one
        },

        /**
         * Transition definitions such as duration and type of easing effect.
         *
         * @attribute transition
         * @type Object
         */
        transition: {
            validator: isObject,
            value: {
                duration: 0.4,
                easing: CUBIC_BEZIER
            }
        }

    },

    /**
     * Static property used to define which component it extends.
     *
     * @property Toggler.EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.Base,

    /**
     * Handle header events.
     *
     * @method headerEventHandler
     * @param event
     * @param instance
     */
    headerEventHandler: function(event, instance) {
        if (event.type === CLICK || event.isKey(ENTER) || event.isKey(SPACE)) {
            event.preventDefault();

            return instance.toggle();
        }
        else if (event.isKey(DOWN) || event.isKey(RIGHT) || event.isKey(NUM_PLUS)) {
            event.preventDefault();

            return instance.expand();
        }
        else if (event.isKey(UP) || event.isKey(LEFT) || event.isKey(ESC) || event.isKey(NUM_MINUS)) {
            event.preventDefault();

            return instance.collapse();
        }
    },

    prototype: {

        /**
         * Construction logic executed during Toggler instantiation. Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this;

            instance.bindUI();
            instance.syncUI();

            instance._uiSetExpanded(instance.get(EXPANDED));
        },

        /**
         * Bind the events on the Toggler UI. Lifecycle.
         *
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            var instance = this;
            var header = instance.get(HEADER);

            header.setData(TOGGLER, instance);

            instance.on(EXPANDED_CHANGE, A.bind(instance._onExpandedChange, instance));

            if (instance.get(BIND_DOM_EVENTS)) {
                header.on([CLICK, KEYDOWN], A.rbind(Toggler.headerEventHandler, null, instance));
            }
        },

        /**
         * Sync the events on the Toggler UI. Lifecycle.
         *
         * @method syncUI
         * @protected
         */
        syncUI: function() {
            var instance = this;

            instance.get(CONTENT).addClass(CSS_TOGGLER_CONTENT);
            instance.get(HEADER).addClass(CSS_TOGGLER_HEADER);
        },

        /**
         * Expand Toggler with an animation.
         *
         * @method animate
         * @param config
         * @param fn
         */
        animate: function(config, fn) {
            var instance = this;

            instance._uiSetExpanded(true);

            var transition = A.merge(config, instance.get(TRANSITION));

            instance.get(CONTENT).transition(transition, A.bind(fn, instance));
        },

        /**
         * Hide Toggler content.
         *
         * @method collapse
         */
        collapse: function() {
            var instance = this;

            return instance.toggle(false);
        },

        /**
         * Show Toggler content.
         *
         * @method expand
         */
        expand: function() {
            var instance = this;

            return instance.toggle(true);
        },

        /**
         * Return the height of content.
         *
         * @method getContentHeight
         * @return {Number} height
         */
        getContentHeight: function() {
            var instance = this;
            var content = instance.get(CONTENT);
            var expanded = instance.get(EXPANDED), height;

            if (!expanded) {
                instance._uiSetExpanded(true);
            }

            if (content.hasMethod(GET_BOUNDING_CLIENT_RECT)) {
                var preciseRegion = content.invoke(GET_BOUNDING_CLIENT_RECT);

                if (preciseRegion) {
                    height = preciseRegion.bottom - preciseRegion.top;
                }
            }
            else {
                height = content.get(OFFSET_HEIGHT);
            }

            if (!expanded) {
                instance._uiSetExpanded(false);
            }

            return height;
        },

        /**
         * Show or hide content.
         *
         * @method toggle
         * @param expand
         */
        toggle: function(expand) {
            var instance = this,
                currentExpandState;

            currentExpandState = instance.get(EXPANDED);

            if (isUndefined(expand)) {
                expand = !currentExpandState;
            }
            else if (expand === currentExpandState) {
                return expand;
            }

            if (instance.get(ANIMATED)) {
                if (instance.get(ANIMATING)) {
                    return expand;
                }

                var content = instance.get(CONTENT);

                var height = instance.getContentHeight();
                var gutter = toInt(content.getStyle(MARGIN_TOP));

                if (!instance.wrapped) {
                    content.wrap(TPL_CONTENT_WRAPPER);

                    if (expand) {
                        gutter = -(height + gutter);

                        content.setStyle(MARGIN_TOP, gutter);
                    }
                    else {                        
                        instance._lastGutter = gutter;
                    }

                    instance.wrapped = true;
                }

                instance.set(ANIMATING, true);

                instance.animate(
                    {
                        marginTop: instance._lastGutter + PIXEL
                    },
                    function() {
                        instance.set(ANIMATING, false);

                        instance.set(EXPANDED, expand);
                    }
                );
            }
            else {
                instance.set(EXPANDED, expand);
            }

            return expand;
        },

        /**
         * Trigger when the <code>expanded</code> attribute change its value.
         *
         * @method _onExpandedChange
         * @param event
         * @protected
         */
        _onExpandedChange: function(event) {
            var instance = this;

            instance._uiSetExpanded(event.newVal);
        },

        /**
         * Set the <code>expanded</code> attribute on the UI.
         *
         * @method _uiSetExpanded
         * @param val
         * @protected
         */
        _uiSetExpanded: function(val) {
            var instance = this;

            instance.get(CONTENT).replaceClass(CSS_TOGGLER_CONTENT_STATE[!val], CSS_TOGGLER_CONTENT_STATE[val]);
            instance.get(HEADER).replaceClass(CSS_TOGGLER_HEADER_STATE[!val], CSS_TOGGLER_HEADER_STATE[val]);
        }

    }
});

A.Toggler = Toggler;