/* global A*/

var AArray = A.Array,
    AColor = A.Color,
    Lang = A.Lang,

    getClassName = A.getClassName,

    NAME = 'color-palette',

    SPACE = ' ',

    CSS_COLOR_PALETTE_ITEM = getClassName('color-palette-item'),
    CSS_PALETTE_ITEM = getClassName('palette-item'),
    CSS_PALETTE_ITEM_SELECTED = getClassName('palette-item-selected'),

    TPL_PALETTE_ITEM =
        '<div class="' + CSS_PALETTE_ITEM + SPACE + CSS_COLOR_PALETTE_ITEM + '" data-color="{color}" data-index={index} style="background-color:{color}" title="{title}">' +
        '</div>',

ColorPalette = A.Base.create(NAME, A.Palette, [], {
    _defaultItemClickFn: function() {
        var instance = this,
            eventName,
            index,
            itemNode,
            selectedIndex;

        itemNode = event.target;

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

        instance.set('selected', selectedIndex);

        instance.fire(
            eventName,
            {
                item: itemNode,
                index: index,
                color: itemNode.getAttribute('data-color')
            }
        );
    },

    _getPaletteItemContent: function (items, itemIndex, rowIndex, columnIndex) {
        var instance = this,
            item = items[itemIndex];

        return Lang.sub(
            TPL_PALETTE_ITEM,
            {
                color: item.color,
                index: itemIndex,
                title: item.name
            }
        );
    },

    _setColors: function (value) {
        var result = AArray.map(
            value,
            function (item, index) {
                var tmp = item,
                    color;

                if (Lang.isString(item)) {
                    color = AColor.toHex(item);

                    tmp = {
                        name: color,
                        color: color
                    };
                }

                return tmp;
            }
        );

        return result;
    }
}, {
    CSS_PREFIX: getClassName(NAME),

    NAME: NAME,

    NS: NAME
});

A.ColorPalette = ColorPalette;