/* global A*/

var Lang = A.Lang,

    _NAME = 'palette',
    _DOT = '.',
    _EMPTY = '',
    _SPACE = ' ',

    BOUNDING_BOX = 'boundingBox',
    CLICK = 'click',
    COLUMNS = 'columns',
    CONTENT_BOX = 'contentBox',
    ENTER = 'enter',
    FORMATTER = 'formatter',
    HOVER = 'hover',
    ITEMS = 'items',
    LEAVE = 'leave',
    RENDER_UI = 'renderUI',
    SELECT = 'select',
    SELECTED = 'selected',
    TOGGLE_SELECTION = 'toggleSelection',
    UNSELECT = 'unselect',
    WIDTH = 'width',

    getClassName = A.getClassName,

    CSS_PALETTE_CONTAINER = getClassName('palette-container'),
    CSS_PALETTE_ITEM_CONTAINER = getClassName('palette-item-container'),
    CSS_PALETTE_ITEMS_CONTAINER = getClassName('palette-items-container'),
    CSS_PALETTE_ITEMS_CONTAINER_INDEX = getClassName('palette-items-container-{index}'),
    CSS_PALETTE_ITEM = getClassName('palette-item'),
    CSS_PALETTE_ITEM_SELECTED = getClassName('palette-item-selected'),
    CSS_PALETTE_ITEM_HOVER = getClassName('palette-item-hover');

