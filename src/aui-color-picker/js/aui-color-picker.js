/* global A*/

var AArray = A.Array,
    AWidget = A.Widget,
    Lang = A.Lang,

    getClassName = A.getClassName,

    _DEFAULT_COLUMNS = 10,
    _EMPTY = '',
    _INVALID_COLOR_INDEX = -1,
    _POUND = '#',

    CLICK = 'click',
    COLOR = 'color',
    COLOR_PALETTE = 'colorPalette',
    CONTENT_BOX = 'contentBox',
    DATA_INDEX = 'data-index',
    DATA_VALUE = 'data-value',
    DEFAULT_COLOR = '#FFF',
    DEFAULT_HSV_COLOR = 'FF0000',
    HSV_PALETTE = 'hsvPalette',
    ITEMS = 'items',
    RECENT_COLORS = 'recentColors',
    RENDER_COLOR_PALETTE = 'renderColorPalette',
    RENDER_HSV_PALETTE = 'renderHSVPalette',
    SELECT = 'select',
    SELECTED = 'selected',
    SELECTED_CHANGE = 'selectedChange',
    STRINGS = 'strings',
    UNSELECT = 'unselect',

    CSS_HSV_TRIGGER = getClassName('hsv-trigger'),
    CSS_HSV_TRIGGER_CONTAINER = getClassName('hsv-trigger-container'),

    NAME = 'color-picker',

    TPL_HEADER_CONTENT = '<h3>{header}</h3>',

    TPL_HSV_TRIGGER =
        '<div class="' + CSS_HSV_TRIGGER_CONTAINER + '">' +
            '<span class="' + CSS_HSV_TRIGGER + '">{custom}</span>' +
        '</div',

