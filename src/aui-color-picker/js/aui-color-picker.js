/* global A*/

var AArray = A.Array,
    Lang = A.Lang,

    getClassName = A.getClassName,

    CSS_HSV_TRIGGER = getClassName('hsv-trigger'),
    CSS_HSV_TRIGGER_CONTAINER = getClassName('hsv-trigger-container'),

    NAME = 'color-picker',

    TPL_HEADER_CONTENT = '<h3>{header}</h3>',

    TPL_HSV_TRIGGER =
        '<div class="' + CSS_HSV_TRIGGER_CONTAINER + '">' +
            '<span class="' + CSS_HSV_TRIGGER + '">{custom}</span>' +
        '</div',

ColorPicker = A.Base.create(NAME, A.Widget, [], {
    initializer: function () {
        var instance = this;

    },

    bindUI: function () {
        var instance = this,
            renderHSVPalette;

        renderHSVPalette = instance.get('renderHSVPalette');

        if (renderHSVPalette) {
            instance._hsvTrigger.on('click', instance._onHSVTriggerClick, instance);
        }
    },

    renderUI: function () {
        var instance = this,
            renderColorPalette,
            renderHSVPalette;

        renderColorPalette = instance.get('renderColorPalette');

        if (renderColorPalette) {
            instance._renderColorPalette();
        }

        renderHSVPalette = instance.get('renderHSVPalette');

        if (renderHSVPalette) {
            instance._renderHSVTrigger();
        }

        instance._renderRecentColors();
    },

    _getHSVPalette: function () {
        var instance = this,
            contentBox,
            strings;

        if (!instance._hsvPalette) {
            contentBox = instance.get('contentBox');

            strings = instance.get('strings');

            instance._hsvPalette = new A.HSVAPaletteModal(
                {
                    headerContent: Lang.sub(
                        TPL_HEADER_CONTENT,
                        {
                            header: strings.header
                        }
                    ),
                    hsv: instance.get('hsv'),
                    modal: true,
                    toolbars: [
                        {
                            label: strings.cancel,
                            on: {
                                click: function() {
                                    instance._hsvPalette.hide();
                                }
                            }
                        },
                        {
                            label: strings.ok,
                            on: {
                                click: function() {
                                    instance._hsvPalette.hide();
                                }
                            },
                            primary: true
                        }
                    ]
                }
            ).render();
        }

        return instance._hsvPalette;
    },

    _onHSVTriggerClick: function() {
        var instance = this,
            hsvPalette;

        hsvPalette = instance._getHSVPalette();

        hsvPalette.show();
    },

    _renderColorPalette: function () {
        var instance = this,
            colorPaletteOptions,
            contentBox;

        contentBox = instance.get('contentBox');

        instance._colorPalette = new A.ColorPalette(colorPaletteOptions).render(contentBox);
    },

    _renderHSVTrigger: function () {
        var instance = this,
            contentBox,
            strings;

        contentBox = instance.get('contentBox');

        strings = instance.get('strings');

        instance._hsvTrigger = contentBox.appendChild(
            Lang.sub(
                TPL_HSV_TRIGGER,
                {
                    custom: strings.custom
                }
            )
        );
    },

    _renderRecentColors: function () {
        var instance = this;

    }
}, {
    ATTRS: {
        renderColorPalette: {
            validator: Lang.isBoolean,
            value: true
        },

        renderHSVPalette: {
            validator: Lang.isBoolean,
            value: true
        },

        hsv: {
            validator: Lang.isObject,
            value: {
                alpha: false
            }
        },

        color: {
            validator: Lang.isObject
        },

        strings: {
            value: {
                cancel: 'Cancel',
                custom: 'Custom...',
                header: 'Choose custom color',
                ok: 'Ok'
            }
        }
    },

    CSS_PREFIX: getClassName(NAME),

    NAME: NAME,

    NS: NAME
});

A.ColorPicker = ColorPicker;