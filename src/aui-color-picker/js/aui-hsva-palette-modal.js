/* global A*/

var AArray = A.Array,
    Lang = A.Lang,

    getClassName = A.getClassName,

    CSS_HSV_PALETTE_MODAL = getClassName('hsv-palette-modal'),

    NAME = 'hsv-palette-modal',

HSVAPaletteModal = A.Base.create(NAME, A.Modal, [], {
    initializer: function () {
        var instance = this;

        instance.after('render', instance._renderHSVAPalette, instance);
    },

    _renderHSVAPalette: function () {
        var instance = this,
            body,
            contentBox,
            hsvClass,
            hsvOptions,
            useAlpha;

        contentBox = instance.get('contentBox');

        hsvOptions = instance.get('hsv');

        useAlpha = hsvOptions.alpha;

        hsvClass = A.HSVPalette;

        if (useAlpha) {
            hsvClass = A.HSVAPalette;
        }

        contentBox.addClass(CSS_HSV_PALETTE_MODAL);

        body = instance.getStdModNode(A.WidgetStdMod.BODY);

        instance._hsvPalette = new hsvClass(hsvOptions).render(body);

        if (instance.get('centered')) {
            instance.align();
        }
    }
}, {
    ATTRS: {
        hsv: {
            validator: Lang.isObject,
            value: {
                alpha: false
            }
        }
    },

    CSS_PREFIX: getClassName(NAME),

    NAME: NAME,

    NS: NAME
});

A.HSVAPaletteModal = HSVAPaletteModal;