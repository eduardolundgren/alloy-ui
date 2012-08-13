var BORDER = 'border',
    BOUNDING_BOX = 'boundingBox',
    CONTENT_BOX = 'contentBox',
    NOTICE = 'notice',
    NOTIFY_ITEM = 'notify-item',
    SHADOW = 'shadow',
    SHOW_TRANSITION = 'showTransition',
    TEXT = 'text',
    TEXT_NODE = 'textNode',
    TYPE = 'type',

    getCN = A.ClassNameManager.getClassName,

    CSS_SHADOW = getCN(NOTIFY_ITEM, SHADOW),
    CSS_TEXT = getCN(NOTIFY_ITEM, TEXT),
    CSS_TYPE_NOTICE = getCN(NOTIFY_ITEM, NOTICE);
    CSS_TYPE_NOTICE_BORDER = getCN(NOTIFY_ITEM, NOTICE, BORDER),

    TPL_TEXT = '<div class="' + CSS_TEXT + '"></div>';

A.NotifyItem = A.Base.create(NOTIFY_ITEM, A.Widget, [A.WidgetChild, A.WidgetPosition, A.WidgetPositionAlign], {
    bindUI: function() {
        var instance = this;

        instance.after('render', instance._afterRender);
    },

    renderUI: function() {
        var instance = this,
            contentBox = instance.get(CONTENT_BOX),
            textNode = instance.get(TEXT_NODE);

        contentBox.append(textNode);
    },

    syncUI: function() {
        var instance = this,
            border = instance.get(BORDER),
            boundingBox = instance.get(BOUNDING_BOX),
            contentBox = instance.get(CONTENT_BOX),
            shadow = instance.get(SHADOW),
            showTransition = instance.get(SHOW_TRANSITION),
            text = instance.get(TEXT),
            textNode = instance.get(TEXT_NODE),
            type = instance.get(TYPE);

        if (type == NOTICE) {
            contentBox.addClass(CSS_TYPE_NOTICE);

            if (border) {
                contentBox.addClass(CSS_TYPE_NOTICE_BORDER);
            }
        }

        if (shadow) {
            contentBox.addClass(CSS_SHADOW);
        }

        if (showTransition) {
            boundingBox.transition(showTransition);
        }

        textNode.html(text);       
    },

    _afterRender: function() {
        var instance = this,
            timeout = instance.get('timeout');

        if (timeout > 0) {
            setTimeout(function() {
                instance._hide();
            }, timeout);
        }
    },

    _hide: function() {
        var instance = this,
            boundingBox = instance.get(BOUNDING_BOX);

        boundingBox.transition(instance.get('hideTransition'), function() {
            var index = instance.get('index');

            instance.fire('hide', { index: index });
        });
    }
}, {
    ATTRS: {
        alignNode: {
            value: 'body'
        },

        border: {
            value: false
        },

        hideTransition: {
            value: {
                opacity: 0
            }
        },

        position: {
            value: 'top-right'
        },

        shadow: {
            value: true
        },

        showTransition: {
            value: {
                opacity: 1
            }
        },

        text: {
            value: ''
        },

        textNode: {
            valueFn: function() {
                return A.Node.create(TPL_TEXT);
            }
        },

        timeout: {
            value: 2000
        },

        type: {
            value: NOTICE
        }
    }
});