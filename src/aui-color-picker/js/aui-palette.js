/* global A*/

var Lang = A.Lang,
    AWidget = A.Widget,

    getClassName = A.getClassName,

    NAME = 'palette',

    DOT = '.',
    EMPTY = '',
    SPACE = ' ',
    WIDTH = 'width',

    EVENT_CLICK = 'click',
    EVENT_MOUSEENTER = 'mouseenter',
    EVENT_MOUSELEAVE = 'mouseleave',

    CSS_PALETTE_CONTAINER = getClassName('palette-container'),
    CSS_PALETTE_ITEM_CONTAINER = getClassName('palette-item-container'),
    CSS_PALETTE_ITEMS_CONTAINER = getClassName('palette-items-container'),
    CSS_PALETTE_ITEMS_CONTAINER_INDEX = getClassName('palette-items-container-{index}'),
    CSS_PALETTE_ITEM = getClassName('palette-item'),
    CSS_PALETTE_ITEM_SELECTED = getClassName('palette-item-selected'),
    CSS_PALETTE_ITEM_HOVER = getClassName('palette-item-hover'),

    TPL_PALETTE_CONTAINER =
        '<table class="' + CSS_PALETTE_CONTAINER + '">{content}</table>',

    TPL_PALETTE_ITEMS_CONTAINER =
        '<tr class="' + CSS_PALETTE_ITEMS_CONTAINER + SPACE + CSS_PALETTE_ITEMS_CONTAINER_INDEX + '">{content}</tr>',

    TPL_PALETTE_ITEM_WRAPPER = '<td class="' + CSS_PALETTE_ITEM_CONTAINER + '">{content}</td>',

    TPL_PALETTE_ITEM =
        '<div class="' + CSS_PALETTE_ITEM + ' {selectedClassName}">' +
        '</div>',

