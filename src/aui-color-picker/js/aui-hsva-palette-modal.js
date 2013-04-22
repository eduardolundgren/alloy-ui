/* global A*/

var AArray = A.Array,
    Lang = A.Lang,

    getClassName = A.getClassName,

    CSS_HSV_PALETTE_MODAL = getClassName('hsv-palette-modal'),

    NAME = 'hsv-palette-modal',

HSVAPaletteModal = A.Base.create(NAME, A.Modal, [], {
    renderUI: function () {
        var instance = this,
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

        contentBox = instance.get('contentBox');

        contentBox.addClass(CSS_HSV_PALETTE_MODAL);

        instance._hsvPalette = new hsvClass(hsvOptions).render(contentBox);
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