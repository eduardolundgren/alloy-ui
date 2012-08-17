var ALERT = 'alert',
    BORDER = 'border',
    BOUNDING_BOX = 'boundingBox',
    CONTENT_BOX = 'contentBox',
    INFO = 'info',
    NOTICE = 'notice',
    NOTIFY_ITEM = 'notify-item',
    SHADOW = 'shadow',
    SHOW_TRANSITION = 'showTransition',
    TEXT = 'text',
    TIMEOUT = 'timeout',
    TITLE = 'title',
    TYPE = 'type',

    getCN = A.ClassNameManager.getClassName,

    CSS_SHADOW = getCN(NOTIFY_ITEM, SHADOW);

A.NotifyItem = A.Base.create(NOTIFY_ITEM, A.Widget, [A.WidgetAutohide, A.WidgetChild, A.WidgetPosition, A.WidgetPositionAlign, A.WidgetStdMod], {
    bindUI: function() {
        var instance = this;

        instance.after('render', instance._afterRender);
        instance.after('visibleChange', instance._afterVisibleChange);
    },

    renderUI: function() {
        var instance = this,
            border = instance.get(BORDER),
            boundingBox = instance.get(BOUNDING_BOX),
            contentBox = instance.get(CONTENT_BOX),
            shadow = instance.get(SHADOW),
            showTransition = instance.get(SHOW_TRANSITION),
            type = instance.get(TYPE);

        if (type) {
            contentBox.addClass(getCN(NOTIFY_ITEM, type));

            if (border) {
                contentBox.addClass(getCN(NOTIFY_ITEM, type, BORDER));
            }
        }

        if (shadow) {
            contentBox.addClass(CSS_SHADOW);
        }

        if (showTransition) {
            boundingBox.transition(showTransition);
        }
    },

    syncUI: function() {
        var instance = this,
			text = instance.get(TEXT),
			title = instance.get(TITLE);

		instance.setStdModContent(A.WidgetStdMod.HEADER, title);
		instance.setStdModContent(A.WidgetStdMod.BODY, text);
    },

    _afterRender: function() {
        var instance = this,
            timeout = instance.get(TIMEOUT);

        if (timeout > 0) {
            setTimeout(function() {
                instance.hide();
            }, timeout);
        }
    },

    _afterVisibleChange: function(event) {
        var instance = this,
            boundingBox = instance.get(BOUNDING_BOX),
            hideTransition = instance.get('hideTransition');

        if (event.newVal) {
            return;
        }

        if (hideTransition) {
            boundingBox.transition(hideTransition, function() {
                var index = instance.get('index');

                instance.fire('hide', { index: index });
            });
        }
        else {
            var index = instance.get('index');

            instance.fire('hide', { index: index });
        }
    }
}, {
    ATTRS: {
        border: {
            value: false
        },

        hideOn: {
            valueFn: function() {
                return [
                    {
                        node: this.get(BOUNDING_BOX),
                        eventName: 'click'
                    }
                ];
            },
            validator: A.Lang.isArray
        },

        hideTransition: { 
            opacity: 0
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

        timeout: {
            value: 2000
        },

        title: {
            value: ''
        },

        type: {
            validator: function(val) {
                return (val === ALERT || val === INFO || val === NOTICE);
            },
            value: NOTICE
        }
    }
});