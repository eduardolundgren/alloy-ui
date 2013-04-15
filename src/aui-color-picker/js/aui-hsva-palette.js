/* global A*/

var AArray = A.Array,
    AColor = A.Color,
    Lang = A.Lang,

    getClassName = A.getClassName,

    DOT = '.',

    CSS_CONTAINER = getClassName('hsva-container'),

    CSS_VIEW_CONTAINER = getClassName('hsva-view-container'),

    CSS_HS_IMAGE_BACKDROP = getClassName('hsva-image-backdrop'),
    CSS_HS_VIEW_BACKDROP = getClassName('hsva-view-backdrop'),

    CSS_HS_CONTAINER = getClassName('hsva-hs-container'),
    CSS_HS_THUMB = getClassName('hsva-hs-thumb'),

    CSS_VALUE_CONTAINER = getClassName('hsva-value-container'),

    CSS_VALUE_CANVAS = getClassName('hsva-value-canvas'),
    CSS_VALUE_THUMB = getClassName('hsva-value-thumb'),
    CSS_VALUE_THUMB_IMAGE = getClassName('hsva-value-image'),

    CSS_ALPHA_CONTAINER = getClassName('hsva-alpha-container'),
    CSS_ALPHA_CANVAS = getClassName('hsva-alpha-canvas'),
    CSS_ALPHA_THUMB = getClassName('hsva-alpha-thumb'),
    CSS_ALPHA_THUMB_IMAGE = getClassName('hsva-alpha-image'),

    CSS_RESULT_VIEW = getClassName('hsva-result-view'),

    CSS_LABEL_VALUE_CONTAINER = getClassName('hsva-label-value-container'),
    CSS_LABEL_VALUE_HSV_CONTAINER = getClassName('hsva-label-value-hsv-container'),
    CSS_LABEL_VALUE_RGB_CONTAINER = getClassName('hsva-label-value-rgb-container'),
    CSS_LABEL_VALUE_HEX_CONTAINER = getClassName('hsva-label-value-hex-container'),

    CSS_LABEL_VALUE = getClassName('hsva-label-value'),

    CSS_LABEL = getClassName('hsva-label'),
    CSS_VALUE = getClassName('hsva-value'),
    CSS_RESULT_INPUT = getClassName('hsva-result-input'),

    NAME = 'hsva-palette',

    TPL_CONTAINER =
        '<div class="' + CSS_CONTAINER + '"><div>',

    TPL_VIEW_CONTAINER =
        '<div class="' + CSS_VIEW_CONTAINER + '"><div>',

    TPL_IMAGE_BACKDROP =
        '<div class="' + CSS_HS_IMAGE_BACKDROP + '"><div>',

    TPL_VIEW_BACKDROP =
        '<div class="' + CSS_HS_VIEW_BACKDROP + '"><div>',

    TPL_HS_CONTAINER =
        '<div class="' + CSS_HS_CONTAINER + '"><div>',

    TPL_HS_THUMB =
        '<div class="' + CSS_HS_THUMB + '"><div>',

    TPL_VALUE_CONTAINER =
        '<div class="' + CSS_VALUE_CONTAINER + '"><div>',

    TPL_VALUE_CANVAS = '<span class="' + CSS_VALUE_CANVAS + '"></span>',

    TPL_VALUE_THUMB = '<span class="' + CSS_VALUE_THUMB + '"><span class="' + CSS_VALUE_THUMB_IMAGE + '"></span></span>',

    TPL_ALPHA_CONTAINER =
        '<div class="' + CSS_ALPHA_CONTAINER + '"><div>',

    TPL_ALPHA_CANVAS = '<span class="' + CSS_ALPHA_CANVAS + '"></span>',

    TPL_ALPHA_THUMB = '<span class="' + CSS_ALPHA_THUMB + '"><span class="' + CSS_ALPHA_THUMB_IMAGE + '"></span></span>',

    TPL_RESULT_VIEW = '<div class="' + CSS_RESULT_VIEW + '"></div>',

    TPL_LABEL_VALUE_CONTAINER =
        '<div class="' + CSS_LABEL_VALUE_CONTAINER + ' {subClass}"></div>',

    TPL_LABEL_VALUE =
        '<div class="' + CSS_LABEL_VALUE + '{classSuffix}">' +
            '<label class="' + CSS_LABEL + '">{label}</label>' +
            '<input class="' + CSS_VALUE + '" type="text" maxlength="{maxlength}" value={value}>' +
            '<label class="' + CSS_LABEL + '">{labelUnit}</label>' +
        '</div>',

    TPL_INPUT =
        '<input class="' + CSS_VALUE + '" maxlength="{maxlength}" type="text">';

