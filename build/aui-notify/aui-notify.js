AUI.add('aui-notify', function(A) {
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
var BOUNDING_BOX = 'boundingBox',
    ID = 'id',

    POSITIONS = {
        'bottom': [A.WidgetPositionAlign.TL, A.WidgetPositionAlign.BL],
        'bottom-left': [A.WidgetPositionAlign.BL, A.WidgetPositionAlign.BL],
        'bottom-right': [A.WidgetPositionAlign.BR, A.WidgetPositionAlign.BR],
        'left': [A.WidgetPositionAlign.TR, A.WidgetPositionAlign.TL],
        'right': [A.WidgetPositionAlign.TL, A.WidgetPositionAlign.TR],
        'top': [A.WidgetPositionAlign.BL, A.WidgetPositionAlign.TL],
        'top-left': [A.WidgetPositionAlign.TL, A.WidgetPositionAlign.TL],
        'top-right': [A.WidgetPositionAlign.TR, A.WidgetPositionAlign.TR]
    };

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
        	size = instance.size(),
        	index = event.index,
        	alignNode = 'body',
        	position = POSITIONS[child.get('position')];

        if (size > 1) {
       		var maxRows = instance.get('maxRows');

        	if ((size % maxRows) == 1) {
      			var previousNode = instance.item(index - maxRows);
				alignNode = previousNode.get(BOUNDING_BOX);

				position = [A.WidgetPositionAlign.TR, A.WidgetPositionAlign.TL];
        	}
       		else {
				var previousNode = instance.item(index - 1);
				alignNode = previousNode.get(BOUNDING_BOX);

				position = [A.WidgetPositionAlign.TL, A.WidgetPositionAlign.BL];
        	}
        }

		if (position == 'center') {
		    child.centered(alignNode);
		}
		else {
		    child.align(alignNode, position);
		}

		child.after(function() {
			instance.regions[child.get(ID)] = child.get(BOUNDING_BOX).get('region');
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
    			top: region.top + 'px',
    			left: region.left + 'px'
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
    	maxRows: {
    		value: 3
    	},

        defaultChildType: {
            value: A.NotifyItem,
            readOnly: true
        }
    }
});

}, '@VERSION@' ,{skinnable:true, requires:['aui-base','transition','widget','widget-child','widget-parent','widget-position','widget-position-align']});