var Palette = A.Base.create(_NAME, A.Widget, [], {
    CONTAINER_TEMPLATE: '<table class="' + CSS_PALETTE_CONTAINER + '">{content}</table>',

    ITEMS_CONTAINER_TEMPLATE: '<tr class="' + CSS_PALETTE_ITEMS_CONTAINER + _SPACE + CSS_PALETTE_ITEMS_CONTAINER_INDEX + '">{content}</tr>',

    ITEM_WRAPPER_TEMPLATE: '<td class="' + CSS_PALETTE_ITEM_CONTAINER + '" data-column={column} data-index={index} data-row={row}>{content}</td>',

    ITEM_TEMPLATE: '<a href="" class="' + CSS_PALETTE_ITEM + '" data-value="{value}" onclick="return false;"></a>',

    _items: null,

    initializer: function() {
        var instance = this;

        A.after(instance._bindUIPalette, instance, RENDER_UI);

        instance.publish({
            enter: { defaultFn: instance._defEnterFn },
            leave: { defaultFn: instance._defLeaveFn },
            select: { defaultFn: instance._defSelectFn },
            unselect: { defaultFn: instance._defUnselectFn }
        });
    },

    renderUI: function() {
        var instance = this;

        instance._renderItems();
    },

    getItem: function(row, col) {
        var instance = this;

        return instance.getItemByIndex(
                row*instance.get(COLUMNS) + col);
    },

    getItemByIndex: function(index) {
        var instance = this;

        instance._indexItemsIfNeeded();

        return instance._items.item(index);
    },

    _bindUIPalette: function() {
        var instance = this,
            boundingBox = instance.get(BOUNDING_BOX);

        boundingBox.delegate(CLICK, instance._onItemClick, _DOT+CSS_PALETTE_ITEM_CONTAINER, instance);
        boundingBox.delegate(HOVER, instance._onItemMouseEnter, instance._onItemMouseLeave, _DOT+CSS_PALETTE_ITEM_CONTAINER, instance);
    },

    _defEnterFn: function(event) {
        event.item.addClass(CSS_PALETTE_ITEM_HOVER);
    },

    _defLeaveFn: function(event) {
        event.item.removeClass(CSS_PALETTE_ITEM_HOVER);
    },

    _defSelectFn: function(event) {
        var instance = this,
            selected = instance.get(SELECTED),
            selectedItem = instance.getItemByIndex(selected);

        if (selectedItem) {
            selectedItem.removeClass(CSS_PALETTE_ITEM_SELECTED);
        }

        instance.set(SELECTED, event.index);

        event.item.addClass(CSS_PALETTE_ITEM_SELECTED);
    },

    _defUnselectFn: function(event) {
        var instance = this;

        instance.set(SELECTED, -1);

        event.item.removeClass(CSS_PALETTE_ITEM_SELECTED);
    },

    _getCellContent: function(items, index, row, column, content) {
        var instance = this;

        return Lang.sub(
            instance.ITEM_WRAPPER_TEMPLATE,
            {
                column: column,
                content: content,
                index: index,
                row: row,
                value: items[index]
            }
        );
    },

    _getContent: function(items, columns) {
        var instance = this,
            formatter = instance.get(FORMATTER),
            selected = instance.get(SELECTED),
            column,
            content,
            index = 0,
            result = _EMPTY,
            total = items.length,
            row,
            rows = Math.ceil(total/columns);

        for (row = 0; row < rows; row++) {
            content = _EMPTY;

            for (column = 0; column < columns; column++) {
                index = (row*columns + column);

                if (index >= total) {
                    break;
                }

                content += instance._getCellContent(
                            items, index, row, column,
                            formatter.call(instance, items, index, row, column, (selected === index)));
            }

            result += instance._getRowContent(items, index, row, content);
        }

        return instance._getPaletteContent(items, result);
    },

    _getEventsPayload: function(event) {
        var instance = this,
            items = instance.get(ITEMS),
            index,
            itemNode = event.currentTarget;

        index = Lang.toInt(itemNode.getAttribute('data-index'));

        return {
            column: Lang.toInt(itemNode.getAttribute('data-column')),
            item: itemNode,
            index: index,
            row: Lang.toInt(itemNode.getAttribute('data-row')),
            value: items[index]
        };
    },

    _getPaletteContent: function(items, content) {
        var instance = this;

        return Lang.sub(
            instance.CONTAINER_TEMPLATE,
            {
                className: CSS_PALETTE_CONTAINER,
                content: content
            }
        );
    },

    _getRowContent: function(items, index, row, content) {
        var instance = this;

        return Lang.sub(
            instance.ITEMS_CONTAINER_TEMPLATE,
            {
                className: CSS_PALETTE_ITEMS_CONTAINER_INDEX,
                content: content,
                index: row
            }
        );
    },

    _indexItemsIfNeeded: function() {
        var instance = this;

        if (!instance._items) {
            instance._items = instance.get(CONTENT_BOX).all(_DOT+CSS_PALETTE_ITEM_CONTAINER);
        }
    },

    _renderItems: function() {
        var instance = this,
            items = instance.get(ITEMS),
            columns,
            width = instance.get(WIDTH);

        if (width) {
            columns = items.length;
        }
        else {
            columns = instance.get(COLUMNS);

            if (columns === -1) {
                columns = items.length;
            }
        }

        instance.get(CONTENT_BOX).setHTML(
            instance._getContent(items, columns));
    },

    _onItemClick: function(event) {
        var instance = this,
            selected = instance.get(SELECTED),
            toggleSelection = instance.get(TOGGLE_SELECTION),
            eventName = SELECT,
            itemNode = event.currentTarget,
            selectedItem = instance.getItemByIndex(selected);

        if (toggleSelection && (itemNode === selectedItem)) {
            eventName = UNSELECT;
        }

        instance.fire(eventName, instance._getEventsPayload(event));
    },

    _onItemMouseEnter: function(event) {
        var instance = this;

        instance.fire(ENTER, instance._getEventsPayload(event));
    },

    _onItemMouseLeave: function(event) {
        var instance = this;

        instance.fire(LEAVE, instance._getEventsPayload(event));
    },

    _setItems: function(val) {
        var instance = this;

        instance._items = null;

        return val;
    },

    _valueFormatterFn: function() {
        return function (items, index, row, column, selected) {
            var instance = this;

            return Lang.sub(
                instance.ITEM_TEMPLATE,
                {
                    column: column,
                    index: index,
                    row: row,
                    value: items[index]
                }
            );
        };
    }
}, {
    ATTRS: {
        columns: {
            validator: Lang.isNumber,
            value: -1
        },

        formatter: {
            validator: Lang.isFunction,
            valueFn: '_valueFormatterFn'
        },

        items: {
            setter: '_setItems',
            validator: Lang.isArray,
            value: []
        },

        selected: {
            validator: Lang.isNumber
        },

        toggleSelection: {
            validator: Lang.isBoolean,
            value: true
        }
    }
});

A.Palette = Palette;