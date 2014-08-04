/**
* The SchedulerViewAccessibility Component
*
* @module aui-scheduler
* @submodule aui-scheduler-view-accessibility
*/

var DateMath = A.DataType.DateMath,
    Lang = A.Lang,
    isString = Lang.isString,
    isObject = Lang.isObject,

    getCN = A.getClassName,

    CSS_SCHEDULER_VIEW_DAY_HEADER_DAY = getCN('scheduler-view', 'day', 'header', 'day'),
    CSS_SCHEDULER_VIEW_DAY_MARKER_CHILD = getCN('scheduler-view', 'marker', 'child'),
    CSS_SVT_COLGRID = getCN('scheduler-view', 'table', 'colgrid');

var SchedulerViewAccessibility = function() {};

SchedulerViewAccessibility.ATTRS = {

    /**
    * Contains the function that formats the aria label date.
    *
    * @attribute ariaLabelDateFormatter
    * @type {Function}
    */
    ariaLabelDateFormatter: {
        value: function(date) {
            var instance = this,
                scheduler = instance.get('scheduler');

            return A.DataType.Date.format(
                date, {
                    format: '%A %B %d %Y',
                    locale: scheduler.get('locale')
                }
            );
        },
        validator: isString
    },

    /**
    * Defines the keyboard configuration object for
    * `Plugin.NodeFocusManager`.
    *
    * @attribute dayGridFocusmanager
    * @default {
    *    activeDescendant: 0,
    *    circular: false,
    *    descendants: '.' + CSS_SCHEDULER_VIEW_DAY_MARKER_CHILD,
    *    keys: {
    *        next: 'down:40',
    *        previous: 'down:38'
    *    }
    * }
    * @type {Object}
    */
    dayGridFocusmanager: {
        value: {
            activeDescendant: 0,
            circular: false,
            descendants: '.' + CSS_SCHEDULER_VIEW_DAY_MARKER_CHILD,
            keys: {
                next: 'down:40',
                previous: 'down:38'
            }
        },
        validator: isObject
    },

    /**
    * String representing the table marker class.
    *
    * @attribute markerNodeClass
    * @default '.' + CSS_SCHEDULER_VIEW_DAY_MARKER_CHILD
    * @type {String}
    */
    markerNodeClass: {
        value: '.' + CSS_SCHEDULER_VIEW_DAY_MARKER_CHILD,
        validator: isString
    },

    /**
    * Defines the keyboard configuration object for
    * `Plugin.NodeFocusManager`.
    *
    * @attribute tableFocusmanager
    * @default {
    *    activeDescendant: 0,
    *    circular: false,
    *    descendants: '.' + CSS_SVT_COLGRID,
    *    keys: {
    *        next: 'down:40',
    *        previous: 'down:38'
    *    }
    * }
    * @type {Object}
    */
    tableFocusmanager: {
        value: {
            activeDescendant: 0,
            circular: false,
            descendants: '.' + CSS_SVT_COLGRID,
            keys: {
                next: 'down:39',
                previous: 'down:37'
            }
        },
        validator: isObject
    }

};

