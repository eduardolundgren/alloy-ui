/* global A*/

var Lang = A.Lang,

    getClassName = A.getClassName,

    NAME = 'color-palette',

    CSS_PALETTE_ITEM = getClassName('palette-item'),

    TPL_PALETTE_ITEM =
        '<div class="' + CSS_PALETTE_ITEM + '" style="background-color:{color}">' +
        '</div>';

var ColorPalette = A.Base.create(NAME, A.Widget, [
    A.Palette
], {
    _getPaletteItemContent: function(items, itemIndex, rowIndex, columnIndex) {
        var instance = this;

        return Lang.sub(
            TPL_PALETTE_ITEM,
            {
                color: items[itemIndex]
            }
        );
    }
}, {
    CSS_PREFIX: getClassName(NAME),

    NAME: NAME,

    NS: NAME
});

A.ColorPalette = ColorPalette;