var Node = A.Node,

	getClassName = A.getClassName,

	DOC = A.one('document'),
	FAVICON = 'Favicon',
	FAVICON_CLASS_NAME = getClassName(FAVICON),
	FAVICON_TPL = '<link class="' + FAVICON_CLASS_NAME + '" rel="icon" type="image/png" href="image.png" />';
	TODAY = new Date();

Favicon = A.Base.create('favicon', A.Widget, [], {
	/*
	* Lifecycle
	*/
	initializer: function() {
		var instance = this;
	},

	renderUI: function() {
		var instance = this,
			value = instance.get('value'),
			size = instance.get('size'),
			position = instance.get('position'),
			image = Node.create('<img />').getDOM(),
			nodeLink = Node.create('<link rel="icon" />'),
			text = '',
			font = '';

		context = instance._getContext();
		canvas = instance.canvas.getDOM();
		text = (value) ? value : instance.get('defaultValue');

		canvas.height = size;
		canvas.width = size;

		image.onload = function () {
			context.drawImage(this, 0, 0);

			font = (instance.get('useStrongText')) ? 'bold ' + instance.get('font') : instance.get('font');
			context.font = font;
			context.fillStyle = instance.get('textColor');
			context.fillText(text, position.x, position.y);

			nodeLink.setAttrs({'href': canvas.toDataURL('image/png')});
			nodeLink.addClass(getClassName(FAVICON));
			instance._removeExistingFavicon();
			DOC.one('head').append(nodeLink);
		}

		image.src = instance.get('image');
	},

	_removeExistingFavicon: function () {
		var instance = this,
			favicon = A.one('link[rel="icon"]');

		if (favicon) {
			favicon.destroy();
		}
	},

	_getContext: function () {
		var instance = this;

		if (!instance.canvas) {
			instance._createCanvas();
		}

		return instance.canvas.getDOM().getContext('2d');
	},

	_createCanvas: function () {
		var instance = this;

		instance.canvas = Node.create('<canvas />');
	}
},

{
	ATTRS: {
		size: {
			value: 16
		},

		image: {
			value: '../../build/aui-favicon/assets/favicon.png'
		},

		value: {
			value: false
		},

		defaultValue: {
			readOnly: true,
			value: 5
		},

		textColor: {
			value: '#FFFFFF'
		},

		font: {
			value: '9px "Helvetica", sans-serif'
		},

		useStrongText: {
			value: true
		},

		position: {
			value: {
				x: 2,
				y: 10
			}
		}
	}
});

A.Favicon = Favicon;