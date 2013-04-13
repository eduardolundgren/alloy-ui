/* global A*/

var AArray = A.Array,
    AColor = A.Color,
    Lang = A.Lang,

    getClassName = A.getClassName,

    DOT = '.',

    CSS_CONTAINER = getClassName('hsva-container'),

    CSS_VIEW_CONTAINER = getClassName('hsva-view-container'),

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
            '<input class="' + CSS_VALUE + '" type="text" maxlength="{maxlength}">' +
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

    _afterPaletteMousedown: function(event) {
        var instance = this;

        instance._updatePaletteThumbPosition([event.pageX, event.pageY]);

        event.target = instance._colorThumb;

        instance._dd.fire('drag:mouseDown', { ev: event });
    },

    _afterPaletteDragStart: function() {
        var instance = this;

        instance._setHSContainerXY();
    },

    _afterPaletteThumbDrag: function(event) {
        var instance = this;

        console.log('after drag');

        var x = (event.pageX - instance._hsContainerXY[0] + instance._colorThumbGutter);
        var y = (event.pageY - instance._hsContainerXY[1] + instance._colorThumbGutter);

        var hue = instance._calculateHue(x);
        var saturation = instance._calculateSaturation(y);
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
                max: 100
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

        instance._valueSlider = slider;
    },

    _renderContainer: function() {
        var instance = this;

        instance._paletteContainer = A.Node.create(TPL_CONTAINER);

        instance._renderViewContainer();
    },

    _renderViewContainer: function() {
        var instance = this;

        instance._viewContainer = A.Node.create(TPL_VIEW_CONTAINER);

        instance._renderHSContainer();

        instance._renderThumb();

        instance._renderValueContainer();

        instance._renderAlphaContainer();

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

    _renderField: function(container, suffix, label, unit, maxlength) {
        var instance = this;

        return container.appendChild(
            Lang.sub(
                TPL_LABEL_VALUE,
                {
                    classSuffix: suffix,
                    label: label,
                    labelUnit: unit,
                    maxlength: maxlength
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

        instance._hContainer = instance._renderField(labelValueHSVContainer, '-h', instance.get('strings').h, '&#176;', 3);
        instance._sContainer = instance._renderField(labelValueHSVContainer, '-s', instance.get('strings').s, '%', 2);
        instance._vContainer = instance._renderField(labelValueHSVContainer, '-v', instance.get('strings').v, '%', 2);
        instance._aContainer = instance._renderField(labelValueHSVContainer, '-v', instance.get('strings').a, '%', 2);

        instance._rContainer = instance._renderField(labelValueRGBContainer, '-r', instance.get('strings').r, '', 3);
        instance._gContainer = instance._renderField(labelValueRGBContainer, '-g', instance.get('strings').g, '', 3);
        instance._bContainer = instance._renderField(labelValueRGBContainer, '-b', instance.get('strings').b, '', 3);

        instance._resultContainer = instance._renderField(labelValueHexContainer, '-hex', instance.get('strings').hex, '', 6);

        instance._viewContainer.appendChild(labelValueHSVContainer);
        instance._viewContainer.appendChild(labelValueRGBContainer);
        instance._viewContainer.appendChild(labelValueHexContainer);

        instance._labelValueHSVContainer = labelValueHSVContainer;
        instance._labelValueRGBContainer = labelValueRGBContainer;
        instance._labelValueRGBContainer = labelValueHexContainer;
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

    _renderResultView: function() {
        var instance = this;

        instance._resultContainer = instance._viewContainer.appendChild(
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