var Lang = A.Lang;

A.ScreenRoute = A.Base.create('screenRoute', A.Base, [], {
    /**
     * Escapes the characters in string that are not safe to be used in regular
     *     expression.
     *
     * @method _regExpEscape
     * @param {String} s The string to escape. If not a string, it will be casted
     *     to one.
     * @return {string} A RegExp safe, escaped copy of `s`.
     * @private
     */
    _regExpEscape: function(s) {
        return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
    },

    /**
     * Sets the value of path attribute. Could be String, RegExp or Function.
     * If the passed value is String, it will be converted to `RegExp`.
     *
     * @method _setPath
     * @param {String|RegExp|Function} value `RegExp` instance or `String` or
     *     `Function`.
     * @protected
     */
    _setPath: function(value) {
        if (!A.instanceOf(value, RegExp)) {
            value = new RegExp('^' + this._regExpEscape(value) + '$');
        }
    },

    /**
     * Validates the value of path attribute. A value will be accepted as valid
     *     if it is `String`, `RegExp` or `Function`.
     *
     * @method _validatePath
     * @param  {String|RegExp|Function} value The provided value to be
     *     validated.
     * @protected
     */
    _validatePath: function(value) {
        return Lang.isString(value) || A.instanceOf(value, RegExp) || Lang.isFunction(value);
    },

    /**
     * Validates the value of screen attribute. A value will be accepted as
     * valid if it is component like `A.Screen` or class which extends
     * `A.Screen`, for example `A.HTMLScreen`.
     *
     * @method _validateScreen
     * @param {Function} value The provided value to be validated.
     * @protected
     */
    _validateScreen: function(value) {
        return Lang.isFunction(value);
    }
}, {
    ATTRS: {
        /**
         * Defines the path which will trigger the rendering of the screen,
         * specified in `screen` attribute. Could be `String`, `RegExp` or
         * `Function`. In case of `Function`, it will receive the URL as
         * parameter and it should return true if this URL could be handled by
         *     the screen.
         *
         * @attribute path
         * @type {String|RegExp|Function}
         */
        path: {
            setter: '_setPath',
            validator: '_validatePath'
        },

        /**
         * Defines the screen which will be rendered once a URL in the
         * application matches the path, specified in `path` attribute. Could be
         *     `A.Screen` or its extension, like `A.HTMLScreen`.
         *
         * @attribute screen
         * @type {A.Screen}
         */
        screen: {
            validator: '_validateScreen'
        }
    }
});
