var Lang = A.Lang,

    _DASH = '-',

    ACTIVE_INPUT = 'activeInput',
    CHANGE = 'change',
    CONTAINER = 'container',
    DATE = 'date',
    SELECTION_CHANGE = 'selectionChange',
    SELECTOR = 'selector',
    TYPE = 'type';

if (A.DatePickerCalendar) {
    return;
}

function DatePickerNative() {}

DatePickerNative.RFC3339_DATE_MASK = '%Y-%m-%d';

A.mix(DatePickerNative.prototype, {
    initializer: function() {
        var instance = this;

        instance.bindNativeUI();
    },

    bindNativeUI: function() {
        var instance = this,
            container = instance.get(CONTAINER),
            selector = instance.get(SELECTOR);

        instance._eventHandles.push(
            container.delegate(
                ['touchstart'],
                A.bind('_onceUserInteraction', instance), selector),

            container.delegate(
                CHANGE,
                A.bind('_afterNativeSelectionChange', instance), selector)
        );
    },

    clearSelection: function() {
        var instance = this,
            activeInput = instance.get(ACTIVE_INPUT);

        activeInput.val('');
    },

    deselectDates: function() {
        var instance = this;

        instance.clearSelection();
    },

    hide: function() {
        var instance = this,
            activeInput = instance.get(ACTIVE_INPUT);

        activeInput.blur();
    },

    show: function() {
        var instance = this,
            activeInput = instance.get(ACTIVE_INPUT);

        activeInput.focus();
    },

    selectDates: function(dates) {
        var instance = this,
            activeInput = instance.get(ACTIVE_INPUT);

        if (Lang.isArray(dates)) {
            dates = dates[0];
        }

        if (Lang.isDate(dates)) {
            activeInput.val(instance._formatDate(dates));
        }
    },

    useInputNode: function(node) {
        var instance = this,
            type = node.attr('type'),
            parsed;

        instance.set(ACTIVE_INPUT, node);

        if (!instance._isTypeSupported(type)) {
            parsed = instance.getParsedDatesFromInputValue();
            if (parsed) {
                node.val(instance._formatDate(parsed[0]));
            }
        }

        node.setAttribute(TYPE, DATE);

        instance._fireSelectionChange();
    },

    _addFourDigitsYearPadding: function(text) {
        return A.Lang.String.repeat('0', 4 - text.indexOf(_DASH)) + text;
    },

    _afterNativeSelectionChange: function(event) {
        var instance = this,
            type = event.currentTarget.attr('type');

        if (instance._isTypeSupported(type)) {
            instance._fireSelectionChange();
        }
    },

    _fireSelectionChange: function() {
        var instance = this,
            activeInput = instance.get(ACTIVE_INPUT),
            parsed = instance._parseDateFromString(activeInput.val());

        instance.fire(
            SELECTION_CHANGE, { newSelection: parsed ? [parsed] : [] });
    },

    _formatDate: function(date) {
        var instance = this,
            formatted = A.Date.format(date,
                { format: DatePickerNative.RFC3339_DATE_MASK });

        return instance._addFourDigitsYearPadding(formatted);
    },

    _isTypeSupported: function(type) {
        switch (type.toLowerCase()) {
            case 'date':
                return true;
            default:
                return false;
        }
    },

    _parseDateFromString: function(text) {
        if (!text) {
            return false;
        }

        return A.Date.parse(DatePickerNative.RFC3339_DATE_MASK, text);
    }
}, true);

A.Base.mix(A.DatePickerDelegate, [DatePickerNative]);