A.mix(SchedulerViewAccessibility.prototype, {

    /**
     * Construction logic executed during `SchedulerViewAccessibility` instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var instance = this;

        instance.after('render', instance._afterRendered, instance);
    },

    /**
     * Binds applicable events depending on host module.
     *
     * @method bindAccessibility
     */
    bindAccessibility: function() {
        var instance = this,
            markerNodeClass = instance.get('markerNodeClass');

        if (instance instanceof A.SchedulerTableView) {
            instance.tableRowContainer.delegate(
                'key', A.bind(instance._onEnterKeyDown, instance), 'down:13,16', '.' + CSS_SVT_COLGRID);

            instance.tableRowContainer.delegate(
                'key', A.bind(instance._onEnterKeyUp, instance), 'up:13,16', '.' + CSS_SVT_COLGRID);
        }
        else if (instance instanceof A.SchedulerDayView) {
            var scheduler = instance.get('scheduler');

            scheduler.after('dateChange', instance.syncAriaLabelsForHeaders, instance);

            instance.headerTableNode.delegate(
                'key', A.bind(instance._onEnterKeyHeader, instance), 'down:13', '.' + CSS_SCHEDULER_VIEW_DAY_HEADER_DAY);

            instance.tableNode.delegate(
                'key', A.bind(instance._onEnterKeyDown, instance), 'down:13,16', markerNodeClass);

            instance.tableNode.delegate(
                'key', A.bind(instance._onEnterKeyUp, instance), 'up:13,16', markerNodeClass);
        }

        instance._bindFocusManager(instance.get('visible'));
    },

    /**
     * Syncs the 'aria-label' attribute on column headers.
     *
     * @method syncAriaLabelsForHeaders
     */
    syncAriaLabelsForHeaders: function() {
        var instance = this,
            ariaLabelDateFormatter = instance.get('ariaLabelDateFormatter'),
            viewDate = instance.get('scheduler').get('viewDate');

        instance.colHeaderDaysNode.all('a').each(
            function(columnNode, i) {
                var columnDate = DateMath.add(viewDate, DateMath.DAY, i);

                columnNode.setAttribute('aria-label', ariaLabelDateFormatter.call(instance, columnDate));
            }
        );
    },

    /**
     * Handles 'activeDescendantChange' events coming from the
     * NodeFocusManager.
     *
     * @method _afterActiveDescendantChange
     * @param {EventFacade} event
     * @protected
     */
    _afterActiveDescendantChange: function(event) {
        var instance = this,
            newVal = event.newVal,
            focusManager = event.target,
            activeDescendant = focusManager.get('descendants').item(newVal);

        if (instance._enterKeyDown) {
            event.target = activeDescendant;

            instance._normalizeEvent(event);

            if (instance instanceof A.SchedulerTableView) {
                instance._onMouseMoveGrid(event);
            }
            else {
                instance._onMouseMoveTableCol(event);
            }
        }
    },

    /**
     * Fires after 'render' event.
     *
     * @method _afterRendered
     * @protected
     */
    _afterRendered: function() {
        var instance = this;

        instance.bindAccessibility();

        instance.syncAriaLabelsForHeaders();
    },

    /**
     * Binds the `Plugin.NodeFocusManager` that handles day view
     * table node keyboard navigation.
     *
     * @method _bindDayFocusManager
     * @protected
     */
    _bindFocusManager: function(visible) {
        var instance = this,
            nodeToPlug = null,
            focusManagerConfig = {};

        if (visible) {
            if (instance instanceof A.SchedulerTableView) {
                nodeToPlug = instance.tableRowContainer;
                focusManagerConfig = instance.get('tableFocusmanager');
            }
            else if (instance instanceof A.SchedulerDayView) {
                nodeToPlug = instance.tableNode;
                focusManagerConfig = instance.get('dayGridFocusmanager');
            }

            if (nodeToPlug) {
                nodeToPlug.plug(A.Plugin.NodeFocusManager, focusManagerConfig);
                instance.descendantChangeHandler = nodeToPlug.focusManager.after(
                    'activeDescendantChange', instance._afterActiveDescendantChange, instance);

                instance._bindFocusOnRecorderSave();
            }
        }
        else if (instance.descendantChangeHandler) {
            instance.descendantChangeHandler.detach();

            instance.tableNode.unplug(A.Plugin.NodeFocusManager);
            instance.tableRowContainer.unplug(A.Plugin.NodeFocusManager);
        }
    },

    /**
     * Binds the listener that focuses the last focused tableNode element after
     * `recorder` fires `save`.
     *
     * @method _bindFocusOnRecorderSave
     * @protected
     */
    _bindFocusOnRecorderSave: function() {
        var instance = this,
            focusManager = null,
            scheduler = instance.get('scheduler'),
            recorder = scheduler.get('eventRecorder');

        if (instance instanceof A.SchedulerTableView) {
            focusManager = instance.tableRowContainer.focusManager;
        }
        else {
            focusManager = instance.tableNode.focusManager;
        }

        recorder.on('save', function() {
            this.popover.onceAfter('visibleChange', focusManager.focus, focusManager);
        });
    },

    /**
     * Sets properties on key event so it can be passed to mouse
     * event handlers.
     *
     * @method _normalizeEvent
     * @protected
     */
    _normalizeEvent: function(event) {
        var instance = this,
            target = event.target,
            colNumber = parseInt(target.getData('colnumber')),
            centerXY = target.getCenterXY();

        event.pageX = centerXY[0];
        event.pageY = centerXY[1];

        if (instance instanceof A.SchedulerDayView) {
            var column = instance.colDaysNode.item(colNumber);

            event.currentTarget = column;
        }
    },

    /**
     * Handles 'keyDown' event on the tableNode.
     *
     * @method _onEnterKeyDown
     * @param {EventFacade} event
     * @protected
     */
    _onEnterKeyDown: function(event) {
        var instance = this;

        instance._enterKeyDown = true;

        instance._normalizeEvent(event);

        if (instance instanceof A.SchedulerTableView) {
            instance._onMouseDownGrid(event);
        }
        else {
            instance._onMouseDownTableCol(event);
        }
    },

    /**
     * Handles 'keyDown' event on the tableNodeHeader.
     *
     * @method _onEnterKeyHeader
     * @param {EventFacade} event
     * @protected
    */
    _onEnterKeyHeader: function(event) {
        var instance = this;

        instance._onClickDaysHeader(event);
    },

    /**
     * Handles 'keyUp' event on the tableNode.
     *
     * @method _onEnterKeyUp
     * @param {EventFacade} event
     * @protected
     */
    _onEnterKeyUp: function(event) {
        var instance = this;

        if (instance._enterKeyDown) {
            instance._enterKeyDown = false;

            instance._normalizeEvent(event);

            if (instance instanceof A.SchedulerTableView) {
                instance._onMouseUpGrid(event);
            }
            else {
                instance._onMouseUpTableCol(event);
            }
        }
    }
});

A.SchedulerDayView.SchedulerViewAccessibility = SchedulerViewAccessibility;

A.Base.mix(A.SchedulerView, [SchedulerViewAccessibility]);