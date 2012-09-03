var BODY = 'body',
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
    handles: null,
    regions: null,

    initializer: function() {
        var instance = this;

        instance.handles = {};
        instance.regions = {};
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
            alignNode = instance.get('alignNode'),
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

        // delete instance.regions[child.get(ID)];

        instance.remove(index);
    },

    _afterChildRender: function(event) {
        var instance = this,
            child = event.target,
            boundingBox =  child.get(BOUNDING_BOX);

        instance.regions[child.get(ID)] = boundingBox.get(REGION);
    },

    _moveChildren: function(index) {
        var instance = this;

        instance.each(function(child, i) {
            if (i <= index) {
                return;
            }

            var region = instance.regions[child.get(ID)];

            if (!region) {
                return;
            }

            var node = child.get(BOUNDING_BOX);
console.log(region.top, region.left);
            node.transition({
                top: region.top + PX,
                left: region.left + PX
            });
        });
    },

    _swapRegions: function(index) {
        var instance = this;
        var i = instance.size() - 1;

        for (; i > index; i--) {
            var child = instance.item(i);
            var previousChild = instance.item(i - 1);

            instance.regions[child.get(ID)] = instance.regions[previousChild.get(ID)];
            console.log(instance.regions[child.get(ID)], child.get(ID), instance.regions, previousChild.bodyNode.html(), child.bodyNode.html());
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
            // valueFn: function() {
            //     var position = this.get(POSITION);

            //     if (position.indexOf(R) !== -1) {
            //         return L;
            //     }
            //     else if (position.indexOf(L) !== -1) {
            //         return R;
            //     }
            // }
        },

        maxRows: {
            value: 1
        },

        position: {
            value: TR
        }
    }
});