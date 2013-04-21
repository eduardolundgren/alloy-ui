/* global A*/

var Lang = A.Lang,

    getClassName = A.getClassName,

    NAME = 'palette',

    DOT = '.',
    EMPTY = '',
    WIDTH = 'width',

    EVENT_CLICK = 'click',
    EVENT_MOUSEENTER = 'mouseenter',
    EVENT_MOUSELEAVE = 'mouseleave',

    CSS_PALETTE_CONTAINER = getClassName('palette-container'),
    CSS_PALETTE_ITEM_CONTAINER = getClassName('palette-item-container'),
    CSS_PALETTE_ITEMS_CONTAINER = getClassName('palette-items-container'),
    CSS_PALETTE_ITEM = getClassName('palette-item'),
    CSS_PALETTE_ITEM_HOVER = getClassName('palette-item-hover'),

    TPL_PALETTE_CONTAINER =
        '<table class="' + CSS_PALETTE_CONTAINER + '">{content}</table>',

    TPL_PALETTE_ITEMS_CONTAINER =
        '<tr class="' + CSS_PALETTE_ITEMS_CONTAINER + '">{content}</tr>',

    TPL_PALETTE_ITEM_WRAPPER = '<td class="' + CSS_PALETTE_ITEM_CONTAINER + '">{content}</td>',

    TPL_PALETTE_ITEM =
        '<div class="' + CSS_PALETTE_ITEM + '">' +
        '</div>';

function Palette() {}

Palette.prototype = {
    initializer: function() {
        var instance = this;

        A.after(instance._bindUIPalette, instance, 'renderUI');
    },

    renderUI: function() {
        var instance = this;

        instance._renderItems();
    },

    _bindUIPalette: function() {
        var instance = this,
            bodyNode,
            paletteItemSelector;

        bodyNode = instance.get('contentBox');

        paletteItemSelector = DOT + CSS_PALETTE_ITEM;

        bodyNode.delegate(EVENT_CLICK, instance._onItemClick, paletteItemSelector, instance);

        bodyNode.delegate(EVENT_MOUSEENTER, instance._onItemMouseEnter, paletteItemSelector, instance);
        bodyNode.delegate(EVENT_MOUSELEAVE, instance._onItemMouseLeave, paletteItemSelector, instance);
    },

    _getPaletteContent: function(items, rowIndex, content) {
        return Lang.sub(
            TPL_PALETTE_CONTAINER,
            {
                className: CSS_PALETTE_CONTAINER,
                content: content
            }
        );
    },

    _getPaletteItemContent: function(items, itemIndex, rowIndex, columnIndex) {
        return TPL_PALETTE_ITEM;
    },

    _getPaletteItemsContent: function(items, rowIndex, rowContent) {
        return Lang.sub(
            TPL_PALETTE_ITEMS_CONTAINER,
            {
                className: CSS_PALETTE_ITEMS_CONTAINER,
                content: rowContent
            }
        );
    },

    _generateContent: function(items, itemsPerRow) {
        var instance = this,
            i,
            itemsLength,
            j,
            result = EMPTY,
            rowContent,
            rowIndex = 0;


        for(i = 0, itemsLength = items.length; i < itemsLength;) {
            rowContent = EMPTY;

            for(j = 0; j < itemsPerRow && i < itemsLength; j++, i++) {
                rowContent += Lang.sub(
                    TPL_PALETTE_ITEM_WRAPPER,
                    {
                        content: instance._getPaletteItemContent(items, i, rowIndex, j)
                    }
                );
            }

            result += instance._getPaletteItemsContent(items, rowIndex, rowContent);

            rowIndex++;
        }

        result = instance._getPaletteContent(items, rowIndex, result);

        return result;
    },

    _setData: function(value) {
        return value;
    },

    _renderItems: function() {
        var instance = this,
            items,
            itemsPerRow,
            result,
            width;

        width = instance.get(WIDTH);

        items = instance.get('data');

        if (width) {
            itemsPerRow = items.length;
        }
        else {
            itemsPerRow = instance.get('cols');
        }

        result = instance._generateContent(items, itemsPerRow);

        instance.get('contentBox').setHTML(result);
    },

    _onItemClick: function(event) {
        var instance = this;

        instance.fire(
            'select',
            {
                item: event.currentTarget
            }
        );
    },

    _onItemMouseEnter: function(event) {
        event.currentTarget.addClass(CSS_PALETTE_ITEM_HOVER);
    },

    _onItemMouseLeave: function(event) {
        event.currentTarget.removeClass(CSS_PALETTE_ITEM_HOVER);
    }
};

Palette.NAME = NAME;

Palette.NS = NAME;

Palette.ATTRS = {
    cols: {
        validator: Lang.isNumber,
        value: 4
    },

    data: {
        setter: '_setData',
        validator: Lang.isArray,
        value: [
            '#000000',
            '#C0C0C0',
            '#808080',
            '#FFFFFF',
            '#800000',
            '#FF0000',
            '#800080',
            '#FF00FF',
            '#008000',
            '#00FF00',
            '#808000',
            '#FFFF00',
            '#000080',
            '#0000FF',
            '#008080',
            '#00FFFF'
        ]
    }
};

A.Palette = Palette;