var HSVAPalette = A.Base.create(NAME, A.Widget, [], {
    initializer: function() {
        var instance = this;

        instance.onceAfter('render', instance._createSliders, instance);
    },

    bindUI: function() {
        var instance = this;

        instance._hsContainer.after('mousedown', instance._afterPaletteMousedown, instance);

        instance._bindDD();
    },

    destroy: function() {
        var instance = this;

        instance._dd.destroy();
    },

    renderUI: function() {
        var instance = this;

        instance._renderContainer();

        instance.get('contentBox').appendChild(instance._paletteContainer);

        instance._colorThumbGutter = Math.floor(instance._colorThumb.get('offsetHeight') / 2);

        instance._hsContainerWidth = instance._hsContainer.get('clientWidth');
        instance._hsContainerHeight = instance._hsContainer.get('clientHeight');
    },

    _afterHSThumbChange: function(x, y) {
        var instance = this;

        var hue = instance._calculateHue(x);
        var saturation = instance._calculateSaturation(y);
        var value = instance._getFieldValue(instance._vContainer);
        var alpha = instance._getFieldValue(instance._aContainer);

        var rgbColor = instance._calculateRGB(hue, saturation, value, alpha);
        var rgbColorArray = AColor.toArray(rgbColor);
        var hexColor = AColor.toHex(rgbColor);

        instance._setFieldValue(instance._hContainer, Math.round(hue));
        instance._setFieldValue(instance._sContainer, Math.round(saturation));
        instance._setFieldValue(instance._rContainer, rgbColorArray[0]);
        instance._setFieldValue(instance._gContainer, rgbColorArray[1]);
        instance._setFieldValue(instance._bContainer, rgbColorArray[2]);
        instance._setFieldValue(instance._hexContainer, instance._getHexValue(hexColor, rgbColorArray[3]));

        instance._resultView.setStyle('backgroundColor', hexColor);
        instance._valueContainer.setStyle('backgroundColor', hexColor);
        instance._alphaContainer.setStyle('backgroundColor', hexColor);
    },

    _afterPaletteMousedown: function(event) {
        var instance = this;

        instance._updatePaletteThumbPosition([event.pageX, event.pageY]);

        var hsContainerXY = instance._hsContainer.getXY();

        var thumbXY = instance._colorThumb.getXY();

        var x = (thumbXY[0] - hsContainerXY[0] + instance._colorThumbGutter);
        var y = (thumbXY[1] - hsContainerXY[1] + instance._colorThumbGutter);

        instance._afterHSThumbChange(x, y);
    },

    _afterPaletteDragStart: function() {
        var instance = this;

        instance._setHSContainerXY();
    },

    _afterPaletteThumbDrag: function(event) {
        var instance = this;

        var x = (event.pageX - instance._hsContainerXY[0] + instance._colorThumbGutter);
        var y = (event.pageY - instance._hsContainerXY[1] + instance._colorThumbGutter);

        instance._afterHSThumbChange(x, y);
    },

    _bindDD: function() {
        var instance = this;

        var dd = new A.DD.Drag({
            node: instance._colorThumb
        }).plug(A.Plugin.DDConstrained, {
            constrain2node: instance._hsContainer,
            gutter: '-' + instance._colorThumbGutter
        });

        dd.after('start', instance._afterPaletteDragStart, instance);
        dd.after('drag', instance._afterPaletteThumbDrag, instance);

        instance._dd = dd;
    },

    _calculateHue: function(x) {
        var instance = this;

        var hue;

        if (x <= 0) {
            hue = 0;
        }
        else if (x >= instance._hsContainerWidth) {
            hue = 360;
        }
        else {
            hue = x / instance._hsContainerWidth * 360;
        }

        return hue;
    },

    _calculateRGB: function(hue, saturation, value, alpha) {
        var rgbColor = 'rgb(255, 0, 0)';

        if (hue !== 360 || parseInt(saturation, 10) !== 100 || parseInt(value, 10) !== 100) {
            var hsvaColor = 'hsva(' + (hue === 360 ? 359 : hue) + ', ' + saturation + '%, ' + value + '%, ' + alpha + ')';

            rgbColor = AColor.toRGBA(hsvaColor);
        }

        return rgbColor;
    },

    _calculateSaturation: function(y) {
        var instance = this;

        var saturation;

        if (y <= 0) {
            saturation = 100;
        }
        else if (y >= instance._hsContainerHeight) {
            saturation = 0;
        }
        else {
            saturation = 100 - (y / instance._hsContainerHeight * 100);
        }

        return saturation;
    },

    _createSliders: function() {
        var instance = this;

        instance._valueContainerHeight = instance._valueContainer.get('offsetHeight');

        instance._createValueSlider();

        instance._createAlphaSlider();
    },

    _createAlphaSlider: function() {
        var instance = this;

        var contentBox = instance.get('contentBox');

        var slider = new A.Slider(
            {
                axis: 'y',
                min: 0,
                max: 255
            }
        );

        slider.RAIL_TEMPLATE = TPL_ALPHA_CANVAS;
        slider.THUMB_TEMPLATE = TPL_ALPHA_THUMB;

        slider.render(instance._alphaContainer);

        var alphaThumbHeight = contentBox.one(DOT + CSS_ALPHA_THUMB_IMAGE).get('offsetHeight');

        slider.set(
            'length',
            instance._valueContainerHeight + (alphaThumbHeight / 2)
        );

        slider.on('valueChange', instance._onAlphaChange, instance);

        instance._alphaSlider = slider;
    },

    _createValueSlider: function() {
        var instance = this;

        var contentBox = instance.get('contentBox');

        var slider = new A.Slider(
            {
                axis: 'y',
                min: 0,
                max: 100
            }
        );

        slider.RAIL_TEMPLATE = TPL_VALUE_CANVAS;
        slider.THUMB_TEMPLATE = TPL_VALUE_THUMB;

        slider.render(instance._valueContainer);

        var valueThumbHeight = contentBox.one(DOT + CSS_VALUE_THUMB_IMAGE).get('offsetHeight');

        slider.set(
            'length',
            instance._valueContainerHeight + (valueThumbHeight / 2)
        );

        slider.on('valueChange', instance._onValueChange, instance);

        instance._valueSlider = slider;
    },

    _getFieldValue: function(fieldNode) {
        var instance = this;

        return fieldNode.one(DOT + CSS_VALUE).get('value');
    },

    _getHexValue: function(hexColor, alpha) {
        alpha = parseInt(alpha, 10).toString(16);

        if (alpha.length === 1) {
            alpha = '0' + alpha;
        }

        return (hexColor + alpha).substring(1);
    },

    _onAlphaChange: function(event) {
        var instance = this;

        var newValue = event.newVal;

        instance._resultView.setStyle('opacity', 1 - (event.newVal / 255));

        instance._setFieldValue(instance._aContainer, 255 - event.newVal);

        var hue = instance._getFieldValue(instance._hContainer);
        var saturation = instance._getFieldValue(instance._sContainer);
        var value = instance._getFieldValue(instance._vContainer);

        var rgbColor = instance._calculateRGB(hue, saturation, value, 255 - newValue);
        var rgbColorArray = AColor.toArray(rgbColor);
        var hexColor = AColor.toHex(rgbColor);

        instance._setFieldValue(instance._rContainer, rgbColorArray[0]);
        instance._setFieldValue(instance._gContainer, rgbColorArray[1]);
        instance._setFieldValue(instance._bContainer, rgbColorArray[2]);
        instance._setFieldValue(instance._hexContainer, instance._getHexValue(hexColor, rgbColorArray[3]));
    },

    _onValueChange: function(event) {
        var instance = this;

        var newValue = event.newVal;

        instance._hsContainer.setStyle('opacity', 1 - (newValue / 100));

        instance._setFieldValue(instance._vContainer, 100 - newValue);

        var hue = instance._getFieldValue(instance._hContainer);
        var saturation = instance._getFieldValue(instance._sContainer);
        var alpha = instance._getFieldValue(instance._aContainer);

        var rgbColor = instance._calculateRGB(hue, saturation, 100 - newValue, alpha);
        var rgbColorArray = AColor.toArray(rgbColor);
        var hexColor = AColor.toHex(rgbColor);

        instance._setFieldValue(instance._rContainer, rgbColorArray[0]);
        instance._setFieldValue(instance._gContainer, rgbColorArray[1]);
        instance._setFieldValue(instance._bContainer, rgbColorArray[2]);
        instance._setFieldValue(instance._hexContainer, instance._getHexValue(hexColor, rgbColorArray[3]));
    },

    _renderContainer: function() {
        var instance = this;

        instance._paletteContainer = A.Node.create(TPL_CONTAINER);

        instance._renderViewContainer();
    },

    _renderViewContainer: function() {
        var instance = this;

        instance._viewContainer = A.Node.create(TPL_VIEW_CONTAINER);

        instance._renderImageBackdrop();

        instance._renderHSContainer();

        instance._renderThumb();

        instance._renderValueContainer();

        instance._renderAlphaContainer();

        instance._renderResultBackdrop();

        instance._renderResultView();

        instance._renderFields();

        instance._paletteContainer.appendChild(instance._viewContainer);
    },

    _renderAlphaContainer: function() {
        var instance = this;

        instance._alphaContainer = instance._viewContainer.appendChild(
            TPL_ALPHA_CONTAINER
        );
    },

    _renderField: function(container, data) {
        var instance = this;

        return container.appendChild(
            Lang.sub(
                TPL_LABEL_VALUE,
                {
                    classSuffix: data.suffix,
                    label: data.label,
                    labelUnit: data.unit,
                    maxlength: data.maxlength,
                    value: data.value
                }
            )
        );
    },

    _renderFields: function() {
        var instance = this;

        var labelValueHSVContainer = A.Node.create(
            Lang.sub(
                TPL_LABEL_VALUE_CONTAINER,
                {
                    subClass: CSS_LABEL_VALUE_HSV_CONTAINER
                }
            )
        );

        var labelValueRGBContainer = A.Node.create(
            Lang.sub(
                TPL_LABEL_VALUE_CONTAINER,
                {
                    subClass: CSS_LABEL_VALUE_RGB_CONTAINER
                }
            )
        );

        var labelValueHexContainer = A.Node.create(
            Lang.sub(
                TPL_LABEL_VALUE_CONTAINER,
                {
                    subClass: CSS_LABEL_VALUE_HEX_CONTAINER
                }
            )
        );

        instance._hContainer = instance._renderField(
            labelValueHSVContainer,
            {
                label: instance.get('strings').h,
                maxlength: 3,
                suffix: '-h',
                unit: '&#176;',
                value: 0
            }
        );

        instance._sContainer = instance._renderField(
            labelValueHSVContainer,
            {
                label: instance.get('strings').s,
                maxlength: 2,
                suffix: '-s',
                unit: '%',
                value: 100
            }
        );

        instance._vContainer = instance._renderField(
            labelValueHSVContainer,
            {
                label: instance.get('strings').v,
                maxlength: 2,
                suffix: '-v',
                unit: '%',
                value: 100
            }
        );

        instance._aContainer = instance._renderField(
            labelValueHSVContainer,
            {
                label: instance.get('strings').a,
                maxlength: 2,
                suffix: '-v',
                unit: '',
                value: 255
            }
        );

        instance._rContainer = instance._renderField(
            labelValueRGBContainer,
            {
                label: instance.get('strings').r,
                maxlength: 3,
                suffix: '-r',
                unit: '',
                value: '255'
            }
        );

        instance._gContainer = instance._renderField(
            labelValueRGBContainer,
            {
                label: instance.get('strings').g,
                maxlength: 3,
                suffix: '-g',
                unit: '',
                value: 0
            }
        );
        instance._bContainer = instance._renderField(
            labelValueRGBContainer,
            {
                label: instance.get('strings').b,
                maxlength: 3,
                suffix: '-b',
                unit: '',
                value: 0
            }
        );

        instance._hexContainer = instance._renderField(
            labelValueHexContainer, {
                suffix: '-hex',
                label: instance.get('strings').hex,
                unit: '',
                maxlength: 8,
                value: 'ff0000ff'
            }
        );

        instance._viewContainer.appendChild(labelValueHSVContainer);
        instance._viewContainer.appendChild(labelValueRGBContainer);
        instance._viewContainer.appendChild(labelValueHexContainer);

        instance._labelValueHSVContainer = labelValueHSVContainer;
        instance._labelValueRGBContainer = labelValueRGBContainer;
        instance._labelValueRGBContainer = labelValueHexContainer;
    },

    _renderImageBackdrop: function() {
        var instance = this;

        instance._hsImageBackdrop = instance._viewContainer.appendChild(
            TPL_IMAGE_BACKDROP
        );
    },

    _renderHSContainer: function() {
        var instance = this;

        instance._hsContainer = instance._viewContainer.appendChild(
            TPL_HS_CONTAINER
        );
    },

    _renderValueContainer: function() {
        var instance = this;

        instance._valueContainer = instance._viewContainer.appendChild(
            TPL_VALUE_CONTAINER
        );
    },

    _renderResultBackdrop: function() {
        var instance = this;

        instance._resultViewBackdrop = instance._viewContainer.appendChild(
            TPL_VIEW_BACKDROP
        );
    },

    _renderResultView: function() {
        var instance = this;

        instance._resultView = instance._viewContainer.appendChild(
            TPL_RESULT_VIEW
        );
    },

    _renderThumb: function() {
        var instance = this;

        instance._colorThumb = instance._viewContainer.appendChild(
            TPL_HS_THUMB
        );
    },

    _setHSContainerXY: function() {
        var instance = this;

        instance._hsContainerXY = instance._hsContainer.getXY();
    },

    _setFieldValue: function(fieldNode, value) {
        var instance = this;

        fieldNode.one(DOT + CSS_VALUE).set('value', value);
    },

    _updatePaletteThumbPosition: function(xy) {
        var instance = this;

        instance._colorThumb.setXY([xy[0] - instance._colorThumbGutter, xy[1] - instance._colorThumbGutter]);
    }
}, {
    CSS_PREFIX: getClassName(NAME),

    ATTRS: {
        strings: {
            value: {
                a: 'A',
                b: 'B',
                g: 'G',
                h: 'H',
                r: 'R',
                hex: 'Hex',
                s: 'S',
                v: 'V'
            }
        }
    },

    NAME: NAME,

    NS: NAME
});

A.HSVAPalette = HSVAPalette;