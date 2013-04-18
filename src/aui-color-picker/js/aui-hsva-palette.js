/* global A*/

var Lang = A.Lang,
    ADo = A.Do,

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
    },

    _getContainerClassName: function() {
        var instance = this;

        var className = A.HSVAPalette.superclass._getContainerClassName.call(instance);

        className += SPACE + CSS_CONTAINER_ALPHA;

        return className;
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

    _renderAlphaSliderContainer: function() {
        var instance = this;

        instance._alphaSliderContainer = instance._viewContainer.appendChild(
            TPL_ALPHA_SLIDER_CONTAINER
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