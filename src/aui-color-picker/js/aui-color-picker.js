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

            instance._renderRecentColors();
        }
    },

    _defaultValueRecentColors: function () {
        var instance = this,
            defaultColor;

        defaultColor = {
            name: instance.get('strings').noColor,
            color: '#FFF'
        };

        return {
            columns: 10,
            colors: [
                defaultColor,
                defaultColor,
                defaultColor,
                defaultColor,
                defaultColor,
                defaultColor,
                defaultColor,
                defaultColor,
                defaultColor,
                defaultColor
            ]
        };
    },

    _getHSVPalette: function () {
        var instance = this,
            contentBox,
            strings;

        if (!instance._hsvPaletteModal) {
            contentBox = instance.get('contentBox');

            strings = instance.get('strings');

            instance._hsvPaletteModal = new A.HSVAPaletteModal(
                {
                    centered: true,
                    headerContent: Lang.sub(
                        TPL_HEADER_CONTENT,
                        {
                            header: strings.header
                        }
                    ),
                    hsv: instance.get('hsvPalette'),
                    modal: true,
                    resizable: false
                }
            ).render();

            instance._hsvPaletteModal.addToolbar([
                {
                    label: strings.cancel,
                    on: {
                        click: function() {
                            instance._hsvPaletteModal.hide();
                        }
                    }
                },
                {
                    label: strings.ok,
                    on: {
                        click: function() {
                            var color = instance._hsvPaletteModal.get('selected');

                            console.log(color);

                            instance._hsvPaletteModal.hide();
                        }
                    },
                    primary: true
                }
            ]);
        }

        return instance._hsvPaletteModal;
    },

    _onHSVTriggerClick: function() {
        var instance = this,
            hsvPalette;

        hsvPalette = instance._getHSVPalette();

        hsvPalette.show();
    },

    _onRecentColorClick: function(event) {
        var instance = this,
            color,
            hsvPalette,
            index,
            node;

        node = event.node;

        color = node.getAttribute('data-color');

        instance._currentRecentColorIndex = node.getAttribute('data-index');

        event.preventDefault();

        hsvPalette = instance._getHSVPalette();

        hsvPalette.show();
    },

    _renderColorPalette: function () {
        var instance = this,
            colorPaletteOptions,
            contentBox;

        contentBox = instance.get('contentBox');

        colorPaletteOptions = instance.get('colorPalette');

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
        var instance = this,
            contentBox,
            recentColorsOptions,
            recentColorsPalette;

        contentBox = instance.get('contentBox');

        recentColorsOptions = instance.get('recentColorsOptions');

        recentColorsPalette = new A.ColorPalette(recentColorsOptions).render(contentBox);

        recentColorsPalette.on('itemClick', instance._onRecentColorClick, instance);

        instance._recentColorsPalette = recentColorsPalette;
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

        hsvPalette: {
            validator: Lang.isObject,
            value: {
                alpha: false
            }
        },

        colorPalette: {
            validator: Lang.isObject,
            value: {
                columns: 10,
                colors: [
                    '#000000',
                    '#434343',
                    '#666666',
                    '#999999',
                    '#b7b7b7',
                    '#cccccc',
                    '#d9d9d9',
                    '#efefef',
                    '#f3f3f3',
                    '#ffffff',
                    '#980000',
                    '#FF0000',
                    '#FF9900',
                    '#FFFF00',
                    '#00FF00',
                    '#00FFFF',
                    '#4A86E8',
                    '#0000FF',
                    '#9900FF',
                    '#FF00FF',
                    '#E6B8AF',
                    '#F4CCCC',
                    '#FCE5CD',
                    '#FFF2CC',
                    '#D9EAD3',
                    '#D0E0E3',
                    '#C9DAF8',
                    '#CFE2F3',
                    '#D9D2E9',
                    '#EAD1DC',
                    '#DD7E6B',
                    '#EA9999',
                    '#F9CB9C',
                    '#FFE599',
                    '#B6D7A8',
                    '#A2C4C9',
                    '#A4C2F4',
                    '#9FC5E8',
                    '#B4A7D6',
                    '#D5A6BD',
                    '#CC4125',
                    '#E06666',
                    '#F6B26B',
                    '#FFD966',
                    '#93C47D',
                    '#76A5AF',
                    '#6D9EEB',
                    '#6FA8DC',
                    '#8E7CC3',
                    '#C27BA0',
                    '#A61C00',
                    '#CC0000',
                    '#E69138',
                    '#F1C232',
                    '#6AA84F',
                    '#45818E',
                    '#3C78D8',
                    '#3D85C6',
                    '#674EA7',
                    '#A64D79',
                    '#85200C',
                    '#990000',
                    '#B45F06',
                    '#BF9000',
                    '#38761D',
                    '#134F5C',
                    '#1155CC',
                    '#0B5394',
                    '#351C75',
                    '#741B47',
                    '#5B0F00',
                    '#660000',
                    '#783F04',
                    '#7F6000',
                    '#274E13',
                    '#0C343D',
                    '#1C4587',
                    '#073763',
                    '#20124D',
                    '#4C1130'
                ]
            }
        },

        recentColorsOptions: {
            validator: Lang.isObject,
            valueFn: '_defaultValueRecentColors'
        },

        strings: {
            value: {
                cancel: 'Cancel',
                custom: 'More colors...',
                header: 'Choose custom color',
                ok: 'Ok',
                noColor: 'No color'
            }
        }
    },

    CSS_PREFIX: getClassName(NAME),

    NAME: NAME,

    NS: NAME
});

A.ColorPicker = ColorPicker;