ColorPicker = A.Base.create(NAME, A.Widget, [], {
    initializer: function() {
        var instance = this;

    },

    bindUI: function() {
        var instance = this,
            renderHSVPalette;

        renderHSVPalette = instance.get(RENDER_HSV_PALETTE);

        if (renderHSVPalette) {
            instance._hsvTrigger.on(CLICK, instance._onHSVTriggerClick, instance);

            instance._recentColorsPalette.on(SELECTED_CHANGE, instance._onRecentColorPaletteSelectChange, instance);
        }
    },

    renderUI: function() {
        var instance = this,
            renderColorPalette,
            renderHSVPalette;

        renderColorPalette = instance.get(RENDER_COLOR_PALETTE);

        if (renderColorPalette) {
            instance._renderColorPalette();
        }

        renderHSVPalette = instance.get(RENDER_HSV_PALETTE);

        if (renderHSVPalette) {
            instance._renderHSVTrigger();

            instance._renderRecentColors();
        }
    },

    _defaultValueRecentColors: function() {
        var instance = this,
            defaultColor;

        defaultColor = {
            name: instance.get(STRINGS).noColor,
            value: DEFAULT_COLOR
        };

        return {
            columns: _DEFAULT_COLUMNS,
            items: [
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

    _getDefaultOptions: function(optionsName) {
        var instance = this,
            color,
            options;

        options = instance.get(optionsName);

        color = instance.get(COLOR);

        if (color) {
            A.mix(
                options,
                {
                    selected: color
                }
            );
        }

        return options;
    },

    _findRecentColorEmptySpot: function(items) {
        var instance = this,
            result = _INVALID_COLOR_INDEX;

        items = items || instance._recentColorsPalette.get(ITEMS);

        AArray.some(
            items,
            function(item, index) {
                var emptySlot = (item.value === DEFAULT_COLOR);

                if (emptySlot) {
                    result = index;
                }

                return emptySlot;
            }
        );

        return result;
    },

    _getHSVPalette: function() {
        var instance = this,
            contentBox,
            strings;

        if (!instance._hsvPaletteModal) {
            contentBox = instance.get(CONTENT_BOX);

            strings = instance.get(STRINGS);

            instance._hsvPaletteModal = new A.HSVAPaletteModal(
                {
                    centered: true,
                    headerContent: Lang.sub(
                        TPL_HEADER_CONTENT,
                        {
                            header: strings.header
                        }
                    ),
                    hsv: instance.get(HSV_PALETTE),
                    modal: true,
                    resizable: false
                }
            ).render();

            instance._hsvPaletteModal.addToolbar([
                {
                    label: strings.cancel,
                    on: {
                        click: A.bind(instance._hsvPaletteModal.hide, instance._hsvPaletteModal)
                    }
                },
                {
                    label: strings.ok,
                    on: {
                        click: A.bind(instance._onHSVPaletteOK, instance)
                    },
                    primary: true
                }
            ]);
        }

        return instance._hsvPaletteModal;
    },

    _onColorPaletteSelectChange: function(event) {
        var instance = this,
            color,
            item,
            selectedIndex;

        if (event.src !== AWidget.UI_SRC) {
            if (instance.get(RENDER_HSV_PALETTE)) {
                instance._recentColorsPalette.set(SELECTED, _INVALID_COLOR_INDEX, {
                    src: AWidget.UI_SRC
                });
            }

            if (event.newVal === _INVALID_COLOR_INDEX) {
                instance.set(COLOR, _EMPTY, {
                    src: AWidget.UI_SRC
                });
            }
            else {
                item = instance._colorPalette.get(ITEMS)[event.newVal];

                color = Lang.isObject(item) ? item.name : item;

                instance.set(COLOR, color);
            }
        }
    },

    _onHSVPaletteOK: function(event) {
        var instance = this,
            color,
            emptySpotIndex,
            recentColor,
            recentColors;

        color = _POUND + instance._hsvPaletteModal.get(SELECTED);

        recentColors = instance._recentColorsPalette.get(ITEMS);

        instance._colorPalette.set(SELECTED, _INVALID_COLOR_INDEX, {
            src: AWidget.UI_SRC
        });

        if (Lang.isNumber(instance._recentColorIndex)) {
            recentColors[instance._recentColorIndex] = color;

            instance._recentColorsPalette.set(SELECTED, instance._recentColorIndex, {
                src: AWidget.UI_SRC
            });
        }
        else {
            emptySpotIndex = instance._findRecentColorEmptySpot(recentColors);

            if (emptySpotIndex > _INVALID_COLOR_INDEX) {
                recentColors[emptySpotIndex] = color;
            }
            else {
                recentColors.push(color);
            }

            instance._recentColorsPalette.set(SELECTED, emptySpotIndex, {
                src: AWidget.UI_SRC
            });
        }

        instance._recentColorsPalette.set(ITEMS, recentColors);

        instance.set(COLOR, color);

        instance._hsvPaletteModal.hide();
    },

    _onHSVTriggerClick: function() {
        var instance = this,
            hsvPalette;

        instance._recentColorIndex = null;

        hsvPalette = instance._getHSVPalette();

        hsvPalette.set(SELECTED, DEFAULT_HSV_COLOR);

        hsvPalette.show();
    },

    _onRecentColorPaletteSelectChange: function(event) {
        var instance = this,
            color,
            item;

        if (event.src !== AWidget.UI_SRC) {
            instance._colorPalette.set(SELECTED, _INVALID_COLOR_INDEX, {
                src: AWidget.UI_SRC
            });

            if (event.newVal === _INVALID_COLOR_INDEX) {
                instance.set(COLOR, _EMPTY);
            }
            else {
                item = instance._recentColorsPalette.get(ITEMS)[event.newVal];

                color = Lang.isObject(item) ? item.name : item;

                instance.set(COLOR, color, {
                    src: AWidget.UI_SRC
                });
            }
        }
    },

    _onRecentColorClick: function(event) {
        var instance = this,
            color,
            hsvPalette,
            index,
            node;

        node = event.item;

        color = node.getAttribute(DATA_VALUE);

        instance._recentColorIndex = Lang.toInt(node.getAttribute(DATA_INDEX));

        if (color === DEFAULT_COLOR) {
            event.preventDefault();

            hsvPalette = instance._getHSVPalette();

            hsvPalette.set(SELECTED, DEFAULT_HSV_COLOR);

            hsvPalette.show();
        }
    },

    _renderColorPalette: function() {
        var instance = this,
            color,
            colorPaletteOptions,
            contentBox;

        contentBox = instance.get(CONTENT_BOX);

        colorPaletteOptions = instance._getDefaultOptions(COLOR_PALETTE);

        instance._colorPalette = new A.ColorPalette(colorPaletteOptions).render(contentBox);

        instance._colorPalette.on(SELECTED_CHANGE, instance._onColorPaletteSelectChange, instance);
    },

    _renderHSVTrigger: function() {
        var instance = this,
            contentBox,
            strings;

        contentBox = instance.get(CONTENT_BOX);

        strings = instance.get(STRINGS);

        instance._hsvTrigger = contentBox.appendChild(
            Lang.sub(
                TPL_HSV_TRIGGER,
                {
                    custom: strings.custom
                }
            )
        );
    },

    _renderRecentColors: function() {
        var instance = this,
            color,
            contentBox,
            recentColors,
            recentColorsPalette;

        contentBox = instance.get(CONTENT_BOX);

        recentColors = instance._getDefaultOptions(RECENT_COLORS);

        recentColorsPalette = new A.ColorPalette(recentColors).render(contentBox);

        recentColorsPalette.on([SELECT, UNSELECT], instance._onRecentColorClick, instance);

        instance._recentColorsPalette = recentColorsPalette;
    }
}, {
    ATTRS: {
        color: {
            validator: Lang.isString
        },

        colorPalette: {
            validator: Lang.isObject,
            value: {
                columns: _DEFAULT_COLUMNS,
                items: [
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

        hsvPalette: {
            validator: Lang.isObject,
            value: {
                alpha: false
            }
        },

        recentColors: {
            validator: Lang.isObject,
            valueFn: '_defaultValueRecentColors'
        },

        renderColorPalette: {
            validator: Lang.isBoolean,
            value: true
        },

        renderHSVPalette: {
            validator: Lang.isBoolean,
            value: true
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