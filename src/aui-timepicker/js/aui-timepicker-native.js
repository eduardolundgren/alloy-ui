/**
 * The TimePicker Component
 *
 * @module aui-timepicker
 * @submodule aui-timepicker-native
 */

var Lang = A.Lang,

    TIME = 'time';

/**
 * A base class for TimePickerNativeBase.
 *
 * @class A.TimePickerNativeBase
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 */
function TimePickerNativeBase() {}

/**
 * Static property used to define the default attribute
 * configuration for the TimePickerNativeBase.
 *
 * @property TimePickerNativeBase.ATTRS
 * @type Object
 * @static
 */
TimePickerNativeBase.ATTRS = {

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @attribute nativeMask
     * @default '%H:%M'
     * @type String
     */
    nativeMask: {
        validator: Lang.isString,
        value: '%H:%M'
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @attribute nativeType
     * @default 'time'
     * @type String
     */
    nativeType: {
        validator: Lang.isString,
        value: TIME
    }
};

A.TimePickerNativeBase = TimePickerNativeBase;

/**
 * A base class for TimePickerNative.
 *
 * @class A.TimePickerNative
 * @extends A.Base
 * @uses A.DatePickerDelegate, A.DatePickerNativeBase, A.TimePickerNativeBase
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 */
A.TimePickerNative = A.Base.create('timepicker-native', A.Base, [A.DatePickerDelegate, A.DatePickerNativeBase, A.TimePickerNativeBase]);