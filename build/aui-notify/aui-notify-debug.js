AUI.add('aui-notify', function(A) {
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

    _afterHideTransitionEnd: function() {
        var instance = this,
            _uiSetVisibleParent = A.bind(A.NotifyItem.superclass._uiSetVisible, instance, false);

        instance._hiding = false;

        _uiSetVisibleParent();

        instance.fire('hideTransitionEnd');
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

            setTimeout(
                A.bind(instance._afterHideTransitionEnd, instance),
                duration
            );
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
var ALIGN_NODE = 'alignNode',
    BODY = 'body',
    CENTER = 'center',
    DIRECTION = 'direction',
    ID = 'id',
    INDENT = 'indent',
    MAX_ROWS = 'maxRows',
    POSITION = 'position',
    PX = 'px';
    REGION = 'region',

    B = 'b',
    BL = 'bl',
    BR = 'br',
    L = 'l',
    R = 'r',
    T = 't',
    TL = 'tl',
    TR = 'tr',

    POSITIONS = {
        b: [A.WidgetPositionAlign.TL, A.WidgetPositionAlign.BL],
        bl: [A.WidgetPositionAlign.BL, A.WidgetPositionAlign.BL],
        br: [A.WidgetPositionAlign.BR, A.WidgetPositionAlign.BR],
        l: [A.WidgetPositionAlign.TR, A.WidgetPositionAlign.TL],
        r: [A.WidgetPositionAlign.TL, A.WidgetPositionAlign.TR],
        t: [A.WidgetPositionAlign.BL, A.WidgetPositionAlign.TL],
        tl: [A.WidgetPositionAlign.TL, A.WidgetPositionAlign.TL],
        tr: [A.WidgetPositionAlign.TR, A.WidgetPositionAlign.TR]
    },

A.NotifyContainer = A.Base.create('notify-container', A.Widget, [A.WidgetParent], {
    _regions: null,

    initializer: function() {
        var instance = this;

        instance._regions = {};
    },

    bindUI: function() {
        var instance = this;

        instance.after({
            'addChild': instance._afterAdd,
            'notify-item:hideTransitionEnd': instance._afterChildHideTransitionEnd,
            'notify-item:renderedChange': instance._afterChildRender
        });
    },

    _afterAdd: function(event) {
        var instance = this,
            child = event.child,
            direction = instance.get(DIRECTION),
            size = instance.size(),
            indent = instance.get(INDENT),
            index = event.index,
            alignNode = instance.get(ALIGN_NODE),
            position = POSITIONS[instance.get(POSITION)];

        if (size > 1) {
            var maxRows = instance.get(MAX_ROWS),
                previousNode;

            if ((size % maxRows) === 1 || maxRows === 1) {
                previousNode = instance.item(index - maxRows);

                position = POSITIONS[indent];
            }
            else {
                previousNode = instance.item(index - 1);

                position = POSITIONS[direction];
            }

            alignNode = previousNode.get(BOUNDING_BOX);
        }

        if (position === CENTER) {
            child.centered(alignNode);
        }
        else {
            child.align(alignNode, position);
        }
    },

    _afterChildHideTransitionEnd: function(event) {
        var instance = this,
            child = event.target,
            index = instance.indexOf(child);

        instance._swapRegions(index);
        instance._moveChildren(index);

        delete instance._regions[child.get(ID)];

        instance.remove(index);
    },

    _afterChildRender: function(event) {
        var instance = this,
            child = event.target,
            boundingBox =  child.get(BOUNDING_BOX),
			region = boundingBox.get(REGION);

        instance._regions[child.get(ID)] = {
			height: region.height,
			left: boundingBox.get('offsetLeft'),
			top: boundingBox.get('offsetTop'),
			width: region.width
		};
    },

    _checkDimensionDiffs: function(index) {
        var instance = this,
            size = instance.size(),
            maxRows = instance.get(MAX_ROWS),
            curColumn = Math.floor(index/maxRows + 1),
            columns = Math.floor(size/maxRows + 1),
            i = index + 1;

        for (; curColumn <= columns; curColumn++) {
            var diff = 0,
                rows = (curColumn * maxRows);

            for (; (i < rows) && (i < size); i++) {
                if ((i % maxRows) == 0) {
                    continue;
                }

                var child = instance.item(i),
                    childRegion = instance._regions[child.get(ID)];
                    previousChild = instance.item(i - 1),
                    previousRegion = instance._regions[previousChild.get(ID)];

                diff = diff + (childRegion.height - previousRegion.height);

                childRegion.top = childRegion.top + diff;
            }
        }
    },

    _moveChildren: function(index) {
        var instance = this;

        instance.each(function(child, i) {
            if (i <= index) {
                return;
            }

            var region = instance._regions[child.get(ID)];

            if (!region) {
                return;
            }

            var node = child.get(BOUNDING_BOX);

            node.transition({
                top: region.top + PX,
                left: region.left + PX
            });
        });
    },

    _swapRegions: function(index) {
        var instance = this,
            i = instance.size() - 1;

        instance._checkDimensionDiffs(index);

        for (; i > index; i--) {
            var child = instance.item(i),
                previousChild = instance.item(i - 1),
                previousRegion = instance._regions[previousChild.get(ID)];

            instance._regions[child.get(ID)].top = previousRegion.top;
            instance._regions[child.get(ID)].left = previousRegion.left;
        }
    }
},
{
    ATTRS: {
        alignNode: {
            value: BODY
        },

        defaultChildType: {
            value: A.NotifyItem,
            readOnly: true
        },

        direction: {
            valueFn: function() {
                var position = this.get(POSITION);

                if ((position === T) || (position === TL) || (position === TR)) {
                    return B;
                }
                else {
                    return T;
                }
            }
        },

        indent: {
            valueFn: function() {
                var position = this.get(POSITION);

                if ((position === R) || (position === BR) || (position === TR)) {
                    return L;
                }
                else {
                    return R;
                }
            }
        },

        maxRows: {
            value: 5
        },

        position: {
            value: TR
        }
    }
});

}, '@VERSION@' ,{skinnable:true, requires:['aui-base','transition','widget','widget-autohide','widget-child','widget-parent','widget-position','widget-position-align','widget-stdmod']});
