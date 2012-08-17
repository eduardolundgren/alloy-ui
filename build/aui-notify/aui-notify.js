AUI.add('aui-notify', function(A) {
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

	UI_ATTRS = [TEXT, TIMEOUT, TITLE],
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
			showTransition = instance.get(SHOW_TRANSITION),
			type = instance.get(TYPE);

		boundingBox.addClass(getCN(NOTIFY_ITEM_NAME, type));

		if (showTransition) {
			boundingBox.transition(showTransition);
		}
	},

	_afterRender: function() {
		var instance = this;

		instance._uiSetTimeout(instance.get(TIMEOUT));
	},

	// STOP

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
	},

	_uiSetText: function(val) {
		var instance = this;

		if (!isUndefined(val)) {
			instance.setStdModContent(A.WidgetStdMod.BODY, val);
		}
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

	_uiSetTitle: function(val) {
		var instance = this;

		if (!isUndefined(val)) {
			instance.setStdModContent(A.WidgetStdMod.HEADER, val);
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
			validator: function(val) {
				return isNumber(val) || val === Infinity;
			},
			value: Infinity
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
var BODY = 'body',
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

A.NotifyContainer = A.Base.create('notify-container', A.Widget, [A.WidgetParent], {
	handles: null,
	regions: null,

	initializer: function() {
		var instance = this;

		instance.handles = {};
		instance.regions = {};

		POSITIONS[BOTTOM] = [A.WidgetPositionAlign.TL, A.WidgetPositionAlign.BL];
		POSITIONS[BOTTOM_LEFT] = [A.WidgetPositionAlign.BL, A.WidgetPositionAlign.BL];
		POSITIONS[BOTTOM_RIGHT] = [A.WidgetPositionAlign.BR, A.WidgetPositionAlign.BR];
		POSITIONS[LEFT] = [A.WidgetPositionAlign.TR, A.WidgetPositionAlign.TL];
		POSITIONS[RIGHT] = [A.WidgetPositionAlign.TL, A.WidgetPositionAlign.TR];
		POSITIONS[TOP] = [A.WidgetPositionAlign.BL, A.WidgetPositionAlign.TL];
		POSITIONS[TOP_LEFT] = [A.WidgetPositionAlign.TL, A.WidgetPositionAlign.TL];
		POSITIONS[TOP_RIGHT] = [A.WidgetPositionAlign.TR, A.WidgetPositionAlign.TR];
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
			var maxRows = instance.get(MAX_ROWS),
				previousNode;

			if ((size % maxRows) === 1) {
				previousNode = instance.item(index - maxRows);

				alignNode = previousNode.get(BOUNDING_BOX);

				position = POSITIONS[indent];
			}
			else {
				previousNode = instance.item(index - 1);

				alignNode = previousNode.get(BOUNDING_BOX);

				position = POSITIONS[direction];
			}
		}

		if (position === CENTER) {
			child.centered(alignNode);
		}
		else {
			child.align(alignNode, position);
		}

		var handle = child.after(function() {
			instance.regions[child.get(ID)] = child.get(BOUNDING_BOX).get(REGION);
		}, child, '_doAlign');

		instance.handles[child.get(ID)] = handle;
	},

	_afterHide: function(event) {
		var instance = this,
			index = event.index;

		instance._syncRegions(index);
		instance._moveChildren(index);

		var id = instance.item(index).get(ID);

		var handle = instance.handles[id];

		handle.detach();

		delete instance.handles[id];
		delete instance.regions[id];

		instance.remove(index);
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
			value: TOP_RIGHT
		}
	}
});

}, '@VERSION@' ,{skinnable:true, requires:['aui-base','transition','widget','widget-autohide','widget-child','widget-parent','widget-position','widget-position-align','widget-stdmod']});
