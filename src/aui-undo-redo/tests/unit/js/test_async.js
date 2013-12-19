YUI.add('module-tests', function(Y) {

    //--------------------------------------------------------------------------
    // AUI UndoRedo Asyncronous Tests
    //--------------------------------------------------------------------------

    var suite = new Y.Test.Suite('aui-undo-redo');

    var asyncActions = 20,
        testArray = [],
        undoRedo;

    var TestAsyncUndoRedoAction = Y.Base.create('testAsyncUndoAction', Y.UndoRedoAction, [], {
        undo: function() {
            var instance = this;

            setTimeout(function() {
                testArray.splice(-1, 1);

                instance.fire('undoFinished');
            }, 16);
        },

        redo: function() {
            var instance = this;

            setTimeout(function() {
                testArray.push(testArray.length);

                instance.fire('redoFinished');
            }, 16);
        }
    });

    undoRedo = new Y.UndoRedo();

    undoRedo.on('actionAdded', function(attrs) {
        var action = attrs.action;

        Y.Assert.isInstanceOf(Y.UndoRedoAction, action);
    });

    undoRedo.on('actionCanceled', function(attrs) {
        var action = attrs.action,
            index = attrs.index;

        Y.Assert.isInstanceOf(Y.UndoRedoAction, action);
        Y.Assert.isNumber(index);
    });

    undoRedo.on('actionMerged', function(attrs) {
        var action = attrs.action,
            mergedAction = attrs.mergedAction;

        Y.Assert.isInstanceOf(Y.UndoRedoAction, action);
        Y.Assert.isInstanceOf(Y.UndoRedoAction, mergedAction);
    });

    undoRedo.on('actionRedone', function(attrs) {
        var action = attrs.action,
            index = attrs.index;

        Y.Assert.isInstanceOf(Y.UndoRedoAction, action);
        Y.Assert.isNumber(index);
    });

    undoRedo.on('actionUndone', function(attrs) {
        var action = attrs.action,
            index = attrs.index;

        Y.Assert.isInstanceOf(Y.UndoRedoAction, action);
        Y.Assert.isNumber(index);
    });

    suite.add(new Y.Test.Case({
        name: 'Test asynchronous action',

        'test add actions': function() {
            var canRedo,
                canUndo,
                i,
                undoRedoAction;

            for (i = 0; i < asyncActions; i++) {
                undoRedoAction = new TestAsyncUndoRedoAction({
                    asyncProcessing: true,
                    label: 'Async action: ' + i
                });

                testArray.push(testArray.length);

                undoRedo.add(undoRedoAction);
            }

            canUndo = undoRedo.canUndo();
            canRedo = undoRedo.canRedo();

            Y.Assert.areEqual(true, canUndo, 'Undoing must be allowed');
            Y.Assert.areEqual(false, canRedo, 'Redoing must be not allowed');
            Y.Assert.areEqual(asyncActions, testArray.length, 'There must be ' + asyncActions +
                ' actions in testArray');
            Y.Assert.areEqual(asyncActions, undoRedo.get('undoIndex'), 'Undo index must be: ' +
                asyncActions);
        },

        'test undo actions': function() {
            var instance = this,
                i = asyncActions - 1,
                undoIndex;

            instance._undoFinishedHandler = undoRedo.subscribe('undoFinished', function() {
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

        'test redo actions': function() {
            var instance = this,
                i = 0,
                undoIndex;

            instance._redoFinishedHandler = undoRedo.subscribe('redoFinished', function() {
                if (i < asyncActions - 1) {
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

                    Y.Assert.areEqual(asyncActions, undoIndex, 'Undo index must be: ' +
                        asyncActions);
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
        },

        'test multiple undo actions': function() {
            var instance = this,
                undoIndex;

            instance._undoFinishedHandler = undoRedo.subscribe('undoFinished', function() {
                undoIndex = undoRedo.get('undoIndex');

                Y.Assert.areEqual(0, undoIndex, 'Undo index must be: ' + 0);
                Y.Assert.areEqual(0, testArray.length, 'Test array must be ampty');

                instance._undoFinishedHandler.detach();
                instance._undoFinishedHandler = null;

                instance.resume();
            });

            undoRedo.processTo(0);

            instance.wait();
        },

        'test multiple redo actions': function() {
            var instance = this,
                undoIndex;

            instance._redoFinishedHandler = undoRedo.subscribe('redoFinished', function() {
                undoIndex = undoRedo.get('undoIndex');

                Y.Assert.areEqual(asyncActions, undoIndex, 'Undo index must be: ' + asyncActions);
                Y.Assert.areEqual(asyncActions, testArray.length, 'Test array must contain ' +
                    asyncActions + 'actions');

                instance._redoFinishedHandler.detach();
                instance._redoFinishedHandler = null;

                instance.resume();
            });

            undoRedo.processTo(asyncActions);

            instance.wait();
        }
    }));

    suite.add(new Y.Test.Case({
        'test set limit': function() {
            var actions,
                undoRedoAction;

            actions = undoRedo._actions;

            undoRedo.set('limit', asyncActions);

            undoRedoAction = new TestAsyncUndoRedoAction({
                asyncProcessing: true,
                'label': 'Action, added after limit'
            });

            undoRedo.add(undoRedoAction);

            Y.Assert.areEqual(asyncActions, testArray.length, 'There must be total: ' + asyncActions);
            Y.Assert.areEqual(undoRedoAction, actions[actions.length - 1],
                'The new added action must be the last one');

            // set unlimited number of actions
            undoRedo.set('limit', 0);

            Y.Assert.areEqual(0, undoRedo.get('limit'), 'The number of actions must be unlimited now');
        }
    }));

    Y.Test.Runner.add(suite);
}, '', {
    requires: ['test', 'aui-undo-redo']
});
