/* global A*/

var AArray = A.Array,
    AColor = A.Color,
    AWidget = A.Widget,
    Lang = A.Lang,

    getClassName = A.getClassName,

    DOT = '.',

    CSS_CONTAINER = getClassName('hsva-container'),
    CSS_CONTAINER_ALPHA = getClassName('hsva-container-alpha'),
    CSS_CONTAINER_CONTROLS = getClassName('hsva-container-controls'),

    CSS_VIEW_CONTAINER = getClassName('hsva-view-container'),

    CSS_HS_IMAGE_BACKDROP = getClassName('hsva-image-backdrop'),
    CSS_HS_VIEW_BACKDROP = getClassName('hsva-view-backdrop'),

    CSS_HS_CONTAINER = getClassName('hsva-hs-container'),
    CSS_HS_THUMB = getClassName('hsva-hs-thumb'),

    CSS_VALUE_SLIDER_CONTAINER = getClassName('hsva-value-slider-container'),

    CSS_VALUE_CANVAS = getClassName('hsva-value-canvas'),
    CSS_VALUE_THUMB = getClassName('hsva-value-thumb'),
    CSS_VALUE_THUMB_IMAGE = getClassName('hsva-value-image'),

    CSS_ALPHA_SLIDER_CONTAINER = getClassName('hsva-alpha-slider-container'),
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

    STR_EMPTY = '',

    REGEX_HEX_COLOR = /^([a-f0-9]{6}|[a-f0-9]{3})$/i,

    REGEX_HEX_COLOR_ALPHA = /^([a-f0-9]{6}|[a-f0-9]{8}|[a-f0-9]{3})$/i,

    REGEX_RANGE_0_100 = /^([0-9]|[1-9][0-9]|100)$/,

    REGEX_RANGE_0_255 = /^([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/,

    REGEX_RANGE_0_360 = /^([0]{0,2}[1-9]|[0]?[1-9][0-9]|[12][0-9][0-9]|3[0-5][0-9]|360)$/,

    MAP_FIELDS_REGEX = {
        alpha: REGEX_RANGE_0_255,
        b: REGEX_RANGE_0_255,
        g: REGEX_RANGE_0_255,
        hex: REGEX_HEX_COLOR,
        hue: REGEX_RANGE_0_360,
        r: REGEX_RANGE_0_255,
        saturation: REGEX_RANGE_0_100,
        value: REGEX_RANGE_0_100
    },

    TPL_CONTAINER =
        '<div class="' + CSS_CONTAINER + ' {subClass}"><div>',

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

    TPL_VALUE_SLIDER_CONTAINER =
        '<div class="' + CSS_VALUE_SLIDER_CONTAINER + '"><div>',

    TPL_VALUE_CANVAS = '<span class="' + CSS_VALUE_CANVAS + '"></span>',

    TPL_VALUE_THUMB = '<span class="' + CSS_VALUE_THUMB + '"><span class="' + CSS_VALUE_THUMB_IMAGE + '"></span></span>',

    TPL_ALPHA_SLIDER_CONTAINER =
        '<div class="' + CSS_ALPHA_SLIDER_CONTAINER + '"><div>',

    TPL_ALPHA_CANVAS = '<span class="' + CSS_ALPHA_CANVAS + '"></span>',

    TPL_ALPHA_THUMB = '<span class="' + CSS_ALPHA_THUMB + '"><span class="' + CSS_ALPHA_THUMB_IMAGE + '"></span></span>',

    TPL_RESULT_VIEW = '<div class="' + CSS_RESULT_VIEW + '"></div>',

    TPL_LABEL_VALUE_CONTAINER =
        '<div class="' + CSS_LABEL_VALUE_CONTAINER + ' {subClass}"></div>',

    TPL_LABEL_VALUE =
        '<div class="aui-control-group ' + CSS_LABEL_VALUE + '{classSuffix}">' +
            '<label class="control-label ' + CSS_LABEL + '">{label}</label>' +
            '<div class="controls">' +
                '<input class="' + CSS_VALUE + '" data-type="{type}" type="text" maxlength="{maxlength}" value="{value}">' +
            '</div>' +
            '<label class="' + CSS_LABEL + '">{labelUnit}</label>' +
        '</div>',

    TPL_INPUT =
        '<div class="aui-control-group">' +
            '<div class="controls">' +
                '<input class="' + CSS_VALUE + '" maxlength="{maxlength}" type="text">' +
            '</div>' +
        '</div>';

var HSVPalette = A.Base.create(NAME, A.Widget, [], {
    initializer: function() {
        var instance = this;

        instance.onceAfter('render', instance._createSliders, instance);

        var useAlpha = instance.get('alpha');

        if (useAlpha) {
            MAP_FIELDS_REGEX.hex = REGEX_HEX_COLOR_ALPHA;
        }
    },

    bindUI: function() {
        var instance = this;

        instance._hsContainer.after('mousedown', instance._afterPaletteMousedown, instance);

        instance._paletteContainer.delegate('input', instance._afterInputChange, '.aui-hsva-value', instance);

        instance._bindDD();
    },

    destructor: function() {
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

    _afterInputChange: function(event) {
        var instance = this;

        var fieldNode = event.currentTarget;

        var type;

        if (instance._validateFieldValue(fieldNode)) {
            var value = fieldNode.get('value');

            type = fieldNode.getAttribute('data-type');

            fieldNode.ancestor('.aui-control-group').removeClass('aui-error');
        }
        else {
            fieldNode.ancestor('.aui-control-group').addClass('aui-error');
        }

        if (!instance._paletteContainer.one('.aui-control-group.aui-error')) {
            instance._updateViewFromInput(fieldNode);
        }
    },

    _afterHSThumbChange: function(x, y) {
        var instance = this;

        var hue = instance._calculateHue(x);
        var saturation = instance._calculateSaturation(y);
        var value = 100 - instance._valueSlider.get('value');

        var alpha;

        var rgbColor;

        var useAlpha = instance.get('alpha');

        if (useAlpha) {
            alpha = 255 - instance._alphaSlider.get('value');

            rgbColor = instance._calculateRGBA(hue, saturation, value, alpha);
        }
        else {
            rgbColor = instance._calculateRGB(hue, saturation, value);
        }

        var rgbColorArray = AColor.toArray(rgbColor);
        var hexColor = AColor.toHex(rgbColor);
        var alphaValue = useAlpha ? rgbColorArray[3] : null;
        var hexValue = instance._getHexValue(hexColor, alphaValue);

        instance._resultView.setStyle('backgroundColor', hexColor);
        instance._valueSliderContainer.setStyle('backgroundColor', hexColor);

        if (useAlpha) {
            instance._alphaSliderContainer.setStyle('backgroundColor', hexColor);
        }

        instance._setFieldValue(instance._hexContainer, hexValue);

        if (instance.get('controls')) {
            instance._setFieldValue(instance._hContainer, Math.round(hue));
            instance._setFieldValue(instance._sContainer, Math.round(saturation));
            instance._setFieldValue(instance._rContainer, rgbColorArray[0]);
            instance._setFieldValue(instance._gContainer, rgbColorArray[1]);
            instance._setFieldValue(instance._bContainer, rgbColorArray[2]);
        }
    },

    _afterPaletteMousedown: function(event) {
        var instance = this;

        instance._updatePaletteThumbPosition([event.pageX, event.pageY]);

        var hsContainerXY = instance._hsContainer.getXY();

        var thumbXY = instance._colorThumb.getXY();

        var x = (thumbXY[0] - hsContainerXY[0] + instance._colorThumbGutter);
        var y = (thumbXY[1] - hsContainerXY[1] + instance._colorThumbGutter);

        instance._afterHSThumbChange(x, y);

        event.target = instance._colorThumb;

        instance._dd._handleMouseDownEvent(event);
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

    _calculateRGB: function(hue, saturation, value) {
        var rgbColor = 'rgb(255, 0, 0)';

        if (hue !== 360 || parseInt(saturation, 10) !== 100 || parseInt(value, 10) !== 100) {
            var hsvColor = 'hsva(' + (hue === 360 ? 359 : hue) + ', ' + saturation + '%, ' + value + '%' + ')';

            rgbColor = AColor.toRGB(hsvColor);
        }

        return rgbColor;
    },

    _calculateRGBA: function(hue, saturation, value, alpha) {
        var rgbColor = 'rgb(255, 0, 0, 0)';

        if (hue !== 360 || parseInt(saturation, 10) !== 100 || parseInt(value, 10) !== 100) {
            var hsvaColor = 'hsva(' + (hue === 360 ? 359 : hue) + ', ' + saturation + '%, ' + value + '%, ' + alpha + ')';

            rgbColor = AColor.toRGBA(hsvaColor);

            // fix YUI bug on getting alpha - if it is 0, they return 1
            if (parseInt(alpha, 10) === 0) {
                var tmp = AColor.toArray(rgbColor);

                tmp[3] = '0';

                rgbColor = AColor.fromArray(tmp, 'RGBA');
            }
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

    _calculateX: function(hue) {
        var instance = this;

        var x;

        if (hue <= 0) {
            x = 0;
        }
        else if (hue >= 360) {
            x = instance._hsContainerWidth;
        }
        else {
            x = hue / 360 * instance._hsContainerWidth;
        }

        return x;
    },

    _calculateY: function(saturation) {
        var instance = this;

        var y;

        if (saturation <= 0) {
            y = instance._hsContainerHeight;
        }
        else if (saturation >= 100) {
            y = 0;
        }
        else {
            y = instance._hsContainerHeight / 100 * (100 - saturation);
        }

        return y;
    },

    _createSliders: function() {
        var instance = this;

        instance._valueSliderContainerHeight = instance._valueSliderContainer.get('offsetHeight');

        instance._createValueSlider();

        if (instance.get('alpha')) {
            instance._createAlphaSlider();
        }
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

        slider.render(instance._alphaSliderContainer);

        var alphaThumbHeight = contentBox.one(DOT + CSS_ALPHA_THUMB_IMAGE).get('offsetHeight');

        slider.set(
            'length',
            instance._valueSliderContainerHeight + (alphaThumbHeight / 2)
        );

        slider.on(['slideStart', 'railMouseDown'], instance._setHSContainerXY, instance);

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

        slider.render(instance._valueSliderContainer);

        var valueThumbHeight = contentBox.one(DOT + CSS_VALUE_THUMB_IMAGE).get('offsetHeight');

        slider.set(
            'length',
            instance._valueSliderContainerHeight + (valueThumbHeight / 2)
        );

        slider.on(['slideStart', 'railMouseDown'], instance._setHSContainerXY, instance);

        slider.on('valueChange', instance._onValueChange, instance);

        instance._valueSlider = slider;
    },

    _getFieldValue: function(fieldNode) {
        var instance = this;

        return fieldNode.one(DOT + CSS_VALUE).get('value');
    },

    _getHexValue: function(hexColor, alpha) {
        var result = hexColor;

        if (Lang.isValue(alpha)) {
            // YUI don't have toRGBA method, we have to add alpha explicitly
            alpha = parseInt(alpha, 10).toString(16);

            if (alpha.length === 1) {
                alpha = '0' + alpha;
            }

            result = hexColor + alpha;
        }

        return result.substring(1);
    },

    _getXYFromHueSaturation: function(hue, saturation) {
        var instance = this;

        var x = instance._calculateX(hue);

        var y = instance._calculateY(saturation);

        return [x,y];
    },

    _onAlphaChange: function(event) {
        var instance = this;

        if (event.src !== AWidget.UI_SRC) {
            var alpha = event.newVal;

            instance._resultView.setStyle('opacity', 1 - (alpha / 255));

            var thumbXY = instance._colorThumb.getXY();

            var x = 150;//(thumbXY[0] - instance._hsContainerXY[0] + instance._colorThumbGutter);
            var y = 60;//(thumbXY[1] - instance._hsContainerXY[1] + instance._colorThumbGutter);

            var hue = instance._calculateHue(x);
            var saturation = instance._calculateSaturation(y);
            var value = 100 - instance._valueSlider.get('value');

            var rgbColor = instance._calculateRGBA(hue, saturation, value, 255 - alpha);
            var rgbColorArray = AColor.toArray(rgbColor);
            var hexValue = instance._getHexValue(AColor.toHex(rgbColor), rgbColorArray[3]);

            instance._setFieldValue(instance._hexContainer, hexValue);

            if (instance.get('controls')) {
                instance._setFieldValue(instance._aContainer, 255 - alpha);
                instance._setFieldValue(instance._rContainer, rgbColorArray[0]);
                instance._setFieldValue(instance._gContainer, rgbColorArray[1]);
                instance._setFieldValue(instance._bContainer, rgbColorArray[2]);
            }
        }
    },

    _onValueChange: function(event) {
        var instance = this;

        if (event.src !== AWidget.UI_SRC) {
            var val = event.newVal;

            instance._hsContainer.setStyle('opacity', 1 - (val / 100));

            var thumbXY = instance._colorThumb.getXY();

            var x = (thumbXY[0] - instance._hsContainerXY[0] + instance._colorThumbGutter);
            var y = (thumbXY[1] - instance._hsContainerXY[1] + instance._colorThumbGutter);

            var hue = instance._calculateHue(x);
            var saturation = instance._calculateSaturation(y);

            var useAlpha = instance.get('alpha');

            var alpha;

            if (useAlpha) {
                alpha = 255 - instance._alphaSlider.get('value');
            }

            var rgbColor;

            if (useAlpha) {
                rgbColor = instance._calculateRGBA(hue, saturation, 100 - val, alpha);
            }
            else {
                rgbColor = instance._calculateRGB(hue, saturation, 100 - val);
            }

            var rgbColorArray = AColor.toArray(rgbColor);

            var alphaValue = useAlpha ? rgbColorArray[3] : null;

            var hexValue = instance._getHexValue(AColor.toHex(rgbColor), alphaValue);

            instance._setFieldValue(instance._hexContainer, hexValue);

            if (instance.get('controls')) {
                instance._setFieldValue(instance._vContainer, 100 - val);
                instance._setFieldValue(instance._rContainer, rgbColorArray[0]);
                instance._setFieldValue(instance._gContainer, rgbColorArray[1]);
                instance._setFieldValue(instance._bContainer, rgbColorArray[2]);
            }
        }
    },

    _renderContainer: function() {
        var instance = this;

        var subClass = [];

        if (instance.get('controls')) {
            subClass.push(CSS_CONTAINER_CONTROLS);
        }

        if (instance.get('alpha')) {
            subClass.push(CSS_CONTAINER_ALPHA);
        }

        instance._paletteContainer = A.Node.create(
            Lang.sub(
                TPL_CONTAINER,
                {
                    subClass: subClass.join(' ')
                }
            )
        );

        instance._renderViewContainer();
    },

    _renderViewContainer: function() {
        var instance = this;

        instance._viewContainer = A.Node.create(TPL_VIEW_CONTAINER);

        instance._renderImageBackdrop();

        instance._renderHSContainer();

        instance._renderThumb();

        instance._renderValueSliderContainer();

        if (instance.get('alpha')) {
            instance._renderAlphaSliderContainer();
        }

        instance._renderResultBackdrop();

        instance._renderResultView();

        if (instance.get('controls')) {
            instance._renderFields();
        }

        instance._renderHexNode();

        instance._paletteContainer.appendChild(instance._viewContainer);
    },

    _renderAlphaSliderContainer: function() {
        var instance = this;

        instance._alphaSliderContainer = instance._viewContainer.appendChild(
            TPL_ALPHA_SLIDER_CONTAINER
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
                    type: data.type,
                    value: data.value
                }
            )
        );
    },

    _renderHexNode: function() {
        var instance = this;

        var labelValueHexContainer = A.Node.create(
            Lang.sub(
                TPL_LABEL_VALUE_CONTAINER,
                {
                    subClass: CSS_LABEL_VALUE_HEX_CONTAINER
                }
            )
        );

        var useAlpha = instance.get('alpha');

        instance._hexContainer = instance._renderField(
            labelValueHexContainer, {
                label: instance.get('strings').hex,
                maxlength: useAlpha ? 8 : 6,
                suffix: '-hex',
                type: 'hex',
                unit: STR_EMPTY,
                value: useAlpha ? 'ff0000ff' : 'ff0000'
            }
        );

        instance._viewContainer.appendChild(labelValueHexContainer);

        instance._labelValueRGBContainer = labelValueHexContainer;
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

        instance._hContainer = instance._renderField(
            labelValueHSVContainer,
            {
                label: instance.get('strings').h,
                maxlength: 3,
                suffix: '-h',
                type: 'hue',
                unit: '&#176;',
                value: 0
            }
        );

        instance._sContainer = instance._renderField(
            labelValueHSVContainer,
            {
                label: instance.get('strings').s,
                maxlength: 3,
                suffix: '-s',
                type: 'saturation',
                unit: '%',
                value: 100
            }
        );

        instance._vContainer = instance._renderField(
            labelValueHSVContainer,
            {
                label: instance.get('strings').v,
                maxlength: 3,
                suffix: '-v',
                type: 'value',
                unit: '%',
                value: 100
            }
        );

        if (instance.get('alpha')) {
            instance._aContainer = instance._renderField(
                labelValueHSVContainer,
                {
                    label: instance.get('strings').a,
                    maxlength: 3,
                    suffix: '-v',
                    type: 'alpha',
                    unit: STR_EMPTY,
                    value: 255
                }
            );
        }

        instance._rContainer = instance._renderField(
            labelValueRGBContainer,
            {
                label: instance.get('strings').r,
                maxlength: 3,
                suffix: '-r',
                type: 'r',
                unit: STR_EMPTY,
                value: '255'
            }
        );

        instance._gContainer = instance._renderField(
            labelValueRGBContainer,
            {
                label: instance.get('strings').g,
                maxlength: 3,
                suffix: '-g',
                type: 'g',
                unit: STR_EMPTY,
                value: 0
            }
        );
        instance._bContainer = instance._renderField(
            labelValueRGBContainer,
            {
                label: instance.get('strings').b,
                maxlength: 3,
                suffix: '-b',
                type: 'b',
                unit: STR_EMPTY,
                value: 0
            }
        );

        instance._viewContainer.appendChild(labelValueHSVContainer);
        instance._viewContainer.appendChild(labelValueRGBContainer);

        instance._labelValueHSVContainer = labelValueHSVContainer;
        instance._labelValueRGBContainer = labelValueRGBContainer;
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

    _renderValueSliderContainer: function() {
        var instance = this;

        instance._valueSliderContainer = instance._viewContainer.appendChild(
            TPL_VALUE_SLIDER_CONTAINER
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
    },

    _updateViewFromInput: function(fieldNode) {
        var instance = this;

        var type = fieldNode.getAttribute('data-type');

        if (type === 'hue' || type === 'saturation' || type === 'value' || type === 'alpha') {
            instance._updateViewByHUE();
        }
        else if(type === 'r' || type === 'g' || type === 'b') {
            instance._updateViewByRGB();
        }
        else if(type === 'hex') {
            instance._updateViewByHEX();
        }
    },

    _updateViewByHUE: function() {
        var instance = this;

        var hue = instance._getFieldValue(instance._hContainer);
        var saturation = instance._getFieldValue(instance._sContainer);
        var value = instance._getFieldValue(instance._vContainer);

        var useAlpha = instance.get('alpha');

        var alpha;

        if (useAlpha) {
            alpha = instance._getFieldValue(instance._aContainer);
        }

        var position = instance._getXYFromHueSaturation(hue, saturation);

        instance._colorThumb.setStyles(
            {
                'left': position[0],
                'top': position[1]
            }
        );

        instance._valueSlider.set(
            'value',
            100 - value,
            {
                src: AWidget.UI_SRC
            }
        );

        var rgbColor;

        if (useAlpha) {
            instance._alphaSlider.set(
                'value',
                255 - alpha,
                {
                    src: AWidget.UI_SRC
                }
            );

            rgbColor = instance._calculateRGBA(hue, saturation, value, alpha);
        }
        else {
            rgbColor = instance._calculateRGB(hue, saturation, value);
        }

        var rgbColorArray = AColor.toArray(rgbColor);
        var hexColor = AColor.toHex(rgbColor);

        var alphaValue = useAlpha ? rgbColorArray[3] : null;

        var hexValue = instance._getHexValue(hexColor, alphaValue);

        instance._resultView.setStyle('backgroundColor', hexColor);
        instance._valueSliderContainer.setStyle('backgroundColor', hexColor);

        if (useAlpha) {
            instance._alphaSliderContainer.setStyle('backgroundColor', hexColor);
        }

        instance._hsContainer.setStyle('opacity', 1 - ((100 - value) / 100));

        if (useAlpha) {
            instance._resultView.setStyle('opacity', alpha / 255);
        }

        instance._setFieldValue(instance._hexContainer, hexValue);

        if (instance.get('controls')) {
            instance._setFieldValue(instance._rContainer, rgbColorArray[0]);
            instance._setFieldValue(instance._gContainer, rgbColorArray[1]);
            instance._setFieldValue(instance._bContainer, rgbColorArray[2]);
        }
    },

    _updateViewByRGB: function(fieldNode) {
        var instance = this;

        var r = instance._getFieldValue(instance._rContainer);
        var g = instance._getFieldValue(instance._gContainer);
        var b = instance._getFieldValue(instance._bContainer);

        var useAlpha = instance.get('alpha');

        var alpha;
        var rgbArray;
        var hsv;
        var hsvArray;

        if (useAlpha) {
            alpha = instance._getFieldValue(instance._aContainer);

            rgbArray = AColor.fromArray([r, g, b, alpha], 'RGBA');

            hsv = AColor.toHSVA(rgbArray);

            hsvArray = AColor.toArray(hsv, 'HSVA');
        }
        else {
            rgbArray = AColor.fromArray([r, g, b], 'RGB');

            hsv = AColor.toHSV(rgbArray);

            hsvArray = AColor.toArray(hsv, 'HSV');
        }

        var hue = hsvArray[0];
        var saturation = hsvArray[1];
        var value = hsvArray[2];

        var rgbColor;

        if (useAlpha) {
            rgbColor = instance._calculateRGBA(hue, saturation, value, alpha);
        }
        else {
            rgbColor = instance._calculateRGB(hue, saturation, value);
        }

        var rgbColorArray = AColor.toArray(rgbColor);
        var hexColor = AColor.toHex(rgbColor);

        var alphaValue = useAlpha ? rgbColorArray[3] : null;

        var hexValue = instance._getHexValue(hexColor, alphaValue);

        var position = instance._getXYFromHueSaturation(hue, saturation);

        instance._colorThumb.setStyles(
            {
                'left': position[0],
                'top': position[1]
            }
        );

        instance._valueSlider.set(
            'value',
            100 - value,
            {
                src: AWidget.UI_SRC
            }
        );

        if (useAlpha) {
            instance._alphaSlider.set(
                'value',
                255 - alpha,
                {
                    src: AWidget.UI_SRC
                }
            );

            instance._alphaSliderContainer.setStyle('backgroundColor', hexColor);

            instance._resultView.setStyle('opacity', alpha / 255);
        }

        instance._resultView.setStyle('backgroundColor', hexColor);
        instance._valueSliderContainer.setStyle('backgroundColor', hexColor);

        instance._hsContainer.setStyle('opacity', 1 - ((100 - value) / 100));

        instance._setFieldValue(instance._hexContainer, hexValue);

        if (instance.get('controls')) {
            instance._setFieldValue(instance._hContainer, hue);
            instance._setFieldValue(instance._sContainer, saturation);
            instance._setFieldValue(instance._vContainer, value);

            if (useAlpha) {
                instance._setFieldValue(instance._aContainer, alpha);
            }
        }
    },

    _updateViewByHEX: function(fieldNode) {
        var instance = this;

        // YUI Code toHSVA from hex + alpha is broken, will remove the alpha

        var hex = instance._getFieldValue(instance._hexContainer);

        var useAlpha = instance.get('alpha');

        var padding = '';

        if (hex.length === 3) {
            if (useAlpha) {
                padding = 'fffff';
            }
            else {
                padding = 'fff';
            }
        }
        else if (useAlpha && hex.length === 6) {
            padding = 'ff';
        }

        hex += padding;

        var alpha;

        var alphaDec;

        if (useAlpha) {
            alpha = hex.substr(6, 2);

            alphaDec = parseInt(alpha, 16);
        }

        hex = hex.substr(0, 6);

        var hsvColor = AColor.toHSV(hex);
        var hsvColorArray = AColor.toArray(hsvColor, 'HSV');

        var hue = hsvColorArray[0];
        var saturation = hsvColorArray[1];
        var value = hsvColorArray[2];

        var rgb = AColor.toRGBA(hsvColor);
        var rgbColorArray = AColor.toArray(rgb);

        var r = rgbColorArray[0];
        var g = rgbColorArray[1];
        var b = rgbColorArray[2];

        var position = instance._getXYFromHueSaturation(hsvColorArray[0], hsvColorArray[1]);

        instance._colorThumb.setStyles(
            {
                'left': position[0],
                'top': position[1]
            }
        );

        instance._valueSlider.set(
            'value',
            100 - value,
            {
                src: AWidget.UI_SRC
            }
        );

        var hexColor = '#' + hex;

        if (useAlpha) {
            instance._alphaSlider.set(
                'value',
                255 - alphaDec,
                {
                    src: AWidget.UI_SRC
                }
            );

            instance._alphaSliderContainer.setStyle('backgroundColor', hexColor);
        }

        instance._resultView.setStyle('backgroundColor', hexColor);
        instance._valueSliderContainer.setStyle('backgroundColor', hexColor);

        instance._hsContainer.setStyle('opacity', 1 - ((100 - value) / 100));

        if (useAlpha) {
            instance._resultView.setStyle('opacity', alphaDec / 255);
        }

        if (instance.get('controls')) {
            instance._setFieldValue(instance._hContainer, hue);
            instance._setFieldValue(instance._sContainer, saturation);
            instance._setFieldValue(instance._vContainer, value);

            if (useAlpha) {
                instance._setFieldValue(instance._aContainer, alphaDec);
            }

            instance._setFieldValue(instance._rContainer, r);
            instance._setFieldValue(instance._gContainer, g);
            instance._setFieldValue(instance._bContainer, b);
        }
    },

    _validateFieldValue: function(fieldNode) {
        var instance = this;

        var validator = MAP_FIELDS_REGEX[fieldNode.getAttribute('data-type')];

        var result = false;

        var value = fieldNode.get('value');

        if (validator && validator.test(value)) {
            result = true;
        }

        return result;
    }
}, {
    CSS_PREFIX: getClassName(NAME),

    ATTRS: {
        alpha: {
            validator: Lang.isBoolean,
            value: true,
            writeOnce: true
        },

        controls: {
            validator: Lang.isBoolean,
            value: true,
            writeOnce: true
        },

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

A.HSVPalette = HSVPalette;