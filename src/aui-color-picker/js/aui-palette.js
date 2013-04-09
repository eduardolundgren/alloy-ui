/* global A*/

var Lang = A.Lang,

    getClassName = A.getClassName,

    NAME = 'palette',

    DOT = '.',
    EMPTY = '',
    WIDTH = 'width',

    EVENT_MOUSEENTER = 'mouseenter',
    EVENT_MOUSELEAVE = 'mouseleave',

    CSS_PALETTE_CONTAINER = getClassName('palette-container'),
    CSS_PALETTE_ITEMS_CONTAINER = getClassName('palette-items-container'),
    CSS_PALETTE_ITEM = getClassName('palette-item'),

    TPL_PALETTE_CONTAINER =
        '<table class="' + CSS_PALETTE_CONTAINER + '">{content}</table>',

    TPL_PALETTE_ITEMS_CONTAINER =
        '<tr class="' + CSS_PALETTE_ITEMS_CONTAINER + '">{content}</tr>',

    TPL_PALETTE_ITEM_WRAPPER = '<td>{content}</td>',

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
        var instance = this;

        var bodyNode = instance.get('contentBox');

        bodyNode.delegate(EVENT_MOUSEENTER, instance._handleResultListClick, DOT + CSS_PALETTE_ITEM, instance);
        bodyNode.delegate(EVENT_MOUSELEAVE, instance._onItemMouseLeave, DOT + CSS_PALETTE_ITEM, instance);
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
        var instance = this;

        var result = EMPTY;

        var rowContent;

        var rowIndex = 0;

        for(var i = 0, itemsLength = items.length; i < itemsLength;) {
            rowContent = EMPTY;

            for(var j = 0; j < itemsPerRow && i < itemsLength; j++, i++) {
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

    _renderItems: function() {
        var instance = this;

        var width = instance.get(WIDTH);

        var items = instance.get('data');

        var itemsPerRow;

        if (width) {
            itemsPerRow = items.length;
        }
        else {
            itemsPerRow = instance.get('cols');
        }

        var result = instance._generateContent(items, itemsPerRow);

        instance.get('contentBox').setHTML(result);
    },

    _onItemMouseEnter: function(event) {
        console.log('_onItemMouseEnter');
    },

    _onItemMouseLeave: function(event) {
        console.log('_onItemMouseLeave');
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