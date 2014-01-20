YUI.add('module-tests', function(Y) {

    //--------------------------------------------------------------------------
    // AUI UndoRedo Asyncronous Tests
    //--------------------------------------------------------------------------

    var suite = new Y.Test.Suite('aui-undo-redo');

    var asyncStates = 20,
        testArray = [],
        undoRedo;

    var TestAsyncUndoRedoState = Y.Base.create('testAsyncUndoState', Y.UndoRedoState, [], {
        undo: function() {
            var instance = this;

            setTimeout(function() {
                testArray.splice(-1, 1);

                instance.fire('undo');
            }, 0);
        },

        redo: function() {
            var instance = this;

            setTimeout(function() {
                testArray.push(testArray.length);

                instance.fire('redo');
            }, 0);
        }
    });

    undoRedo = new Y.UndoRedo();

    undoRedo.on('add', function(attrs) {
        var state = attrs.state;

        Y.Assert.isInstanceOf(Y.UndoRedoState, state);
    });

    suite.add(new Y.Test.Case({
        name: 'Test asynchronous state',

        'test add states': function() {
            var canRedo,
                canUndo,
                i,
                undoRedoState;

            for (i = 0; i < asyncStates; i++) {
                undoRedoState = new TestAsyncUndoRedoState({
                    async: true
                });

                testArray.push(testArray.length);

                undoRedo.add(undoRedoState);
            }

            canUndo = undoRedo.canUndo();
            canRedo = undoRedo.canRedo();

            Y.Assert.areEqual(true, canUndo, 'Undoing must be allowed');
            Y.Assert.areEqual(false, canRedo, 'Redoing must be not allowed');
            Y.Assert.areEqual(asyncStates, testArray.length, 'There must be ' + asyncStates +
                ' states in testArray');
            Y.Assert.areEqual(asyncStates, undoRedo.get('undoIndex'), 'Undo index must be: ' +
                asyncStates);
        },

        'test undo states': function() {
            var instance = this,
                i = asyncStates - 1,
                undoIndex;

            instance._undoFinishedHandler = undoRedo.after('undoFinished', function() {
                if (i > 0) {
                    undoIndex = undoRedo.get('undoIndex');

                    Y.Assert.areEqual(i, undoIndex, 'Undo index must be: ' + i);
                    Y.Assert.areEqual(true, undoRedo.canUndo(), 'Undoing must be allowed');
                    Y.Assert.areEqual(true, undoRedo.canRedo(), 'Redoing must be allowed');
                    Y.Assert.areEqual(i, testArray.length, 'Test array must contain:' + i +
                        ' items');

                    undoRedo.undo();
                }
                else {
                    undoIndex = undoRedo.get('undoIndex');

                    Y.Assert.areEqual(0, undoIndex, 'Undo index must be: ' + 0);
                    Y.Assert.areEqual(false, undoRedo.canUndo(), 'Undoing must be not allowed');
                    Y.Assert.areEqual(true, undoRedo.canRedo(), 'Redoing must be allowed');
                    Y.Assert.areEqual(0, testArray.length, 'Test array must be empty');

                    instance._undoFinishedHandler.detach();
                    instance._undoFinishedHandler = null;

                    instance.resume();
                }

                --i;
            });

            undoRedo.undo();

            instance.wait();
        },

        'test redo states': function() {
            var instance = this,
                i = 0,
                undoIndex;

            instance._redoFinishedHandler = undoRedo.after('redoFinished', function() {
                if (i < asyncStates - 1) {
                    undoIndex = undoRedo.get('undoIndex');

                    Y.Assert.areEqual(i + 1, undoIndex, 'Undo index must be: ' + (i + 1));
                    Y.Assert.areEqual(true, undoRedo.canUndo(), 'Undoing must be allowed');
                    Y.Assert.areEqual(true, undoRedo.canRedo(), 'Redoing must be allowed');
                    Y.Assert.areEqual(i + 1, testArray.length, 'Test array must contain:' + (i + 1) +
                        ' items');

                    undoRedo.redo();
                }
                else {
                    undoIndex = undoRedo.get('undoIndex');

                    Y.Assert.areEqual(asyncStates, undoIndex, 'Undo index must be: ' +
                        asyncStates);
                    Y.Assert.areEqual(true, undoRedo.canUndo(), 'Undoing must be allowed');
                    Y.Assert.areEqual(false, undoRedo.canRedo(), 'Redoing must be not allowed');

                    instance._redoFinishedHandler.detach();
                    instance._redoFinishedHandler = null;

                    instance.resume();
                }

                ++i;
            });

            undoRedo.redo();

            instance.wait();
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: ['test', 'aui-undo-redo']
});
