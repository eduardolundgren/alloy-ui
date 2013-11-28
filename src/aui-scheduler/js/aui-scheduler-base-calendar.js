/**
 * The Scheduler Component
 *
 * @module aui-scheduler
 * @submodule aui-scheduler-base-calendar
 */

/**
 * A base class for `SchedulerCalendar`.
 *
 * @class A.SchedulerCalendar
 * @extends ModelList
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
var SchedulerCalendar = A.Base.create(SCHEDULER_CALENDAR, A.ModelList, [], {
    model: A.SchedulerEvent,

    /**
     * Construction logic executed during `SchedulerCalendar` instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var instance = this;

        instance.after('colorChange', instance._afterColorChange);
        instance.after('disabledChange', instance._afterDisabledChange);
        instance.after('visibleChange', instance._afterVisibleChange);
        instance.after(['add', 'remove', 'reset'], instance._afterEventsChange);
        instance.on(['remove', 'reset'], instance._onRemoveEvents);

        instance._uiSetEvents(
            instance.toArray()
        );

        instance._setModelsAttrs({
            color: instance.get(COLOR),
            disabled: instance.get(DISABLED),
            visible: instance.get(VISIBLE)
        });
    },

    /**
     * Handles `color` events.
     *
     * @method _afterColorChange
     * @param {EventFacade} event Event Facade object
     * @protected
     */
    _afterColorChange: function(event) {
        var instance = this;

        instance._setModelsAttrs({
            color: instance.get(COLOR)
        }, {
            silent: event.silent
        });
    },

    /**
     * Handles `disabled` events.
     *
     * @method _afterDisabledChange
     * @param {EventFacade} event Event Facade object
     * @protected
     */
    _afterDisabledChange: function(event) {
        var instance = this;

        instance._setModelsAttrs({
            disabled: instance.get(DISABLED)
        }, {
            silent: event.silent
        });
    },

    /**
     * Handles `events` events.
     *
     * @method _afterEventsChange
     * @param {EventFacade} event Event Facade object
     * @protected
     */
    _afterEventsChange: function(event) {
        var instance = this;

        instance._setModelsAttrs({
            color: instance.get(COLOR),
            disabled: instance.get(DISABLED),
            visible: instance.get(VISIBLE)
        }, {
            silent: true
        });

        instance._uiSetEvents(instance.toArray());
    },

    /**
     * Handles `visible` events.
     *
     * @method _afterVisibleChange
     * @param {EventFacade} event Event Facade object
     * @protected
     */
    _afterVisibleChange: function(event) {
        var instance = this;

        instance._setModelsAttrs({
            visible: instance.get(VISIBLE)
        }, {
            silent: event.silent
        });
    },

    /**
     * Handles `remove` events.
     *
     * @method _onRemoveEvents
     * @param {EventFacade} event Event Facade object
     * @protected
     */
    _onRemoveEvents: function(event) {
        var instance = this;
        var scheduler = instance.get(SCHEDULER);

        if (scheduler) {
            scheduler.removeEvents(instance);
        }
    },

    /**
     * Sets the model attributes for the base calendar.
     *
     * @method _setModelsAttrs
     * @param {Object} attrMap
     * @param {Object} options Zero or more options.
     * @protected
     */
    _setModelsAttrs: function(attrMap, options) {
        var instance = this;

        instance.each(function(schedulerEvent) {
            schedulerEvent.setAttrs(attrMap, options);
        });
    },

    /**
     * Sets the `events` on the UI.
     *
     * @method _uiSetEvents
     * @param {*} val The value of the property.
     * @protected
     */
    _uiSetEvents: function(val) {
        var instance = this;
        var scheduler = instance.get(SCHEDULER);

        if (scheduler) {
            scheduler.addEvents(val);
            scheduler.syncEventsUI();
        }
    }
}, {

    /**
     * Static property used to define the default attribute
     * configuration for the `SchedulerCalendar`.
     *
     * @property ATTRS
     * @type {Object}
     * @static
     */
    ATTRS: {

        /**
         * Contains the `color` of the scheduler calendar.
         *
         * @attribute color
         * @type {String}
         */
        color: {
            valueFn: function() {
                var instance = this;
                var palette = instance.get(PALETTE);
                var randomIndex = Math.ceil(Math.random() * palette.length) - 1;

                return palette[randomIndex];
            },
            validator: isString
        },

        /**
         * Determines if the calender is enabled.
         *
         * @attribute disabled
         * @default false
         * @type {Boolean}
         */
        disabled: {
            value: false,
            validator: isBoolean
        },

        /**
         * Determines the name for this calendar.
         *
         * @attribute name
         * @default '(no name)'
         * @type {String}
         */
        name: {
            value: '(no name)',
            validator: isString
        },

        /**
         * Contains a list of colors for the calendar.
         *
         * @attribute palette
         * @type {Array}
         */
        palette: {
            value: ['#d93636', '#e63973', '#b22eb3', '#6e36d9', '#2d70b3', '#376cd9', '#25998c', '#249960',
                '#24992e', '#6b9926', '#999926', '#a68f29', '#b3782d', '#bf6030', '#bf6060', '#997399', '#617181',
                '#6b7a99', '#548c85', '#747446', '#997e5c', '#b34d1b', '#993d48', '#802d70'],
            validator: isArray
        },

        /**
         * Contains this `SchedulerCalendar`'s `SchedulerBase' object.
         *
         * @attribute scheduler
         * @type {A.SchedulerBase}
         */
        scheduler: {},

        /**
         * Indicates whether the calendar is visible.
         *
         * @attribute visible
         * @default true
         * @type {Boolean}
         */
        visible: {
            value: true,
            validator: isBoolean
        }
    }
});

A.SchedulerCalendar = SchedulerCalendar;
