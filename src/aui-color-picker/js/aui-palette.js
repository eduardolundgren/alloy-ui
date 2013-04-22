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
    CSS_PALETTE_ITEM_SELECTED = getClassName('palette-item-selected'),
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
            paletteItemContainerSelector;

        bodyNode = instance.get('contentBox');

        paletteItemContainerSelector = DOT + CSS_PALETTE_ITEM_CONTAINER;

        bodyNode.delegate(EVENT_CLICK, instance._onItemClick, DOT + CSS_PALETTE_ITEM, instance);

        bodyNode.delegate(EVENT_MOUSEENTER, instance._onItemMouseEnter, paletteItemContainerSelector, instance);
        bodyNode.delegate(EVENT_MOUSELEAVE, instance._onItemMouseLeave, paletteItemContainerSelector, instance);
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

            if (itemsPerRow === -1) {
                itemsPerRow = items.length;
            }
        }

        result = instance._generateContent(items, itemsPerRow);

        instance.get('contentBox').setHTML(result);
    },

    _onItemClick: function(event) {
        var instance = this,
            index,
            itemNode;

        itemNode = event.currentTarget;

        if (instance._selectedItem) {
            instance._selectedItem.removeClass(CSS_PALETTE_ITEM_SELECTED);
        }

        if (itemNode === instance._selectedItem) {
            instance._selectedItem = null;

            index = -1;
        }
        else {
            index = parseInt(itemNode.getAttribute('data-index'), 10);

            itemNode.addClass(CSS_PALETTE_ITEM_SELECTED);

            instance._selectedItem = itemNode;
        }

        instance.set('selected', index);

        instance.fire(
            'select',
            {
                item: itemNode,
                index: index,
                color: itemNode.getAttribute('data-color')
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
        value: -1
    },

    data: {
        setter: '_setData',
        validator: Lang.isArray,
        value: [
            '#9FC6E7',
            '#5484ED',
            '#A4BDFC',
            '#51B749',
            '#FBD75B',
            '#FFB878',
            '#FF887C',
            '#DC2127',
            '#DBADFF',
            '#E1E1E1'
        ]
    },

    selected: {
        validator: '_validateSelected'
    }
};

A.Palette = Palette;