var Lang = A.Lang,
    isUndefined = Lang.isUndefined,
    isNumber = Lang.isNumber,

    ALERT = 'alert',
    BOUNDING_BOX = 'boundingBox',
    CONTENT_BOX = 'contentBox',
    INFO = 'info',
    NOTICE = 'notice',
    RENDERED = 'rendered',
    SHADOW = 'shadow',
    SHOW_TRANSITION = 'showTransition',
    TEXT = 'text',
    TIMEOUT = 'timeout',
    TITLE = 'title',
    TYPE = 'type',

    NOTIFY_ITEM_NAME = 'notify-item',

    UI_ATTRS = [TIMEOUT],
    WIDGET_UI_ATTRS = A.Widget.prototype._UI_ATTRS,

    getCN = A.ClassNameManager.getClassName;

A.NotifyItem = A.Base.create(NOTIFY_ITEM_NAME, A.Widget, [A.WidgetAutohide, A.WidgetChild, A.WidgetPosition, A.WidgetPositionAlign, A.WidgetStdMod], {
    _timerId: null,

    bindUI: function() {
        var instance = this;

        instance.after({
            // TODO: Check why when after render 'rendered' attribute is false
            renderedChange: instance._afterRender,
            visibleChange: instance._afterVisibleChange
        });
    },

    renderUI: function() {
        var instance = this,
            boundingBox = instance.get(BOUNDING_BOX),
            // showTransition = instance.get(SHOW_TRANSITION),
            type = instance.get(TYPE);

        boundingBox.addClass(getCN(NOTIFY_ITEM_NAME, type));

        // if (showTransition) {
        //  boundingBox.transition(showTransition);
        // }
    },

    _afterRender: function() {
        var instance = this;

        instance._uiSetTimeout(instance.get(TIMEOUT));
    },

    // _afterVisibleChange: function(event) {
    //  var instance = this,
    //      boundingBox = instance.get(BOUNDING_BOX),
    //      hideTransition = instance.get('hideTransition');

    //  if (event.newVal) {
    //      return;
    //  }

    //  if (hideTransition) {
    //      boundingBox.transition(hideTransition);
    //  }
    //  // else {
    //  //  var index = instance.get('index');

    //  //  instance.fire('hide', { index: index });
    //  // }
    // },

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

        if ((val && !showTransition) || (!val && !hideTransition)) {
            A.NotifyItem.superclass._uiSetVisible.apply(this, arguments);

            return;
        }

        // TODO - bugfix
        // if (!instance.get('rendered')) {
        //  return;
        // }

        if (val) {
            // Set initial opacity, to avoid initial flicker
            if (showTransition.hasOwnProperty('opacity') && (boundingBoxDomElement.style.opacity === "")) {
                boundingBox.setStyle('opacity', 0);
            }

            boundingBox.transition(showTransition, _uiSetVisibleParent);
        }
        else {
            boundingBox.transition(hideTransition, _uiSetVisibleParent);
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
            // value: {
            //  opacity: 0,
            //  duration: 10
            // }
        },

        showTransition: {
            // value: {
            //  opacity: 1
            // }
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