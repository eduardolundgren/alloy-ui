/**
 * The Form Builder Component
 *
 * @module aui-form-builder
 * @submodule aui-form-builder-field-radio
 */

var L = A.Lang,

    BUILDER = 'builder',
    CHECKED = 'checked',
    CHOICE = 'choice',
    CONTAINER = 'container',
    DISABLED = 'disabled',
    EMPTY_STR = '',
    FIELD = 'field',
    FORM_BUILDER_FIELD = 'form-builder-field',
    FORM_BUILDER_RADIO_FIELD = 'form-builder-radio-field',
    ID = 'id',
    INPUT = 'input',
    NAME = 'name',
    NODE = 'node',
    OPTIONS = 'options',
    PREDEFINED_VALUE = 'predefinedValue',
    RADIO = 'radio',
    SPACE = ' ',
    TEMPLATE_NODE = 'templateNode',

    getCN = A.getClassName,

    CSS_FIELD = getCN(FIELD),
    CSS_FIELD_CHOICE = getCN(FIELD, CHOICE),
    CSS_FIELD_RADIO = getCN(FIELD, RADIO),
    CSS_FORM_BUILDER_FIELD = getCN(FORM_BUILDER_FIELD),
    CSS_FORM_BUILDER_FIELD_NODE = getCN(FORM_BUILDER_FIELD, NODE),
    CSS_FORM_BUILDER_FIELD_OPTIONS_CONTAINER = getCN(FORM_BUILDER_FIELD, OPTIONS, CONTAINER),

    TPL_OPTIONS_CONTAINER = '<div class="' + CSS_FORM_BUILDER_FIELD_OPTIONS_CONTAINER + '"></div>',
    TPL_RADIO =
        '<div><input id="{id}" class="' + [CSS_FIELD, CSS_FIELD_CHOICE, CSS_FIELD_RADIO, CSS_FORM_BUILDER_FIELD_NODE].join(
            SPACE) +
        '" name="{name}" type="radio" value="{value}" {checked} {disabled} /><label class="field-label" for="{id}">{label}</label></div>';

/**
 * A base class for `A.FormBuilderRadioField`.
 *
 * @class A.FormBuilderRadioField
 * @extends A.Component, A.FormBuilderMultipleChoiceField
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
var FormBuilderRadioField = A.Component.create({

    /**
     * Static property provides a string to identify the class.
     *
     * @property NAME
     * @type String
     * @static
     */
    NAME: FORM_BUILDER_RADIO_FIELD,

    /**
     * Static property used to define the default attribute
     * configuration for the `A.FormBuilderRadioField`.
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    ATTRS: {

        /**
         * Specifies a predefined value for the radio field.
         *
         * @attribute predefinedValue
         */
        predefinedValue: {
            valueFn: '_valuePredefinedValueFn'
        },

        /**
         * Reusable block of markup used to generate the field.
         *
         * @attribute template
         */
        template: {
            valueFn: function() {
                return TPL_RADIO;
            }
        }

    },

    /**
     * Static property provides a string to identify the CSS prefix.
     *
     * @property CSS_PREFIX
     * @type String
     * @static
     */
    CSS_PREFIX: CSS_FORM_BUILDER_FIELD,

    /**
     * Static property used to define which component it extends.
     *
     * @property EXTENDS
     * @type Object
     * @static
     */
    EXTENDS: A.FormBuilderMultipleChoiceField,

    prototype: {

        /**
         * Returns the HTML template.
         *
         * @method getHTML
         * @return {String}
         */
        getHTML: function() {
            return TPL_OPTIONS_CONTAINER;
        },

        /**
         * Set the `disabled` attribute in the UI.
         *
         * @method _uiSetDisabled
         * @param val
         * @protected
         */
        _uiSetDisabled: function(val) {
            var instance = this,
                templateNode = instance.get(TEMPLATE_NODE);

            templateNode.all(INPUT).each(function(input) {
                if (val) {
                    input.setAttribute(DISABLED, val);
                }
                else {
                    input.removeAttribute(DISABLED);
                }
            });
        },

        /**
         * Set the `options` attribute in the UI.
         *
         * @method _uiSetOptions
         * @param val
         * @protected
         */
        _uiSetOptions: function(val) {
            var instance = this,
                buffer = [],
                counter = 0,
                hasPredefinedValue = false,
                predefinedValue = instance.get(PREDEFINED_VALUE),
                templateNode = instance.get(TEMPLATE_NODE);

            A.each(val, function(item, index, collection) {
                var checked = A.Array.indexOf(predefinedValue, item.value) > -1;

                buffer.push(
                    L.sub(
                        TPL_RADIO, {
                            checked: checked ? 'checked="checked"' : EMPTY_STR,
                            disabled: instance.get(DISABLED) ? 'disabled="disabled"' : EMPTY_STR,
                            id: instance.get(ID) + counter++,
                            label: item.label,
                            name: instance.get(NAME),
                            value: item.value
                        }
                    )
                );

                if (checked) {
                    hasPredefinedValue = true;
                }
            });

            instance.optionNodes = A.NodeList.create(buffer.join(EMPTY_STR));

            templateNode.setContent(instance.optionNodes);

            if (!hasPredefinedValue) {
                instance.set(PREDEFINED_VALUE, instance._valuePredefinedValueFn());

                instance.get(BUILDER).editField(instance);
            }
        },

        /**
         * Set the `predefinedValue` attribute in the UI.
         *
         * @method _uiSetPredefinedValue
         * @param val
         * @protected
         */
        _uiSetPredefinedValue: function(val) {
            var instance = this,
                optionNodes = instance.optionNodes;

            if (!optionNodes) {
                return;
            }

            optionNodes.set(CHECKED, false);

            optionNodes.all('input[value="' + val + '"]').set(CHECKED, true);
        },

        /**
         * Returns the first option value if no predefined value is specified.
         *
         * @method _valuePredefinedValueFn
         * @protected
         */
        _valuePredefinedValueFn: function() {
            var instance = this,
                options = instance.get(OPTIONS),
                predefinedValue;

            if (options.length) {
                predefinedValue = options[0].value;
            }

            return predefinedValue;
        }

    }

});

A.FormBuilderRadioField = FormBuilderRadioField;

A.FormBuilder.types.radio = A.FormBuilderRadioField;
