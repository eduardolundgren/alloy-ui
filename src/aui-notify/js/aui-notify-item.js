var Lang = A.Lang,
    isNumber = Lang.isNumber,
    isString = Lang.isString,

    ALERT = 'alert',
    BOUNDING_BOX = 'boundingBox',
    INFO = 'info',
    NOTICE = 'notice',
    RENDERED = 'rendered',
    TIMEOUT = 'timeout',
    TYPE = 'type',
    VISIBLE = 'visible',

    NOTIFY_ITEM_NAME = 'notify-item',

    UI_ATTRS = [TIMEOUT],
    WIDGET_UI_ATTRS = A.Widget.prototype._UI_ATTRS,

    getCN = A.ClassNameManager.getClassName;

A.NotifyItem = A.Base.create(NOTIFY_ITEM_NAME, A.Widget, [A.WidgetAutohide, A.WidgetChild, A.WidgetPosition, A.WidgetPositionAlign, A.WidgetStdMod], {
    _hiding: false,
    _timerId: null,

    bindUI: function() {
        var instance = this;

        instance.after('renderedChange', instance._afterRender);
    },

    renderUI: function() {
        var instance = this,
            boundingBox = instance.get(BOUNDING_BOX),
            type = instance.get(TYPE);

        boundingBox.addClass(getCN(NOTIFY_ITEM_NAME, type));
    },

    _afterRender: function() {
        var instance = this;

        instance._uiSetTimeout(instance.get(TIMEOUT));
    },

    _syncUIPosAlign: function () {
        var instance = this,
            visible = instance.get(VISIBLE);

        if (!visible && instance._hiding) {
            return;
        }

        A.WidgetPositionAlign.prototype._syncUIPosAlign.apply(instance, arguments);
    },

    _uiSetTimeout: function(val) {
        var instance = this;

        if (instance.get(RENDERED)) {
            clearTimeout(instance._timerId);

            if (val < Infinity) {
                instance._timerId = setTimeout(
                    A.bind(instance.hide, instance),
                    instance.get(TIMEOUT)
                );
            }
        }
    },

    _uiSetVisible: function(val) {
        var instance = this,
            boundingBox = instance.get(BOUNDING_BOX),
            boundingBoxDomElement = boundingBox.getDOM(),
            showTransition = instance.get('showTransition'),
            hideTransition = instance.get('hideTransition'),
            _uiSetVisibleParent = A.bind(A.NotifyItem.superclass._uiSetVisible, instance, val);

        if (val && !showTransition) {
            _uiSetVisibleParent();

            return;
        }

        if (!val && !hideTransition) {
            _uiSetVisibleParent();

            instance.fire('hideTransitionEnd');

            return;
        }

        if (val) {
            if (showTransition.hasOwnProperty('opacity') && (boundingBoxDomElement.style.opacity === "")) {
                boundingBox.setStyle('opacity', 0);
            }

            boundingBox.transition(showTransition, _uiSetVisibleParent);
        }
        else {
            var duration = hideTransition.duration * 1000;

            instance._hiding = true;

            boundingBox.transition(hideTransition);

            setTimeout(function() {
                instance._hiding = false;

                _uiSetVisibleParent();

                instance.fire('hideTransitionEnd');
            }, duration);
        }
    },

    _UI_ATTRS: {
        BIND: WIDGET_UI_ATTRS.BIND.concat(UI_ATTRS),
        SYNC: WIDGET_UI_ATTRS.SYNC.concat(UI_ATTRS)
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
                opacity: 0,
                duration: 1
            }
        },

        showTransition: {
            value: {
                opacity: 1
            }
        },

        timeout: {
            validator: function(val) {
                return isNumber(val) || val === Infinity;
            },
            value: Infinity
        },

        type: {
            validator: function(val) {
                return (val === ALERT || val === INFO || val === NOTICE);
            },
            value: ALERT
        }
    }
});