var BODY = 'body',
    BOUNDING_BOX = 'boundingBox',
    CENTER = 'center',
    DIRECTION = 'direction',
    ID = 'id',
    INDENT = 'indent',
    MAX_ROWS = 'maxRows',
    REGION = 'region',

    BOTTOM = 'bottom',
    BOTTOM_LEFT = 'bottom-left',
    BOTTOM_RIGHT = 'bottom-right',
    LEFT = 'left',
    RIGHT = 'right',
    TOP = 'top',
    TOP_LEFT = 'top-left',
    TOP_RIGHT = 'top-right',

    POSITION = 'position',

    POSITIONS = {},

    PX = 'px';

POSITIONS[BOTTOM] = [A.WidgetPositionAlign.TL, A.WidgetPositionAlign.BL];
POSITIONS[BOTTOM_LEFT] = [A.WidgetPositionAlign.BL, A.WidgetPositionAlign.BL];
POSITIONS[BOTTOM_RIGHT] = [A.WidgetPositionAlign.BR, A.WidgetPositionAlign.BR];
POSITIONS[LEFT] = [A.WidgetPositionAlign.TR, A.WidgetPositionAlign.TL];
POSITIONS[RIGHT] = [A.WidgetPositionAlign.TL, A.WidgetPositionAlign.TR];
POSITIONS[TOP] = [A.WidgetPositionAlign.BL, A.WidgetPositionAlign.TL];
POSITIONS[TOP_LEFT] = [A.WidgetPositionAlign.TL, A.WidgetPositionAlign.TL];
POSITIONS[TOP_RIGHT] = [A.WidgetPositionAlign.TR, A.WidgetPositionAlign.TR];

A.NotifyContainer = A.Base.create('notify-container', A.Widget, [A.WidgetParent], {
	regions: null,

	initializer: function() {
		var instance = this;

		instance.regions = {};
	},

	bindUI: function() {
        var instance = this;

        instance.after('addChild', instance._afterAdd);
        instance.after('notify-item:hide', instance._afterHide);
    },

    _afterAdd: function(event) {
        var instance = this,
        	child = event.child,
            direction = instance.get(DIRECTION),
        	size = instance.size(),
            indent = instance.get(INDENT),
        	index = event.index,
        	alignNode = BODY,
        	position = POSITIONS[instance.get(POSITION)];

        if (size > 1) {
       		var maxRows = instance.get(MAX_ROWS);

        	if ((size % maxRows) == 1) {
      			var previousNode = instance.item(index - maxRows);

                alignNode = previousNode.get(BOUNDING_BOX);

                position = POSITIONS[indent];
        	}
       		else {
				var previousNode = instance.item(index - 1);

				alignNode = previousNode.get(BOUNDING_BOX);

                position = POSITIONS[direction];   
            }
        }

		if (position == CENTER) {
		    child.centered(alignNode);
		}
		else {
		    child.align(alignNode, position);
		}

		child.after(function() {
			instance.regions[child.get(ID)] = child.get(BOUNDING_BOX).get(REGION);
		}, child, '_doAlign');
    },

    _afterHide: function(event) {
    	var instance = this,
            index = event.index;

    	instance._syncRegions(index);
    	instance._moveChildren(index);

    	instance.remove(index);
    	delete instance.regions[instance.item(index).get(ID)];
    },

    _moveChildren: function(index) {
    	var instance = this;

    	instance.each(function(child, i) {
    		if (i <= index) {
				return;
			}

			var previousChild = instance.item(i - 1);
    		var region = instance.regions[previousChild.get(ID)];

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

    _syncRegions: function(index) {
    	var instance = this;
    	var i = instance.size() - 1;

    	for (; i > index; i--) {
    		var child = instance.item(i);
    		var previousChild = instance.item(i - 1);

    		instance.regions[child.get(ID)] = instance.regions[previousChild.get(ID)];
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
                
                if (position.indexOf(TOP) === 0) {
                    return BOTTOM;
                }
                else if (position.indexOf(BOTTOM) === 0) {
                    return TOP;
                }

                return undefined;
            }
        },

        indent: {
            valueFn: function() {
                var position = this.get(POSITION);
                
                if (position.indexOf(RIGHT) !== -1) {
                    return LEFT;
                }
                else if (position.indexOf(LEFT) !== -1) {
                    return RIGHT;
                }

                return undefined;
            }
        },

        maxRows: {
            value: 5
        },

        position: {
            value: TOP_LEFT
        }
    }
});