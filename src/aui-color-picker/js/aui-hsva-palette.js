/* global A*/

var Lang = A.Lang,
    AColor = A.Color,
    ADo = A.Do,
    AWidget = A.Widget,

    NAME = 'hsva-palette',

    getClassName = A.getClassName,

    CSS_CONTAINER_ALPHA = getClassName('hsv-container-alpha'),

    CSS_ALPHA_CANVAS = getClassName('hsv-alpha-canvas'),
    CSS_ALPHA_SLIDER_CONTAINER = getClassName('hsv-alpha-slider-container'),
    CSS_ALPHA_THUMB = getClassName('hsv-alpha-thumb'),
    CSS_ALPHA_THUMB_IMAGE = getClassName('hsv-alpha-image'),

    REGEX_HEX_COLOR_ALPHA = /^([a-f0-9]{6}|[a-f0-9]{8}|[a-f0-9]{3})$/i,

    DOT = '.',
    SPACE = ' ',
    STR_EMPTY = '',

    TPL_ALPHA_CANVAS = '<span class="' + CSS_ALPHA_CANVAS + '"></span>',

    TPL_ALPHA_SLIDER_CONTAINER =
        '<div class="' + CSS_ALPHA_SLIDER_CONTAINER + '"><div>',

    TPL_ALPHA_THUMB = '<span class="' + CSS_ALPHA_THUMB + '"><span class="' + CSS_ALPHA_THUMB_IMAGE + '"></span></span>';


var HSVAPalette = A.Base.create(NAME, A.HSVPalette, [], {
    initializer: function() {
        var instance = this;

        instance.set('fieldValidator.hex', REGEX_HEX_COLOR_ALPHA);

        instance.after('hsThumbChange', instance._afterHsThumbChangeFn, instance);
        instance.after('hsvaInputChange', instance._afterHSVAInputChange, instance);
    },

    _afterHsThumbChangeFn: function(event) {
        var instance = this;

        instance._alphaSliderContainer.setStyle('backgroundColor', event.hexColor);
    },

    _afterHSVAInputChange: function(event) {
        var instance = this;

        var alpha = instance._getFieldValue(instance._aContainer);

        instance._alphaSlider.set(
            'value',
            255 - alpha,
            {
                src: AWidget.UI_SRC
            }
        );

        instance._alphaSliderContainer.setStyle('backgroundColor', event.hexColor);

        instance._resultView.setStyle('opacity', alpha / 255);
    },

    _calculateRGBColor: function(hue, saturation, value) {
        var instance = this;

        var alpha = 255 - instance._alphaSlider.get('value');

        return instance._calculateRGBA(hue, saturation, value, alpha);
    },

    _calculateRGBA: function(hue, saturation, value, alpha) {
        var rgbColor = 'rgb(255, 0, 0, 0)';

        if (hue !== 360 || parseInt(saturation, 10) !== 100 || parseInt(value, 10) !== 100) {
            var hsvColor = 'hsva(' + (hue === 360 ? 359 : hue) + ', ' + saturation + '%, ' + value + '%, ' + alpha + ')';

            rgbColor = AColor.toRGBA(hsvColor);

            // fix YUI bug on getting alpha - if it is 0, they return 1
            if (parseInt(alpha, 10) === 0) {
                var tmp = AColor.toArray(rgbColor);

                tmp[3] = '0';

                rgbColor = AColor.fromArray(tmp, 'RGBA');
            }
        }

        return rgbColor;
    },

    _getContainerClassName: function() {
        var instance = this;

        var className = A.HSVAPalette.superclass._getContainerClassName.call(instance);

        className += SPACE + CSS_CONTAINER_ALPHA;

        return className;
    },

    _getHexValue: function(hexColor, rgbColorArray) {
        // YUI doesn't have toRGBA method, we have to add alpha explicitly
        var alpha = parseInt(rgbColorArray[3], 10).toString(16);

        if (alpha.length === 1) {
            alpha = '0' + alpha;
        }

        var result = hexColor + alpha;

        return result.substring(1);
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

    _createSliders: function() {
        var instance = this;

        A.HSVAPalette.superclass._createSliders.call(instance);

        instance._createAlphaSlider();
    },

    _getHexContainerConfig: function() {
        var instance = this;

        return {
            label: instance.get('strings').hex,
            maxlength: 8,
            suffix: '-hex',
            type: 'hex',
            unit: STR_EMPTY,
            value: 'ff0000ff'
        };
    },

    _onAlphaChange: function(event) {
        var instance = this;

        if (event.src !== AWidget.UI_SRC) {
            var alpha = event.newVal;

            instance._resultView.setStyle('opacity', 1 - (alpha / 255));

            var thumbXY = instance._colorThumb.getXY();

            var x = (thumbXY[0] - instance._hsContainerXY[0] + instance._colorThumbGutter);
            var y = (thumbXY[1] - instance._hsContainerXY[1] + instance._colorThumbGutter);

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

    _renderAlphaSliderContainer: function() {
        var instance = this;

        instance._alphaSliderContainer = instance._viewContainer.appendChild(
            TPL_ALPHA_SLIDER_CONTAINER
        );
    },

    _renderFields: function() {
        var instance = this;

        A.HSVAPalette.superclass._renderFields.call(instance);

        instance._aContainer = instance._renderField(
            instance._labelValueHSVContainer,
            {
                label: instance.get('strings').a,
                maxlength: 3,
                suffix: '-v',
                type: 'alpha',
                unit: STR_EMPTY,
                value: 255
            }
        );
    },

    _renderViewContainerContent: function() {
        var instance = this;

        A.HSVAPalette.superclass._renderViewContainerContent.call(instance);

        instance._renderAlphaSliderContainer();
    }
}, {
    NAME: NAME,

    NS: NAME
});

A.HSVAPalette = HSVAPalette;