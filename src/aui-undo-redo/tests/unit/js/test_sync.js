YUI.add('module-tests', function(Y) {

    //--------------------------------------------------------------------------
    // AUI UndoRedo Syncronous Tests
    //--------------------------------------------------------------------------

    var suite = new Y.Test.Suite('aui-undo-redo');

    var testArray = [],
        total = 0,
        synStates = 20,
        undoRedo;

    var TestUndoRedoState = Y.Base.create('testUndoState', Y.UndoRedoState, [], {
        undo: function() {
            testArray.splice(-1, 1);
        },

        redo: function() {
            testArray.push(testArray.length);
        }
    });

    var UndoRedoStateMerge = Y.Base.create('stateMerge', Y.UndoRedoState, [], {
        undo: function() {
            var instance = this,
                number;

            number = instance.get('number');

            total -= number;
        },

        redo: function() {
            var instance = this,
                number;

            number = instance.get('number');

            total += number;
        },

        merge: function(newState) {
            var instance = this,
                curNumber,
                newNumber;

            curNumber = instance.get('number');
            newNumber = newState.get('number');

            instance.set('number', curNumber + newNumber);

            return true;
        }
    }, {
        ATTRS: {
            number: {
                value: 0,
                validator: Y.Lang.isNumber
            }
        }
    });

    undoRedo = new Y.UndoRedo();

    undoRedo.after('add', Y.bind(function(attrs) {
        var state = attrs.state;

        Y.Assert.isInstanceOf(Y.UndoRedoState, state);
    }, this));

    undoRedo.after('merge', Y.bind(function(attrs) {
        var state = attrs.state,
            mergedState = attrs.mergedState;

        Y.Assert.isInstanceOf(Y.UndoRedoState, state);
        Y.Assert.isInstanceOf(Y.UndoRedoState, mergedState);
    }, this));

    suite.add(new Y.Test.Case({
        name: 'Test synchronous state',

        'test adding states': function() {
            var state, canUndo, canRedo, i;

            for (i = 0; i < synStates; i++) {
                state = new TestUndoRedoState();

                state.redo();
                undoRedo.add(state);
            }

            canUndo = undoRedo.canUndo();
            canRedo = undoRedo.canRedo();

            Y.Assert.areEqual(true, canUndo, 'Undoing must be allowed');
            Y.Assert.areEqual(false, canRedo, 'Redoing must be not allowed');
            Y.Assert.areEqual(synStates, testArray.length, 'There must be ' + synStates +
                ' states in testArray');
            Y.Assert.areEqual(synStates, undoRedo.get('undoIndex'), 'Undo index must be: ' +
                synStates);
        },

        'test undo state': function() {
            var undoIndex, i;

            for (i = synStates - 1; i > 0; i--) {
                undoRedo.undo();

                undoIndex = undoRedo.get('undoIndex');

                Y.Assert.areEqual(i, undoIndex, 'Undo index must be: ' + i);
                Y.Assert.areEqual(true, undoRedo.canUndo(), 'Undoing must be allowed');
                Y.Assert.areEqual(true, undoRedo.canRedo(), 'Redoing must be allowed');
                Y.Assert.areEqual(i, testArray.length, 'Test array must contain:' + i + ' states');
            }

            undoRedo.undo();
            undoIndex = undoRedo.get('undoIndex');

            Y.Assert.areEqual(0, undoIndex, 'Undo index must be: ' + 0);
            Y.Assert.areEqual(false, undoRedo.canUndo(), 'Undoing must be not allowed');
            Y.Assert.areEqual(true, undoRedo.canRedo(), 'Redoing must be allowed');

            Y.Assert.areEqual(0, testArray.length, 'Test array must be empty');
        },

        'test redo state': function() {
            var undoIndex, i;

            for (i = 0; i < synStates - 1; i++) {
                undoRedo.redo();

                undoIndex = undoRedo.get('undoIndex');

                Y.Assert.areEqual(i + 1, undoIndex, 'Undo index must be: ' + (i + 1));
                Y.Assert.areEqual(true, undoRedo.canUndo(), 'Undoing must be allowed');
                Y.Assert.areEqual(true, undoRedo.canRedo(), 'Redoing must be allowed');
                Y.Assert.areEqual(i + 1, testArray.length, 'Test array must contain:' + (i + 1) +
                    ' states');
            }

            undoRedo.redo();
            undoIndex = undoRedo.get('undoIndex');

            Y.Assert.areEqual(synStates, undoIndex, 'Undo index must be: ' + synStates);
            Y.Assert.areEqual(true, undoRedo.canUndo(), 'Undoing must be allowed');
            Y.Assert.areEqual(false, undoRedo.canRedo(), 'Redoing must be not allowed');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Test merging state',

        'test merge states': function() {
            var number1 = 2,
                number2 = 3,
                state;

            state = new UndoRedoStateMerge({
                number: number1
            });

            state.redo();

            undoRedo.add(state);

            state = new UndoRedoStateMerge({
                number: number2
            });

            state.redo();

            undoRedo.add(state);

            Y.Assert.areEqual(5, total, 'Total number must be ' + (number1 + number2));
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Test purge',

        'test purge': function() {
            var i,
                state;

            for (i = 0; i < synStates; i++) {
                state = new TestUndoRedoState();

                undoRedo.add(state);
            }

            undoRedo.purge();

            Y.Assert.areEqual(0, undoRedo.get('undoIndex'), 'There must be zero states');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Test limit',

        'test limit': function() {
            var i,
                state;

            undoRedo.set('limit', 10);

            for (i = 0; i < 20; i++) {
                state = new TestUndoRedoState();

                undoRedo.add(state);
            }

            Y.Assert.areEqual(10, undoRedo.get('undoIndex'), 'There must be 10 states');

            undoRedo.set('limit', -1);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Test remove orphan states',

        'test remove single orphan states': function() {
            var i,
                state;

            undoRedo.purge();

            state = new TestUndoRedoState();

            undoRedo.add(state);

            undoRedo.undo();

            Y.Assert.areEqual(false, undoRedo.canUndo(), 'Undoing must not be allowed');
            Y.Assert.areEqual(true, undoRedo.canRedo(), 'Redoing must be allowed');

            state = new TestUndoRedoState();

            undoRedo.add(state);

            Y.Assert.areEqual(1, undoRedo._states.length, 'There should be 1 state');
            Y.Assert.areEqual(1, undoRedo.get('undoIndex'), 'The current index should be 1');
            Y.Assert.areEqual(true, undoRedo.canUndo(), 'Undoing must be allowed');
            Y.Assert.areEqual(false, undoRedo.canRedo(), 'Redoing must not be allowed');
        },

        'test remove multiple orphan states': function() {
            var i,
                state;

            undoRedo.purge();

            for (i = 0; i < 20; i++) {
                state = new TestUndoRedoState();

                undoRedo.add(state);
            }

            undoRedo.undo();
            undoRedo.undo();
            undoRedo.undo();

            Y.Assert.areEqual(20, undoRedo._states.length, 'There should be 20 states');
            Y.Assert.areEqual(17, undoRedo.get('undoIndex'), 'The current index should be 17');
            Y.Assert.areEqual(true, undoRedo.canUndo(), 'Undoing must be allowed');
            Y.Assert.areEqual(true, undoRedo.canRedo(), 'Redoing must be allowed');

            state = new TestUndoRedoState();

            undoRedo.add(state);

            Y.Assert.areEqual(18, undoRedo._states.length, 'There should be 18 states');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'aui-undo-redo']
});
