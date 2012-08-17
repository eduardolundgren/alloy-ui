var Lang = A.Lang,
    isUndefined = Lang.isUndefined,

    ALERT = 'alert',
    BOUNDING_BOX = 'boundingBox',
    CONTENT_BOX = 'contentBox',
    INFO = 'info',
    NOTICE = 'notice',
    SHADOW = 'shadow',
    SHOW_TRANSITION = 'showTransition',
    TEXT = 'text',
    TIMEOUT = 'timeout',
    TITLE = 'title',
    TYPE = 'type',

    NOTIFY_ITEM_NAME = 'notify-item',

    getCN = A.ClassNameManager.getClassName;

A.NotifyItem = A.Base.create(NOTIFY_ITEM_NAME, A.Widget, [A.WidgetAutohide, A.WidgetChild, A.WidgetPosition, A.WidgetPositionAlign, A.WidgetStdMod], {
    bindUI: function() {
        var instance = this;

        instance.after({
            render: instance._afterRender,
            visibleChange: instance._afterVisibleChange
        });
    },

    renderUI: function() {
        var instance = this,
            boundingBox = instance.get(BOUNDING_BOX),
            showTransition = instance.get(SHOW_TRANSITION),
            type = instance.get(TYPE);

        if (type) {
            boundingBox.addClass(getCN(NOTIFY_ITEM_NAME, type));
        }

        if (showTransition) {
            boundingBox.transition(showTransition);
        }
    },

    syncUI: function() {
        var instance = this,
            text = instance.get(TEXT),
            title = instance.get(TITLE);

        if (!isUndefined(title)) {
            instance.setStdModContent(A.WidgetStdMod.HEADER, title);
        }

        if (!isUndefined(text)) {
            instance.setStdModContent(A.WidgetStdMod.BODY, text);
        }

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
            value: {
                opacity: 0
            }
        },

        showTransition: {
            value: {
                opacity: 1
            }
        },

        text: {
        },

        timeout: {
            value: 2000
        },

        title: {
        },

        type: {
            validator: function(val) {
                return (val === ALERT || val === INFO || val === NOTICE);
            },
            value: ALERT
        }
    }
});