Palette = A.Base.create(NAME, A.Widget, [], {
    initializer: function () {
        var instance = this;

        instance.publish(
            'itemClick',
            {
                defaultFn: instance._defaultItemClickFn
            }
        );

        A.after(instance._bindUIPalette, instance, 'renderUI');
    },

    renderUI: function () {
        var instance = this;

        instance._renderItems();
    },

    _afterSelectedChange: function (event) {
        var instance = this;

        if (event.src !== AWidget.UI_SRC) {
            instance._selectItem(event.newVal);
        }
    },

    _bindUIPalette: function () {
        var instance = this,
            bodyNode,
            paletteItemContainerSelector;

        bodyNode = instance.get('contentBox');

        paletteItemContainerSelector = DOT + CSS_PALETTE_ITEM_CONTAINER;

        bodyNode.delegate(EVENT_CLICK, instance._onItemClick, DOT + CSS_PALETTE_ITEM, instance);

        bodyNode.delegate(EVENT_MOUSEENTER, instance._onItemMouseEnter, paletteItemContainerSelector, instance);
        bodyNode.delegate(EVENT_MOUSELEAVE, instance._onItemMouseLeave, paletteItemContainerSelector, instance);

        instance.after('selectedChange', instance._afterSelectedChange, instance);
    },

    _defaultItemClickFn: function (event) {
        var instance = this,
            eventName,
            index,
            itemNode,
            selectedIndex;

        itemNode = event.node;

        if (instance._selectedItem) {
            instance._selectedItem.removeClass(CSS_PALETTE_ITEM_SELECTED);
        }

        index = parseInt(itemNode.getAttribute('data-index'), 10);

        if (itemNode === instance._selectedItem) {
            instance._selectedItem = null;

            eventName = 'unselect';

            selectedIndex = -1;
        }
        else {
            itemNode.addClass(CSS_PALETTE_ITEM_SELECTED);

            eventName = 'unselect';

            selectedIndex = index;

            instance._selectedItem = itemNode;
        }

        instance.set(
            'selected',
            selectedIndex,
            {
                src: AWidget.UI_SRC
            }
        );

        instance.fire(
            eventName,
            {
                item: itemNode,
                index: index,
                color: itemNode.getAttribute('data-color')
            }
        );
    },

    _getPaletteContent: function (items, rowIndex, content) {
        return Lang.sub(
            TPL_PALETTE_CONTAINER,
            {
                className: CSS_PALETTE_CONTAINER,
                content: content
            }
        );
    },

    _getPaletteItemContent: function (items, itemIndex, rowIndex, columnIndex, selected) {
        return Lang.sub(
            TPL_PALETTE_ITEM,
            {
                selectedClassName: selected ? CSS_PALETTE_ITEM_SELECTED : EMPTY
            }
        );
    },

    _getPaletteItemsContent: function (items, rowIndex, rowContent) {
        return Lang.sub(
            TPL_PALETTE_ITEMS_CONTAINER,
            {
                className: CSS_PALETTE_ITEMS_CONTAINER_INDEX,
                content: rowContent,
                index: rowIndex
            }
        );
    },

    _getSelectedItem: function () {
        var instance = this;

        return instance._selectedItem;
    },

    _generateContent: function (items, itemsPerRow) {
        var instance = this,
            i,
            itemsLength,
            j,
            result = EMPTY,
            rowContent,
            rowIndex = 0,
            selectedIndex;

        selectedIndex = instance.get('selected');

        for(i = 0, itemsLength = items.length; i < itemsLength;) {
            rowContent = EMPTY;

            for(j = 0; j < itemsPerRow && i < itemsLength; j++, i++) {
                rowContent += Lang.sub(
                    TPL_PALETTE_ITEM_WRAPPER,
                    {
                        content: instance._getPaletteItemContent(items, i, rowIndex, j, (selectedIndex === i))
                    }
                );
            }

            result += instance._getPaletteItemsContent(items, rowIndex, rowContent);

            rowIndex++;
        }

        result = instance._getPaletteContent(items, rowIndex, result);

        return result;
    },

    _onItemClick: function(event) {
        var instance = this;

        instance.fire(
            'itemClick',
            {
                node: event.currentTarget
            }
        );
    },

    _onItemMouseEnter: function (event) {
        event.currentTarget.addClass(CSS_PALETTE_ITEM_HOVER);
    },

    _onItemMouseLeave: function (event) {
        event.currentTarget.removeClass(CSS_PALETTE_ITEM_HOVER);
    },

    _renderItems: function () {
        var instance = this,
            items,
            itemsPerRow,
            result,
            width;

        width = instance.get(WIDTH);

        items = instance.get('colors');

        if (width) {
            itemsPerRow = items.length;
        }
        else {
            itemsPerRow = instance.get('columns');

            if (itemsPerRow === -1) {
                itemsPerRow = items.length;
            }
        }

        result = instance._generateContent(items, itemsPerRow);

        instance.get('contentBox').setHTML(result);
    },

    _selectItem: function (selectedIndex) {
        var instance = this,
            itemNode;

        if (instance._selectedItem) {
            instance._selectedItem.removeClass(CSS_PALETTE_ITEM_SELECTED);

            instance._selectedItem = null;
        }

        if (selectedIndex !== -1) {
            itemNode = instance.get('contentBox').one('[data-index=' + selectedIndex + ']');

            itemNode.addClass(CSS_PALETTE_ITEM_SELECTED);

            instance._selectedItem = itemNode;
        }
    },

    _setColors: function (value) {
        return value;
    }
}, {
    CSS_PREFIX: getClassName(NAME),

    ATTRS: {
        columns: {
            validator: Lang.isNumber,
            value: -1
        },

        colors: {
            setter: '_setColors',
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
            setter: '_setSelected',
            validator: Lang.isNumber
        },

        selectedItem: {
            getter: '_getSelectedItem',
            readOnly: true
        }
    },

    NAME: NAME,

    NS: NAME
});

A.Palette = Palette;