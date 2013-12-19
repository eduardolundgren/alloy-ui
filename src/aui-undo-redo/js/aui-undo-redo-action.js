var Lang = A.Lang,

    _NAME = 'aui-undo-redo-action',

    LABEL = 'label',
    BEFOREREDO = 'beforeRedo',
    BEFOREUNDO = 'beforeUndo',
    REDOFINISHED = 'redoFinished',
    UNDOFINISHED = 'undoFinished',

    /**
     * Signals the beginning of action undo.
     *
     * @event beforeUndo
     * @param event {EventFacade} An Event object
     */

    /**
     * Signals the end of action undo.
     *
     * @event undoFinished
     * @param event {EventFacade} An Event object
     */

    /**
     * Signals the beginning of action redo.
     *
     * @event beforeRedo
     * @param event {EventFacade} An Event object
     */

    /**
     * Signals the end of action redo.
     *
     * @event redoFinished
     * @param event {EventFacade} An Event object
     */

    /**
     * Create UndoRedoAction class which represents an undoable action.
     *
     * @class UndoRedoAction
     * @extends Base
     * @param {Object} config Object literal specifying configuration
     *     properties.
     * @constructor
     */

    UndoRedoAction = A.Base.create(_NAME, A.Base, [], {
        /**
         * Container for child actions of this action
         *
         * @property _childActions
         * @protected
         * @type Array
         */
        _childActions: [],

        /**
         * UndoManager invokes `cancel` method of action before removing it from the list.
         * The default implemetation does nothing.
         *
         * @method cancel
         */
        cancel: function() {},

        /**
         * Depending on the application, an UndoRedoAction may merge with another action.
         * If merge was successfull, merge must return true; otherwise false.
         * The default implemetation returns false.
         *
         * @method merge
         * @param {A.UndoRedoAction} newAction The action to merge with
         * @return {Boolean} false
         */
        merge: function() {
            return false;
        },

        /**
         * The default implemetation redoes all child actions.
         *
         * @method redo
         */
        redo: function() {
            var instance = this,
                action,
                childActions,
                i,
                length;

            instance.fire(BEFOREREDO);

            childActions = instance._childActions;
            length = childActions.length;

            for (i = 0; i < length; i++) {
                action = childActions[i];
                action.redo();
            }

            instance.fire(REDOFINISHED);
        },

        /**
         * The default implemetation undoes all child actions in reverse order.
         *
         * @method undo
         */
        undo: function() {
            var instance = this,
                action,
                childActions,
                i;

            instance.fire(BEFOREUNDO);

            childActions = instance._childActions;

            for (i = childActions.length - 1; i > 0; i--) {
                action = childActions[i];
                action.undo();
            }

            instance.fire(UNDOFINISHED);
        },

        /**
         * Overrides `toString()` method.
         * The default implementation returns the value of `label` property.
         */
        toString: function() {
            var instance = this;

            return instance.get(LABEL);
        }
    }, {
        _NAME: _NAME,

        ATTRS: {
            /**
             * Boolean, indicates if action must be processed asynchronously.
             * If true, `undo` method must fire `undoFinished` event.
             * Respectively, `redo` method must fire `redoFinished` event
             *
             * @attribute asyncProcessing
             * @type {Boolean}
             * @default false
             */
            asyncProcessing: {
                validator: Lang.isBoolean,
                value: false
            },

            /**
             * The label of action
             *
             * @attribute label
             * @type {String}
             * @default ''
             */
            label: {
                validator: Lang.isString,
                value: ''
            }
        }
    });

A.UndoRedoAction = UndoRedoAction;
