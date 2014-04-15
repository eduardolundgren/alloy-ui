/**
 * UndoRedo Framework component
 *
 * @module aui-undo-redo
 */

var Lang = A.Lang,

    _NAME = 'UndoRedo',

    ADD = 'add',
    ASYNC = 'async',
    MERGE = 'merge',
    REDO_FINISHED = 'redoFinished',
    UNDO_FINISHED = 'undoFinished',
    BEFORE_REDO = 'beforeRedo',
    BEFORE_UNDO = 'beforeUndo',
    UNLIMITED = -1,

    /**
     * Create UndoRedo class to manage list of undoable states.
     *
     * @class UndoRedo
     * @extends Base
     * @param {Object} config Object literal specifying configuration
     *     properties.
     * @constructor
     */

    UndoRedo = A.Base.create(_NAME, A.Base, [], {
        /**
         * Signals an `A.UndoRedoState` has been added to list.
         *
         * @event add
         * @param event {EventFacade} An EventFacade object with the following attribute specific properties added:
         *  <dl>
         *      <dt>state</dt>
         *          <dd>An `A.UndoRedoState` added to the list</dd>
         *  </dl>
         */

        /**
         * Signals an `A.UndoRedoState` has been merged with another state.
         *
         * @event merge
         * @param event {EventFacade} An EventFacade object with the following attribute specific properties added:
         *  <dl>
         *      <dt>`A.UndoRedoState` state</dt>
         *          <dd>The state, accepted merge</dd>
         *      <dt>`A.UndoRedoState` mergedState</dt>
         *          <dd>The merged state</dd>
         *  </dl>
         */

        /**
         * Signals the beginning of the process in which one or more states will be undone.
         *
         * @event beforeUndo
         * @param event {EventFacade} An EventFacade object
         */

        /**
         * Signals the end of undo process.
         *
         * @event undoFinished
         * @param event {EventFacade} An EventFacade object
         *  <dl>
         *      <dt>state</dt>
         *          <dd>The last `A.UndoRedoState` object in undo process</dd>
         *  </dl>
         */

        /**
         * Signals the beginning of the process in which one or more states will be redone.
         *
         * @event beforeRedo
         * @param event {EventFacade} An EventFacade object
         */

        /**
         * Signals the end of redo process.
         *
         * @event redoFinished
         * @param event {EventFacade} An EventFacade object
         *  <dl>
         *      <dt>state</dt>
         *          <dd>The last `A.UndoRedoState` object in redo process</dd>
         *  </dl>
         */

        /**
         * Destructor lifecycle implementation for UndoRedo class.
         * Removes all states.
         *
         * @method destructor
         * @protected
         */
        destructor: function() {
            var instance = this;

            instance.purge();
        },

        /**
         * Adds an UndoRedoState to UndoRedo.
         * Tries to merge the last state with the `newState`, passed as parameter. If merging was refused,
         * places the `newState` at the end of the list.
         * Fires `add` event if state has been added to the list, or `merge` if `newState` has been merged.
         *
         * @method add
         * @param {A.UndoRedoState} newState The state to be added
         * @return {Boolean} False if the limit has been reached or process or UndoRedo still processes a state.
         */
        add: function(newState) {
            var instance = this,
                curState = null,
                limit,
                undoIndex;

            limit = instance.get('limit');

            if (instance._processing || instance._undoIndex === limit) {
                return false;
            }

            undoIndex = instance._undoIndex;

            instance._removeOrphanStates();

            if (undoIndex > 0) {
                curState = instance._states[undoIndex - 1];
            }

            if (curState) {
                instance._mergeOrAddState(curState, newState);
            }
            else {
                instance._addState(curState, newState);
            }
        },

        /**
         * Checks if redo can be done. The function will return false if there are no states in the list,
         * current index is equal to the length of the list or UndoRedo is waiting for another asynchronous state to complete.
         *
         * @method canRedo
         * @return {Boolean} true if redo is possible, false otherwise
         */
        canRedo: function() {
            var instance = this;

            return (!instance._processing && instance._undoIndex < instance._states.length);
        },

        /**
         * Checks if undo can be done. The function will return false if there are no states in the list,
         * the current index is 0 or UndoRedo is waiting for another asynchronous state to complete.
         *
         * @method canUndo
         * @return {Boolean} true if undo is possible, false otherwise
         */
        canUndo: function() {
            var instance = this;

            return (!instance._processing && instance._undoIndex > 0);
        },

        /**
         * Removes all states from the list and flags UndoRedo that no any undo/redo process is currently executed.
         *
         * @method purge
         */
        purge: function() {
            var instance = this;

            instance._states.length = 0;

            instance._processing = false;

            instance._undoIndex = 0;
        },

        /**
         * Calls the `redo` method of a state.
         * If `async` attribute of the state is true, UndoRedo waits until state fires `redoFinished` event.
         * During this time, adding new states will be suspended.
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
         * Calls the `undo` method of a state.
         * If `async` attribute of the state is true, UndoRedo waits until state fires `undoFinished` event.
         * During this time, adding new states will be suspended.
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
         * Handles the completion of redo method of an asynchronous state.
         * Checks if `newIndex` is bigger than current index and if true,
         * invokes _redoTo again, or fires `redoFinished` event otherwise.
         *
         * @method _afterRedoFinished
         * @protected
         * @param {A.UndoRedoState} state The asynchronous state which redo method has been completed.
         * @param {Number} newIndex The new value of `this._undoIndex`
         */
        _afterRedoFinished: function(state, newIndex) {
            var instance = this;

            ++instance._undoIndex;

            if (instance._undoIndex < newIndex) {
                instance._redoTo(newIndex);
            }
            else {
                instance._processing = false;

                instance.fire(REDO_FINISHED, {
                    'state': state
                });
            }
        },

        /**
         * Handles the completion of undo method of an asynchronous state.
         * Checks if `newIndex` is less than current index and if true,
         * invokes _undoTo again, or fires `undoFinished` event otherwise.
         *
         * @method _afterUndoFinished
         * @protected
         * @param {A.UndoRedoState} state The asynchronous state which undo method has been completed.
         * @param {Number} newIndex The new value of `undoIndex`
         */
        _afterUndoFinished: function(state, newIndex) {
            var instance = this;

            --instance._undoIndex;

            if (instance._undoIndex > newIndex) {
                instance._undoTo(newIndex);
            }
            else {
                instance._processing = false;

                instance.fire(UNDO_FINISHED, {
                    'state': state
                });
            }
        },

        /**
         * Merges a state with another one or adds the state in the list with states.
         *
         * @method _mergeOrAddState
         * @param curState {A.UndoRedoState} the last state, which should be merged with the new one
         * @param newState {A.UndoRedoState} the new state, which should be merged with the previous one
         * @protected
         */
        _mergeOrAddState: function(curState, newState) {
            var instance = this;

            if (curState && curState.get(ASYNC)) {
                curState.onceAfter('merge', function(event) {
                    instance._addState(curState, newState, {
                        merge: event.merge
                    });
                });

                curState.merge(newState);
            }
            else {
                instance._addState(curState, newState, {
                    merge: curState ? curState.merge(newState) : false
                });
            }
        },

        /**
         * Executes after adding a state. If the passed state has been merged with an already
         * existing state, the function fires `merge` event, which contains the following properties
         * + `state` - The previous state
         * + `mergedState` - The state which has been merged with the previous state
         *
         * @method _addState
         * @param curState {UndoRedoState} - The state which might be merged with the newState
         * @param newState {UndoRedoState} - The new state which might be merged with curState
         * @param config {Object} - Configuration param, contains `merge` property if newState has been
         * merged with curState
         * @protected
         */
        _addState: function(curState, newState, config) {
            var instance = this;

            if (config && config.merge) {
                instance.fire(MERGE, {
                    'state': curState,
                    'mergedState': newState
                });
            }
            else {
                instance._states.push(newState);

                ++instance._undoIndex;

                instance.fire(ADD, {
                    state: newState
                });
            }
        },

        /**
         * Invokes `redo` method of all states from current index to `newIndex`.
         *
         * @method _redoTo
         * @param newIndex The new value of `this._undoIndex`
         * @protected
         */
        _redoTo: function(newIndex) {
            var instance = this,
                state;

            state = instance._states[instance._undoIndex];

            if (!instance._processing) {
                instance.fire(BEFORE_REDO);

                instance._processing = true;
            }

            if (state.get(ASYNC)) {
                state.onceAfter('redo', A.bind(instance._afterRedoFinished, instance, state, newIndex));

                state.redo();
            }
            else {
                state.redo();

                instance._afterRedoFinished(state, newIndex);
            }
        },

        /**
         * Checks if there are orphan states and removes them.
         * Orphan states means states which stay after the current value `this._undoIndex`.
         * Example: if `this._undoIndex` points to the third element in `states` array, orphan are
         * all states in position 4, 5, 6, etc.
         *
         * @method _removeOrphanStates
         * @protected
         */
        _removeOrphanStates: function() {
            var instance = this,
                orphanStatesIndex,
                states,
                undoIndex;

            states = instance._states;
            undoIndex = instance._undoIndex;

            orphanStatesIndex = states.length - undoIndex;

            if (orphanStatesIndex) {
                states.splice(undoIndex, orphanStatesIndex);
            }
        },

        /**
         * Invokes `undo` method of all states from current index to `newIndex`.
         *
         * @method _undoTo
         * @protected
         * @param newIndex The new value of `undoIndex`
         */
        _undoTo: function(newIndex) {
            var instance = this,
                state;

            state = instance._states[instance._undoIndex - 1];

            if (!instance._processing) {
                instance.fire(BEFORE_UNDO);

                instance._processing = true;
            }

            if (state.get(ASYNC)) {
                state.onceAfter('undo',
                    A.bind(instance._afterUndoFinished, instance, state, newIndex));

                state.undo();
            }
            else {
                state.undo();

                instance._afterUndoFinished(state, newIndex);
            }
        },

        /**
         * Collection of states.
         * @property _states
         * @protected
         * @type {Array}
         */
        _states: [],

        /**
         * Boolean, indicates if UndoRedo is currently processing a state
         *
         * @property _processing
         * @protected
         * @type {Boolean}
         */
        _processing: false,

        /**
         ** Indicates the size of the current list of states.
         * Otherwise, its value is the index of the last state that was undone.
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
             * Holds the maximum number of states. Adding new states will be prevented once
             * the limit is reached. By default the number of states is not limited.
             *
             * @attribute limit
             * @type {Number}
             * @default -1 (unlimited)
             */
            limit: {
                validator: function(value) {
                    return (Lang.isNumber(value) && (value > 0 || value === -1));
                },
                value: UNLIMITED
            },

            /**
             * The index of command, that will be executed on the next call to redo().
             * If undo() has been not invoked, the value is the size of the current list of states.
             * Otherwise, it is the index of the last state that was undone.
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
