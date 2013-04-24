/* global A*/

var AArray = A.Array,
    AColor = A.Color,
    Lang = A.Lang,

    getClassName = A.getClassName,

    NAME = 'color-palette',

    EMPTY = '',
    SPACE = ' ',

    CSS_COLOR_PALETTE_ITEM = getClassName('color-palette-item'),
    CSS_PALETTE_ITEM = getClassName('palette-item'),
    CSS_PALETTE_ITEM_SELECTED = getClassName('palette-item-selected'),

ColorPalette = A.Base.create(NAME, A.Widget, [
    A.Palette
], {
    ITEM_TEMPLATE: '<a href="" class="' + CSS_PALETTE_ITEM + ' {selectedClassName}" data-value="{value}" style="background-color:{value}" onclick="return false;" title="{title}"></a>',

    _valueFormatterFn: function() {
        return function (items, index, row, column) {
            var instance = this,
                item = items[index];

            return Lang.sub(
                instance.ITEM_TEMPLATE,
                {
                    column: column,
                    index: index,
                    row: row,
                    selectedClassName: selected ? CSS_PALETTE_ITEM_SELECTED : EMPTY,
                    title: item.name,
                    value: item.value
                }
            );
        };
    },

    _setItems: function (value) {
        var instance = this;

        var result = AArray.map(value, function (item, index) {
            var tmp = item,
                color;

            if (Lang.isString(item)) {
                color = AColor.toHex(item);

                tmp = {
                    name: color,
                    value: color
                };
            }

            return tmp;
        });

        instance._items = null;

        return result;
    }
}, {
    CSS_PREFIX: getClassName(NAME),

    NAME: NAME,

    ATTRS: {
        items: {
            setter: '_setItems',
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

        }
    }
});

A.ColorPalette = ColorPalette;