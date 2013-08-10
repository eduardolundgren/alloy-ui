var Lang = A.Lang,

    _DOCUMENT = A.one(A.config.doc),

    clamp = function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    ACTIVE_ELEMENT = 'activeElement',
    ACTIVE_INPUT = 'activeInput',
    AUTO_HIDE = 'autoHide',
    BOTTOM = 'bottom',
    BOUNDING_BOX = 'boundingBox',
    CALENDAR = 'calendar',
    CALENDAR_CLAZZ = 'calendarClazz',
    CLICK = 'click',
    CLICKOUTSIDE = 'clickoutside',
    DATE = 'date',
    DATE_CLICK = 'dateClick',
    ESC = 'esc',
    KEY = 'key',
    MULTIPLE = 'multiple',
    PANES = 'panes',
    POPOVER = 'popover',
    POPOVER_CLAZZ = 'popoverClazz',
    SELECTION_CHANGE = 'selectionChange',
    SELECTION_MODE = 'selectionMode',
    TRIGGER = 'trigger',

    getCN = A.getClassName,

    CSS_CALENDAR_POPOVER = getCN('calendar-popover');

function DatePickerCalendar() {}

DatePickerCalendar.PANES = [
    A.CalendarBase.ONE_PANE_TEMPLATE,
    A.CalendarBase.TWO_PANE_TEMPLATE,
    A.CalendarBase.THREE_PANE_TEMPLATE
];

DatePickerCalendar.ATTRS = {
    /**
     * The Calendar configuration.
     *
     * @attribute calendar
     */
    calendar: {
        setter: '_setCalendar',
        value: {},
        writeOnce: true
    },

    /**
     * The Calendar class reference.
     *
     * @attribute calendarClazz
     */
    calendarClazz: {
        value: A.Calendar,
        writeOnce: true
    },

    autoHide: {
        validator: Lang.isBoolean,
        value: true
    },

    panes: {
        setter: '_setPanes',
        value: 1,
        validator: Lang.isNumber,
        writeOnce: true
    },

    /**
     * The Popover configuration that holds the calendar.
     *
     * @attribute popover
     */
    popover: {
        setter: '_setPopover',
        value: {},
        writeOnce: true
    },

    /**
     * The Popover class reference.
     *
     * @attribute calendarClazz
     */
    popoverClazz: {
        value: A.Popover,
        writeOnce: true
    }
};

A.mix(DatePickerCalendar.prototype, {
    calendar: null,

    popover: null,

    initializer: function() {
        var instance = this;

        instance.after(SELECTION_CHANGE, instance._afterDatePickerSelectionChange);
    },

    alignTo: function(node) {
        var instance = this,
            popover = instance.getPopover();

        popover.set('align.node', node);
    },

    clearSelection: function(silent) {
        var instance = this;

        instance.getCalendar()._clearSelection(silent);
    },

    deselectDates: function(dates) {
        var instance = this;

        instance.getCalendar().deselectDates(dates);
    },

    getCalendar: function() {
        var instance = this,
            CalendarClazz,
            calendar = instance.calendar,
            originalCalendarTemplate;

        if (!calendar) {
            // CalendarBase leaks a functionality to dinamically switch the
            // template. Therefore, switch it to respect panels configuration
            // attribute, then switch it back after calendar renders.
            originalCalendarTemplate = A.CalendarBase.CONTENT_TEMPLATE;
            A.CalendarBase.CONTENT_TEMPLATE =
                DatePickerCalendar.PANES[instance.get(PANES) - 1];

            // Initialize the popover instance before calendar renders since it
            // will use popober.bodyNode as render node.
            instance.getPopover();

            CalendarClazz = instance.get(CALENDAR_CLAZZ);
            calendar = new (CalendarClazz)(instance.get(CALENDAR));
            calendar.render(instance.popover.bodyNode);
            instance.calendar = calendar;

            calendar.after(
                SELECTION_CHANGE, instance._afterCalendarSelectionChange,
                instance);
            calendar.after(
                DATE_CLICK, instance._afterCalendarDateClick,
                instance);

            // Restore the original CalendarBase template.
            A.CalendarBase.CONTENT_TEMPLATE = originalCalendarTemplate;
        }

        return calendar;
    },

    getPopover: function() {
        var instance = this,
            PopoverClazz,
            popover = instance.popover;

        if (!popover) {
            PopoverClazz = instance.get(POPOVER_CLAZZ);
            popover = new (PopoverClazz)(instance.get(POPOVER));
            instance.popover = popover;

            popover.get(BOUNDING_BOX).on(
                CLICKOUTSIDE, instance._onPopoverClickOutside, instance);
        }

        return popover;
    },

    hide: function() {
        var instance = this;

        instance.getPopover().hide();
    },

    show: function() {
        var instance = this;

        instance.getPopover().show();
    },

    selectDates: function(dates) {
        var instance = this;

        instance.getCalendar().selectDates(dates);
    },

    useInputNode: function(node) {
        var instance = this,
            popover = instance.getPopover();

        popover.set(TRIGGER, node);
        instance.set(ACTIVE_INPUT, node);

        instance.alignTo(node);
        instance.clearSelection(true);
        instance.selectDates(instance.getParsedDatesFromInputValue());
    },

    _afterCalendarDateClick: function() {
        var instance = this,
            calendar = instance.getCalendar(),
            selectionMode = calendar.get(SELECTION_MODE);

        if (instance.get(AUTO_HIDE) && (selectionMode !== MULTIPLE)) {
            instance.hide();
        }
    },

    _afterCalendarSelectionChange: function(event) {
        var instance = this;

        instance.fire(SELECTION_CHANGE, { newSelection: event.newSelection });
    },

    _afterDatePickerSelectionChange: function() {
        var instance = this;

        instance._setCalendarToFirstSelectedDate();
    },

    _isActiveInputFocused: function() {
        var instance = this,
            activeInput = instance.get(ACTIVE_INPUT);

        return (activeInput === _DOCUMENT.get(ACTIVE_ELEMENT));
    },

    _setCalendarToFirstSelectedDate: function() {
        var instance = this,
            dates = instance.getSelectedDates(),
            firstSelectedDate = dates[0];

        if (firstSelectedDate) {
            instance.getCalendar().set(DATE, firstSelectedDate);
        }
    },

    _onPopoverClickOutside: function(event) {
        var instance = this,
            target = event.target,
            activeInput = instance.get(ACTIVE_INPUT);

        if (!instance._isActiveInputFocused() &&
            !activeInput.contains(target)) {

            instance.hide();
        }
    },

    _onceUserInteractionRelease: function(event) {
        var instance = this;

        instance.useInputNodeOnce(event.currentTarget);

        instance.alignTo(event.currentTarget);

        instance._userInteractionInProgress = false;
    },

    _setCalendar: function(val) {
        return A.merge({
            showNextMonth: true,
            showPrevMonth: true
        }, val);
    },

    _setPanes: function(val) {
        return clamp(val, 1, 3);
    },

    _setPopover: function(val) {
        return A.merge({
            bodyContent: '',
            cssClass: CSS_CALENDAR_POPOVER,
            constrain: true,
            hideOn: [
                {
                    node: _DOCUMENT,
                    eventName: KEY,
                    keyCode: ESC
                }
            ],
            position: BOTTOM,
            render: true,
            triggerShowEvent: CLICK,
            triggerToggleEvent: null,
            visible: false
        }, val);
    }
}, true);

A.Base.mix(A.DatePickerDelegate, [DatePickerCalendar]);