/**
 * The Toggler Component
 *
 * @module aui-toggler
 */

var Lang = A.Lang,
    isBoolean = Lang.isBoolean,
    isObject = Lang.isObject,
    isString = Lang.isString,

    AArray = A.Array,

    DOC = A.config.doc,

    Toggler = A.Toggler,

    DASH = '-',
    DOT = '.',
    EMPTY_STR = '',
    SPACE = ' ',

    ACTION_COLLAPSE = 'collapse',
    ACTION_EXPAND = 'expand',
    ANIMATED = 'animated',
    CLICK = 'click',
    CLOSE_ALL_ON_EXPAND = 'closeAllOnExpand',
    COLLAPSED = 'collapsed',
    CONTAINER = 'container',
    CONTENT = 'content',
    CUBIC_BEZIER = 'cubic-bezier',
    EXPANDED = 'expanded',
    FIRST_CHILD = 'firstChild',
    HEADER = 'header',
    KEYDOWN = 'keydown',
    LINEAR = 'linear',
    TOGGLER = 'toggler',
    TOGGLER_ANIMATING_CHANGE = 'toggler:animatingChange',
    TOGGLER_DELEGATE = 'toggler-delegate',
    TRANSITION = 'transition',
    WRAPPER = 'wrapper',

    getCN = A.getClassName,

    CSS_TOGGLER_CONTENT_WRAPPER = getCN(TOGGLER, CONTENT, WRAPPER),
    CSS_TOGGLER_HEADER_COLLAPSED = getCN(TOGGLER, HEADER, COLLAPSED),
    CSS_TOGGLER_HEADER_EXPANDED = getCN(TOGGLER, HEADER, EXPANDED);

/**
 * A base class for Toggler Delegate.
 *
 * Check the [live demo](http://alloyui.com/examples/toggler/).
 *
 * @class A.TogglerDelegate
 * @extends A.Base
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 */
var TogglerDelegate = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property TogglerDelegate.NAME
     * @type String
     * @static
     */
    NAME: TOGGLER_DELEGATE,

    /**
     * Static property used to define the default attribute
     * configuration for the Toggler Delegate.
     *
     * @property TogglerDelegate.ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Determine if the Toggler Delegate transitions will animate.
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
         * Determine if the Toggler Delegate switches
         * will be set to off when one switch is toggled on.
         *
         * @attribute closeAllOnExpand
         * @default false
         * @type Boolean
         */
        closeAllOnExpand: {
            validator: isBoolean,
            value: false
        },

        /**
         * The container of Toggler Delegate instance.
         *
         * @attribute container
         */
        container: {
            setter: A.one,
            value: DOC
        },

        /**
         * The content of a Toogler Delegate instance.
         *
         * @attribute content
         * @type String
         */
        content: {
            validator: isString
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
         * The header of a Toogler Delegate instance.
         *
         * @attribute header
         * @type String
         */
        header: {
            validator: isString
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
     * @property TogglerDelegate.EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.Base,

    prototype: {

        items: null,

        /**
         * Construction logic executed during TogglerDelegate instantiation. Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this;

            instance.bindUI();
            instance.renderUI();
        },

        /**
         * Render the TogglerDelegate component instance. Lifecycle.
         *
         * @method renderUI
         * @protected
         */
        renderUI: function() {
            var instance = this;

            if (instance.get(CLOSE_ALL_ON_EXPAND)) {
                instance.items = [];

                instance.get(CONTAINER).all(instance.get(HEADER)).each(function(header) {
                    instance.items.push(
                        instance._create(header)
                    );
                });
            }
        },

        /**
         * Bind the events on the TogglerDelegate UI. Lifecycle.
         *
         * @method bindUI
         * @protected
         */
        bindUI: function() {
            var instance = this;
            var container = instance.get(CONTAINER);
            var header = instance.get(HEADER);

            instance.on(TOGGLER_ANIMATING_CHANGE, A.bind(instance._onAnimatingChange, instance));

            container.delegate([CLICK, KEYDOWN], A.bind(instance.headerEventHandler, instance), header);
        },

        /**
         * Collapse all nodes, previously specified in <code>attribute</code> header
         *
         * @method collapseAll
         */
        collapseAll: function() {
            var instance = this;

            instance._processItemsState(ACTION_COLLAPSE);
        },

        /**
         * Expand all nodes, previously specified in <code>attribute</code> header
         *
         * @method expandAll
         */
        expandAll: function() {
            var instance = this;

            instance._processItemsState(ACTION_EXPAND);
        },

        /**
         * Return the content node.
         *
         * @method headerEventHandler
         * @param header
         */
        findContentNode: function(header) {
            var instance = this;
            var content = instance.get(CONTENT);

            var contentNode = header.next(content) || header.one(content);

            if (!contentNode) {
                var wrapper = header.next(DOT + CSS_TOGGLER_CONTENT_WRAPPER);

                if (wrapper) {
                    contentNode = wrapper.get(FIRST_CHILD);
                }
            }

            return contentNode;
        },

        /**
         * Handle header events.
         *
         * @method headerEventHandler
         * @param event
         */
        headerEventHandler: function(event) {
            var instance = this;

            if (instance.animating) {
                return false;
            }

            var target = event.currentTarget;
            var toggler = target.getData(TOGGLER) || instance._create(target);

            if (Toggler.headerEventHandler(event, toggler) && instance.get(CLOSE_ALL_ON_EXPAND)) {
                AArray.each(
                    instance.items,
                    function(item, index, collection) {
                        if (item !== toggler && item.get(EXPANDED)) {
                            item.collapse();
                        }
                    }
                );
            }
        },

        /**
         * Create a Toggler instance.
         *
         * @method headerEventHandler
         * @param header
         * @protected
         */
        _create: function(header) {
            var instance = this,
                expanded = instance.get(EXPANDED);

            // Prioritize markup information to decide whether it's expanded or not
            if (header.hasClass(CSS_TOGGLER_HEADER_EXPANDED)) {
                expanded = true;
            }
            else if (header.hasClass(CSS_TOGGLER_HEADER_COLLAPSED)) {
                expanded = false;
            }

            var toggler = new Toggler({
                animated: instance.get(ANIMATED),
                bindDOMEvents: false,
                bubbleTargets: [ instance ],
                content: instance.findContentNode(header),
                expanded: expanded,
                header: header,
                transition: instance.get(TRANSITION)
            });

            return toggler;
        },

        /**
         * Trigger when the <code>animating</code> attribute change its value.
         *
         * @method _onAnimatingChange
         * @param event
         * @protected
         */
        _onAnimatingChange: function(event) {
            var instance = this;

            instance.animating = event.newVal;
        },

        /**
         * Expand or collapse all the items, specified in <code>attribute</code> attribute
         *
         * @method _processItemsState
         * @param action Could be one of these strings 'expand' or collapse'
         * @protected
         */
        _processItemsState: function(action) {
            var instance = this;

            var header = instance.get(HEADER);

            A.all(header).each(
                function(item, index, collection) {
                    var toggler = item.getData(TOGGLER) || instance._create(item);

                    if (action === ACTION_EXPAND) {
                        toggler.expand();
                    }
                    else {
                        toggler.collapse();
                    }
                }
            );
        }

    }
});

A.TogglerDelegate = TogglerDelegate;