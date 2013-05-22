/**
 * The Modal Component
 *
 * @module aui-modal
 */

var Lang = A.Lang,

    StdMod = A.WidgetStdMod,

    OWNER_DOCUMENT = 'ownerDocument',

    getClassName = A.getClassName,

    _DOT = '.',
    _EMPTY = '',
    _SPACE = ' ',

    BOUNDING_BOX = 'boundingBox',
    BR = 'br',
    CLICK = 'click',
    CSS_CLASS = 'cssClass',
    CSS_CLASS_CHANGE = 'cssClassChange',
    DESTROY_ON_HIDE = 'destroyOnHide',
    DRAGGABLE = 'draggable',
    FILL_HEIGHT = 'fillHeight',
    HEIGHT = 'height',
    MODAL = 'modal',
    MOUSEMOVE = 'mousemove',
    RESIZABLE = 'resizable',
    SYNC_UI = 'syncUI',
    VISIBLE_CHANGE = 'visibleChange',
    WIDTH = 'width',

    CSS_MODAL_BD = getClassName('modal-body'),
    CSS_MODAL_FT = getClassName('modal-footer'),
    CSS_MODAL_HD = getClassName('modal-header');

/**
 * A base class for Modal.
 *
 * Check the [live demo](http://alloyui.com/examples/modal/).
 *
 * @class Modal
 * @extends Widget
 * @uses WidgetPosition,WidgetStdMod,WidgetAutohide,WidgetToolbars,
 * WidgetModality,WidgetPositionAlign,WidgetPositionConstrain,WidgetStack
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 */
A.Modal = A.Base.create(MODAL, A.Widget, [
    A.WidgetPosition,
    A.WidgetStdMod,
    A.WidgetAutohide,
    A.WidgetToolbars,
    A.WidgetModality,
    A.WidgetPositionAlign,
    A.WidgetPositionConstrain,
    A.WidgetStack
], {

    /**
     * Construction logic executed during Modal instantiation. Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var instance = this;

        A.after(instance._afterFillHeight, instance, FILL_HEIGHT);
        instance.after(instance.syncModalExtUI, instance, SYNC_UI);
        instance.after('resize:end', A.bind(instance._syncResizeDimensions, instance));
        instance.after(CSS_CLASS_CHANGE, instance._afterCssClassChange);
        instance.after(VISIBLE_CHANGE, instance._afterVisibleChange);
        instance.once([CLICK, MOUSEMOVE], instance._onUserInitInteraction);
    },

    /**
     * Syncs the modal UI.
     *
     * @method syncModalExtUI
     * @param event
     * @public
     */
     syncModalExtUI: function() {
        var instance = this;

        instance._uiSetCssClass(instance.get(CSS_CLASS));
    },

    /**
     * Add <code>bubbleTargets</code> to config object.
     *
     * @method _addBubbleTargets
     * @param config
     * @protected
     */
    _addBubbleTargets: function(config) {
        var instance = this;

        if (!Lang.isObject(config)) {
            config = {};
        }
        return A.mix(config, { bubbleTargets: instance });
    },

    /**
     * Fires after <code>cssClass</code> attribute changes.
     *
     * @method _afterCssClassChange
     * @param event
     * @protected
     */
    _afterCssClassChange: function(event) {
        var instance = this;

        instance._uiSetCssClass(event.newVal, event.prevVal);
    },

    /**
     * Fire after <code>maxHeight</code> CSS property changes.
     *
     * @method _afterFillHeight
     * @param event
     * @protected
     */
    _afterFillHeight: function(event) {
        var instance = this;

        instance._fillMaxHeight(instance.get(HEIGHT));
    },

    /**
     * Fire after visibility changes.
     *
     * @method _afterVisibleChange
     * @param event
     * @protected
     */
    _afterVisibleChange: function(event) {
        var instance = this;

        if (!event.newVal && instance.get(DESTROY_ON_HIDE)) {
            instance.destroy();
        }
    },

    /**
     * Set <code>maxHeight</code> CSS property.
     *
     * @method _fillMaxHeight
     * @param height
     * @protected
     */
    _fillMaxHeight: function(height) {
        var instance = this,
            fillHeight = instance.get(FILL_HEIGHT),
            node = instance.getStdModNode(fillHeight, true);

        if (node) {
            node.setStyle('maxHeight', height);
        }
    },

    /**
     * Create node using predefined templates.
     *
     * @method _getStdModTemplate
     * @param section
     * @protected
     */
    _getStdModTemplate : function(section) {
        return A.Node.create(A.Modal.TEMPLATES[section], this._stdModNode.get(OWNER_DOCUMENT));
    },

    /**
     * Fire before resizing to the correct dimensions.
     *
     * @method _beforeResizeCorrectDimensions
     * @param event
     * @protected
     */
    _beforeResizeCorrectDimensions: function(event) {
        var instance = this;

        if (instance.resize.proxy) {
            return new A.Do.Prevent();
        }
    },

    /**
     * Plug draggable/resizable if enable.
     *
     * @method _onUserInitInteraction
     * @protected
     */
    _onUserInitInteraction: function() {
        var instance = this,
            draggable = instance.get(DRAGGABLE),
            resizable = instance.get(RESIZABLE);

        if (draggable) {
            instance.plug(A.Plugin.Drag, instance._addBubbleTargets(draggable));
        }

        if (resizable) {
            instance.plug(A.Plugin.Resize, instance._addBubbleTargets(resizable));
            A.before(instance._beforeResizeCorrectDimensions, instance.resize, '_correctDimensions', instance);
        }
    },

    /**
     * Sync width/height dimensions on resize.
     *
     * @method _syncResizeDimensions
     * @param event
     * @protected
     */
    _syncResizeDimensions: function(event) {
        var instance = this,
            resize = event.info;

        instance.set(WIDTH, resize.offsetWidth);
        instance.set(HEIGHT, resize.offsetHeight);
    },

    /**
     * Set the cssClass of the Modal's boundingBox node.
     *
     * @method _uiSetCssClass
     * @param val
     * @param prevVal
     * @protected
     */
    _uiSetCssClass: function(val, prevVal) {
        var instance = this,
            boundingBox = instance.get(BOUNDING_BOX);

        if (prevVal) {
            boundingBox.removeClass(prevVal);
        }
        boundingBox.addClass(val);
    }
}, {

    /**
     * Static property provides a string to identify the CSS prefix.
     *
     * @property Modal.CSS_PREFIX
     * @type String
     * @static
     */
    CSS_PREFIX: getClassName(MODAL),

    /**
     * Static property used to define the default attribute
     * configuration for the Modal.
     *
     * @property Modal.ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Determine the content of Modal's body section.
         *
         * Temporary fix for widget-stdmod bug when bodyContent initializes empty.
         * this._currFillNode is never updated if _uiSetFillHeight is not called.
         *
         * @attribute bodyContent
         * @default ''
         * @type String
         */
        bodyContent: {
            value: _EMPTY
        },

        /**
         * Determine the CSS classes for the boudingBox of thew modal.
         *
         * @attribute cssClass
         * @default ''
         * @type String
         */
        cssClass: {
            value: _EMPTY
        },

        /**
         * Determine if Modal should be destroyed when hidden.
         *
         * @attribute destroyOnHide
         * @default false
         * @type Boolean
         */
        destroyOnHide: {
            validator: Lang.isBoolean,
            value: false
        },

        /**
         * Determine if Modal should be draggable or not.
         *
         * @attribute draggable
         * @type Object
         * @writeOnce
         */
        draggable: {
            value: {
                handles: [_DOT+CSS_MODAL_HD],
                plugins: [
                    { fn: A.Plugin.DDConstrained }
                ]
            },
            writeOnce: true
        },

        /**
         * Determine if Modal should be resizable or not.
         *
         * @attribute resizable
         * @type Object
         * @writeOnce
         */
        resizable: {
            value: {
                handles: BR
            },
            writeOnce: true
        },

        /**
         * Determine the content of Modal's header section.
         *
         * @attribute toolbars
         * @type Function
         */
        toolbars: {
            valueFn: function() {
                var instance = this;

                return {
                    header: [
                        {
                            cssClass: 'close',
                            label: "\u00D7",
                            after: {
                                click: function() { instance.hide(); }
                            },
                            render: true
                        }
                    ]
                };
            }
        }
    },

    /**
     * Static property provides a set of reusable templates.
     *
     * @property Modal.TEMPLATES
     * @type Object
     * @static
     */
    TEMPLATES: {
        header: '<div class="' + StdMod.SECTION_CLASS_NAMES[StdMod.HEADER] + _SPACE + CSS_MODAL_HD + '"></div>',
        body:   '<div class="' + StdMod.SECTION_CLASS_NAMES[StdMod.BODY] + _SPACE + CSS_MODAL_BD + '"></div>',
        footer: '<div class="' + StdMod.SECTION_CLASS_NAMES[StdMod.FOOTER] + _SPACE + CSS_MODAL_FT + '"></div>'
    }
});