/* global A*/

var AArray = A.Array,
    AColor = A.Color,
    Lang = A.Lang,

    getClassName = A.getClassName,

    NAME = 'color-palette',

    CSS_PALETTE_ITEM = getClassName('palette-item'),

    TPL_PALETTE_ITEM =
        '<div class="' + CSS_PALETTE_ITEM + '" data-color="{color}" data-index={index} style="background-color:{color}" title="{title}">' +
        '</div>',

ColorPalette = A.Base.create(NAME, A.Widget, [
    A.Palette
], {
    _getPaletteItemContent: function(items, itemIndex, rowIndex, columnIndex) {
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

    _setData: function(value) {
        var result = AArray.map(
            value,
            function(item, index) {
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