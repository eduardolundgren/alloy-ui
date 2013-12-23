/**
 * UndoRedo Framework component
 *
 * @module aui-undo-redo
 */

var Lang = A.Lang,

    _NAME = 'UndoRedo',

    ACTION_ADDED = 'actionAdded',
    ACTION_CANCELED = 'actionCanceled',
    ACTION_MERGED = 'actionMerged',
    ACTION_REDO_FINISHED = 'actionRedoFinished',
    ACTION_UNDO_FINISHED = 'actionUndoFinished',
    ASYNC_PROCESSING = 'asyncProcessing',
    BEFORE_CANCELING = 'beforeCanceling',
    BEFORE_PURGE = 'beforePurge',
    BEFORE_REDO = 'beforeRedo',
    BEFORE_UNDO = 'beforeUndo',
    CANCELING_FINISHED = 'cancelingFinished',
    PURGE_FINISHED = 'purgeFinished',
    REDO_FINISHED = 'redoFinished',
    UNDO_FINISHED = 'undoFinished',
    UNLIMITED = 0,

    /**
     * Create UndoRedo class to manage list of undoable actions.
     *
     * @class UndoRedo
     * @extends Base
     * @param {Object} config Object literal specifying configuration
     *     properties.
     * @constructor
     */

    UndoRedo = A.Base.create(_NAME, A.Base, [], {
        /**
         * Signals an `A.UndoRedoAction` has been added to list
         *
         * @event actionAdded
         * @param event {EventFacade} An EventFacade object with the following attribute specific properties added:
         *  <dl>
         *      <dt>action</dt>
         *          <dd>An `A.UndoRedoAction` added to the list</dd>
         *  </dl>
         */

        /**
         * Signals an `A.UndoRedoAction` has been merged with another one
         *
         * @event actionMerged
         * @param event {EventFacade} An EventFacade object with the following attribute specific properties added:
         *  <dl>
         *      <dt>`A.UndoRedoAction` action</dt>
         *          <dd>The action, accepted merge</dd>
         *      <dt>`A.UndoRedoAction` mergedAction</dt>
         *          <dd>The merged action</dd>
         *  </dl>
         */

        /**
         * Signals the beginning of a process in which one or more actions will be canceled.
         *
         * @event beforeCanceling
         * @param event {EventFacade} An EventFacade object
         */

        /**
         * Signals an action has been canceled.
         *
         * @event actionCanceled
         * @param event {EventFacade} An EventFacade object with the following attribute specific properties added:
         *  <dl>
         *      <dt>action</dt>
         *          <dd>An `A.UndoRedoAction` canceled</dd>
         *      <dt>index</dt>
         *          <dd>The index of the action in the list</dd>
         *  </dl>
         */

        /**
         * Signals a canceling actions process has been finished.
         *
         * @event cancelingFinished
         * @param event {EventFacade} An EventFacade object
         */

        /**
         * Signals the beginning of a process in which one or more actions will be purged from the list.
         *
         * @event beforePurge
         * @param event {EventFacade} An EventFacade object
         */

        /**
         * Signals the end of purge process. `UndoRedo` cancels each action before its removing.
         *
         * @event purgeFinished
         * @param event {EventFacade} An EventFacade object
         */

        /**
         * Signals the beginning of a process in which one or more actions will be undone.
         *
         * @event beforeUndo
         * @param event {EventFacade} An EventFacade object
         */

        /**
         * Signals an action undor process has been finished.
         *
         * @event actionUndoFinished
         * @param event {EventFacade} An EventFacade object with the following attribute specific properties added:
         *  <dl>
         *      <dt>action</dt>
         *          <dd>An `A.UndoRedoAction` which undo process has been finished</dd>
         *      <dt>index</dt>
         *          <dd>The index of the action in the list</dd>
         *  </dl>
         */

        /**
         * Signals the end of undo process.
         *
         * @event undoFinished
         * @param event {EventFacade} An EventFacade object
         */

        /**
         * Signals the beginning of a process in which one or more actions will be redone.
         *
         * @event beforeRedo
         * @param event {EventFacade} An EventFacade object
         */

        /**
         * Signals an action redo process has been finished.
         *
         * @event actionRedoFinished
         * @param event {EventFacade} An EventFacade object with the following attribute specific properties added:
         *  <dl>
         *      <dt>action</dt>
         *          <dd>An `A.UndoRedoAction` which redo process has been finished</dd>
         *      <dt>index</dt>
         *          <dd>The index of the action in the list</dd>
         *  </dl>
         */

        /**
         * Signals the end of redo process.
         *
         * @event redoFinished
         * @param event {EventFacade} An EventFacade object
         */

        /**
         * Publishes events and subscribes to after event for limit.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this;

            instance.after('limitChange', A.bind(instance._afterLimit, this));
        },

        /**
         * Destructor lifecycle implementation for UndoRedo class.
         * Removes and cancels the added actions.
         *
         * @method destructor
         * @protected
         */
        destructor: function() {
            var instance = this;

            instance.purgeAll();
        },

        /**
         * Adds an UndoRedoAction to UndoRedo.<br>
         * Removes and cancels all actions from the current action index till the end of the list.
         * Tries to merge the current action with the `newAction`, passed as parameter.
         * If `currentAction.merge(newAction)` returns false, UndoRedo places the `newAction` at the end of the list.<br>
         * Fires `actionAdded` event if action has been added to the list, or `actionMerged` if `newAction` has been merged.
         * @method add
         * @param {A.UndoRedoAction} newAction The action to be added
         * @return {Boolean} True if action was added to the list. The result might be False if UndoRedo was processing another (asynchronous) action.
         */
        add: function(newAction) {
            var instance = this,
                actions,
                curAction = null,
                merged = false,
                tmp,
                undoIndex;

            if (instance._processing) {
                return false;
            }

            actions = instance._actions;

            undoIndex = instance._undoIndex;

            if (undoIndex > 0) {
                curAction = actions[undoIndex - 1];
            }

            if (undoIndex < actions.length) {
                instance.fire(BEFORE_CANCELING);

                while (undoIndex < actions.length) {
                    tmp = actions.splice(-1, 1)[0];

                    tmp.cancel();

                    instance.fire(ACTION_CANCELED, {
                        action: tmp,
                        index: actions.length
                    });
                }

                instance.fire(CANCELING_FINISHED);
            }

            if (curAction) {
                merged = curAction.merge(newAction);

                if (!merged) {
                    actions.push(newAction);
                }
            }
            else {
                actions.push(newAction);
            }

            if (!merged) {
                instance._undoIndex++;

                instance._limitActions();

                instance.fire(ACTION_ADDED, {
                    action: newAction
                });
            }
            else {
                instance.fire(ACTION_MERGED, {
                    'action': curAction,
                    'mergedAction': newAction
                });
            }

            return true;
        },

        /**
         * Checks if redo can be done. The function will return false if there are no actions in the list,
         * current index is equal to the length of the list or UndoRedo is waiting for another asynchronous action to complete.
         *
         * @method canRedo
         * @return {Boolean} true if redo is possible, false otherwise
         */
        canRedo: function() {
            var instance = this;

            return (!instance._processing && instance._undoIndex < instance._actions.length);
        },

        /**
         * Checks if undo can be done. The function will return false if there are no actions in the list,
         * the current index is 0 or UndoRedo is waiting for another asynchronous action to complete.
         *
         * @method canUndo
         * @return {Boolean} true if undo is possible, false otherwise
         */
        canUndo: function() {
            var instance = this;

            return (!instance._processing && instance._undoIndex > 0);
        },

        /**
         * If redo is posible, returns the value of `label` property of the action to be redone.
         *
         * @method getRedoLabel
         * @return {String} The value of label property
         */
        getRedoLabel: function() {
            var instance,
                action;

            if (instance.canRedo()) {
                action = instance._actions[instance._undoIndex];

                return action.get('label');
            }

            return null;
        },

        /**
         * If undo is posible, returns the value of `label` property of the action to be undone.
         *
         * @method getUndoLabel
         * @return {String} The value of label property
         */
        getUndoLabel: function() {
            var instance = this,
                action;

            if (instance.canUndo()) {
                action = instance._actions[instance._undoIndex - 1];

                return action.get('label');
            }

            return null;
        },

        /**
         * Calls undo or redo methods of the actions registered while current index is less or greater than the `newIndex` passed.
         *
         * @method processTo
         * @param newIndex The new value of `undoIndex`
         */
        processTo: function(newIndex) {
            var instance = this;

            if (Lang.isNumber(newIndex) && !instance._processing &&
                newIndex >= 0 && newIndex <= instance._actions.length) {

                if (instance._undoIndex < newIndex) {
                    instance._redoTo(newIndex);
                }
                else if (instance._undoIndex > newIndex) {
                    instance._undoTo(newIndex);
                }
            }
        },

        /**
         * Cancels and removes all actions from the list
         *
         * @method purgeAll
         */
        purgeAll: function() {
            var instance = this;

            instance.purgeTo(0);
        },

        /**
         * Cancels and removes actions from the end of the list (the most recent actions) to the index, passed as parameter.
         *
         * @method purgeTo
         * @param {Number} index The index in the list to which actions should be be removed
         */
        purgeTo: function(index) {
            var instance = this,
                action,
                i;

            i = instance._actions.length - 1;

            if (i >= index) {
                instance.fire(BEFORE_PURGE);

                for (; i >= index; i--) {
                    action = instance._actions.splice(i, 1)[0];

                    action.cancel();

                    instance.fire(ACTION_CANCELED, {
                        'action': action,
                        index: i
                    });
                }

                if (instance._undoIndex > index) {
                    instance._undoIndex = index;
                }

                instance._processing = false;

                instance.fire(PURGE_FINISHED);
            }
        },

        /**
         * Redoes the action at current index by calling its `redo` method.
         * If `asyncProcessing` property of the action is true, UndoRedo waits until action fires `redoFinished` event.
         * During this time undoing/redoing and adding new actions will be suspended.
         *
         * @method redo
         */
        redo: function() {
            var instance = this;

            if (instance.canRedo()) {
                instance._redoTo(instance._undoIndex + 1);
            }
        },

        /**
         * Undoes the action before current index by calling its `undo` method.
         * If `asyncProcessing` property of the action is true, UndoRedo waits until action fires `undoFinished` event.
         * During this time undoing/redoing and adding new actions will be suspended.
         *
         * @method undo
         */
        undo: function() {
            var instance = this;

            if (instance.canUndo()) {
                instance._undoTo(instance._undoIndex - 1);
            }
        },

        /**
         * Invokes `_limitActions` in order to keep the number of actions in the list according to the `limit`.
         *
         * @method _afterLimit
         * @param params {Event} limitChange custom event
         * @protected
         */
        _afterLimit: function(params) {
            var instance = this;

            instance._limitActions(params.newVal);
        },

        /**
         * Removes actions from the list if their number exceedes the `limit`
         *
         * @method _limitActions
         * @param {Number} limit The max number of actions in the list
         * @protected
         */
        _limitActions: function(limit) {
            var instance = this,
                action,
                actions,
                actionsLeft,
                actionsRight,
                deleteLeft,
                deleteRight,
                halfLimit,
                i,
                index,
                j;

            if (!limit) {
                limit = instance.get('limit');
            }

            if (limit === UNLIMITED) {
                return;
            }

            actions = instance._actions;

            if (actions.length <= limit) {
                return;
            }

            index = instance._undoIndex;

            halfLimit = parseInt(limit / 2, 10);

            actionsLeft = limit - halfLimit;
            actionsRight = limit - actionsLeft;

            deleteLeft = index - actionsLeft;
            deleteRight = actions.length - index - actionsRight;

            if (deleteLeft < 0) {
                deleteRight += deleteLeft;
            }
            else if (deleteRight < 0) {
                deleteLeft += deleteRight;
            }

            if (deleteLeft > 0 || deleteRight > 0) {
                instance.fire(BEFORE_CANCELING);

                for (i = 0; i < deleteLeft; i++) {
                    instance._undoIndex--;

                    action = actions.splice(0, 1)[0];

                    action.cancel();

                    instance.fire(ACTION_CANCELED, {
                        'action': action,
                        index: 0
                    });
                }

                for (i = actions.length - 1, j = 0; j < deleteRight; i--, j++) {
                    action = actions.splice(i, 1)[0];

                    action.cancel();

                    instance.fire(ACTION_CANCELED, {
                        'action': action,
                        index: i
                    });
                }

                instance.fire(CANCELING_FINISHED);
            }
        },

        /**
         * Handles the completion of redo method of asynchronous action.
         * Fires `actionRedoFinished` event. Checks if `newIndex` is bigger than current index.
         * If true, invokes _redoTo again, or fires `redoFinished` event otherwise.
         *
         * @method _onAsyncRedoFinished
         * @protected
         * @param {A.UndoRedoAction} action The asynchronous action which redo method has been completed.
         * @param {Number} newIndex The new value of `undoIndex`
         */
        _onAsyncRedoFinished: function(action, newIndex) {
            var instance = this;

            instance._actionHandle.detach();
            instance._actionHandle = null;

            instance.fire(ACTION_REDO_FINISHED, {
                'action': action,
                index: instance._undoIndex - 1
            });

            if (instance._undoIndex < newIndex) {
                instance._redoTo(newIndex);
            }
            else {
                instance._processing = false;

                instance.fire(REDO_FINISHED, {
                    'action': action
                });
            }
        },

        /**
         * Handles the completion of undo method of asynchronous action.
         * Fires `actionUndoFinished` event. Checks if `newIndex` is less than current index.
         * If true, invokes _undoTo again, or fires `undoFinished` event otherwise.
         *
         * @method _onAsyncUndoFinished
         * @protected
         * @param {A.UndoRedoAction} action The asynchronous action which undo method has been completed.
         * @param {Number} newIndex The new value of `undoIndex`
         */
        _onAsyncUndoFinished: function(action, newIndex) {
            var instance = this;

            instance._actionHandle.detach();
            instance._actionHandle = null;

            instance.fire(ACTION_UNDO_FINISHED, {
                'action': action,
                index: instance._undoIndex
            });

            if (instance._undoIndex > newIndex) {
                instance._undoTo(newIndex);
            }
            else {
                instance._processing = false;

                instance.fire(UNDO_FINISHED, {
                    'action': action
                });
            }
        },

        /**
         * Redoes all actions from current index to `newIndex`. In case of asynchronous action, waits until action fires `redoFinished` event.
         *
         * @method _redoTo
         * @protected
         * @param newIndex The new value of `undoIndex`
         */
        _redoTo: function(newIndex) {
            var instance = this,
                action;

            action = instance._actions[instance._undoIndex];

            if (!instance._processing) {
                instance.fire(BEFORE_REDO);

                instance._processing = true;
            }

            if (!action.get(ASYNC_PROCESSING)) {
                action.redo();

                instance.fire(ACTION_REDO_FINISHED, {
                    'action': action,
                    index: instance._undoIndex
                });

                ++instance._undoIndex;

                if (instance._undoIndex < newIndex) {
                    instance._redoTo(newIndex);
                }
                else {
                    instance._processing = false;

                    instance.fire(REDO_FINISHED);
                }
            }
            else {
                instance._actionHandle = action.on(REDO_FINISHED,
                    A.bind(instance._onAsyncRedoFinished, instance, action, newIndex));

                action.redo();

                ++instance._undoIndex;
            }
        },

        /**
         * Undoes all actions from current index to `newIndex`. In case of asynchronous action, waits until action fires `undoFinished` event.
         *
         * @method _undoTo
         * @protected
         * @param newIndex The new value of `undoIndex`
         */
        _undoTo: function(newIndex) {
            var instance = this,
                action;

            action = instance._actions[--instance._undoIndex];

            if (!instance._processing) {
                instance.fire(BEFORE_UNDO);

                instance._processing = true;
            }

            if (!action.get(ASYNC_PROCESSING)) {
                action.undo();

                instance.fire(ACTION_UNDO_FINISHED, {
                    'action': action,
                    index: instance._undoIndex
                });

                if (instance._undoIndex > newIndex) {
                    instance._undoTo(newIndex);
                }
                else {
                    instance._processing = false;

                    instance.fire(UNDO_FINISHED);
                }
            }
            else {
                instance._actionHandle = action.on(UNDO_FINISHED,
                    A.bind(instance._onAsyncUndoFinished, instance, action, newIndex));

                action.undo();
            }
        },

        /**
         * Collection of actions.
         * @property _actions
         * @protected
         * @type {Array}
         */
        _actions: [],

        /**
         * The handle of the currently executed asynchronous action
         *
         * @property _actionHandle
         * @protected
         * @type {Object}
         */
        _actionHandle: null,

        /**
         * Boolean, indicates if UndoRedo is currently processing an action
         *
         * @property _processing
         * @protected
         * @type {Boolean}
         */
        _processing: false,

        /**
         * If undo() has been not invoked, _undoIndex is the size of the current list of actions.
         * Otherwise, it is the index of the last action that was undone.
         *
         * @property _undoIndex
         * @protected
         * @type {Number}
         */
        _undoIndex: 0
    }, {
        /**
         * Static property used to define the default attribute configuration of UndoRedo.
         *
         * @property UndoRedo.ATTRS
         * @type Object
         * @protected
         * @static
         */
        ATTRS: {

            /**
             * Holds the maximum number of actions in UndoRedo. By default the number of actions is not limited.
             *
             * @attribute limit
             * @type {Number}
             * @default 0 (unlimited)
             */
            limit: {
                validator: function(value) {
                    return (Lang.isNumber(value) && value >= 0);
                },
                value: UNLIMITED
            },

            /**
             * The index of command, that will be executed on the next call to redo().
             * If undo() has been not invoked, the value is the size of the current list of actions.
             * Otherwise, it is the index of the last action that was undone.
             *
             * @attribute undoIndex
             * @type {Number}
             * @readOnly
             */
            undoIndex: {
                getter: function() {
                    var instance = this;

                    return instance._undoIndex;
                },
                readOnly: true
            }
        }
    });

A.UndoRedo = UndoRedo;
