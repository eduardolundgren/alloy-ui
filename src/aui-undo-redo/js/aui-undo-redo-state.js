var _NAME = 'aui-undo-redo-state',

    /**
     * If state is asynchronous, signals state merge with another state.
     *
     * @event merge
     * @param event {EventFacade} An Event object
     */

    /**
     * Signals state redo process.
     *
     * @event redo
     * @param event {EventFacade} An Event object
     */

    /**
     * Signals state undo process.
     *
     * @event undo
     * @param event {EventFacade} An Event object
     */

    /**
     * Create UndoRedoState class which represents a state.
     *
     * @class UndoRedoState
     * @extends Base
     * @param {Object} config Object literal specifying configuration properties.
     * @constructor
     */

    UndoRedoState = A.Base.create(_NAME, A.Base, [], {
        /**
         * Construction logic executed during `UndoRedoState` instantiation. Lifecycle.
         *
         * @method initializer
         * @protected
         */
        initializer: function() {
            var instance = this;

            instance.publish({
                merge: {
                    defaultFn: instance._defMergeFn
                },
                redo: {
                    defaultFn: instance._defRedoFn
                },
                undo: {
                    defaultFn: instance._defUndoFn
                }
            });
        },

        /**
         * In case of `asynchronous` state, the implementation should overwrite the default method (`_defMergeFn`)
         * and implement the merge logic, or overwrite the entire `merge` method, then fire `merge` event.
         * The event should contain a property, `merge` which should be `false` if the state has been not merged.
         * or `true` if it was merged with the previous one.
         * In face of `synchronous` state, this method should return true if this state has been merged with the
         * previous one, and false otherwise.
         *
         * @method merge
         * @param {A.UndoRedoState} newState The state to merge with.
         * @return {Boolean} false In case of `synchronous` state, undefined otherwise.
         */
        merge: function() {
            var instance = this;

            if (instance.get('async')) {
                instance.fire('merge', {
                    merge: false
                });
            }
            else {
                return false;
            }
        },

        /**
         * Implements state redo. The implementation should overwrite this method,
         * or its default function (_defRedoFn) and if asynchronous, it should fire 'redo' event.
         *
         * @param event {EventFacade} An EventFacade object.
         * @method redo
         */
        redo: function() {
            var instance = this;

            instance.fire('redo');
        },

        /**
         * Implements state undo. The implementation should overwrite this method,
         * or its default function (`_defUndoFn`) and if asynchronous, it should fire 'undo' event.
         *
         * @param event {EventFacade} An EventFacade object.
         * @method undo
         */
        undo: function() {
            var instance = this;

            instance.fire('undo');
        },

        /**
         * Depending on the application, an UndoRedoState may merge with another state.
         * The default implementation adds `merge` property with `false` value to the event to indicate
         * the current state has been not merged with the previous state.
         *
         * @param event {EventFacade} An EventFacade object.
         * @method _defMergeFn
         * @protected
         */
        _defMergeFn: function(event) {
            event.merge = false;
        },

        /**
         * The default function which should execute on state redo.
         *
         * @param event {EventFacade} An EventFacade object.
         * @method _defRedoFn
         * @protected
         */
        _defRedoFn: function() {},

        /**
         * The default function which should execute on state undo.
         *
         * @method _defUndoFn
         * @param event {EventFacade} An EventFacade object.
         * @protected
         */
        _defUndoFn: function() {}
    }, {
        _NAME: _NAME,

        ATTRS: {
            /**
             * Boolean, shows if the state should be processed asynchronously. By default is false.
             *
             * @attribute async
             */
            async: {
                validator: A.Lang.isBoolean,
                value: false
            }
        }
    });

A.UndoRedoState = UndoRedoState;
