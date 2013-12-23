YUI.add('module-tests', function(Y) {

    //--------------------------------------------------------------------------
    // AUI UndoRedo Syncronous Tests
    //--------------------------------------------------------------------------

    var suite = new Y.Test.Suite('aui-undo-redo');

    var testArray = [],
        total = 0,
        synActions = 20,
        undoRedo;

    var TestUndoRedoAction = Y.Base.create('testUndoAction', Y.UndoRedoAction, [], {
        undo: function() {
            testArray.splice(-1, 1);
        },

        redo: function() {
            testArray.push(testArray.length);
        },

        toString: function() {
            return this.get('label');
        }
    });

    var UndoRedoActionMerge = Y.Base.create('undoRedoActionMerge', Y.UndoRedoAction, [], {
        undo: function() {
            var number = this.get('number');
            total -= number;
        },

        redo: function() {
            var number = this.get('number');
            total += number;
        },

        merge: function(newAction) {
            var curNumber = this.get('number');
            var newNumber = newAction.get('number');

            this.set('number', curNumber + newNumber);
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

    undoRedo.on('actionAdded', Y.bind(function(attrs) {
        var action = attrs.action;

        Y.Assert.isInstanceOf(Y.UndoRedoAction, action);
    }, this));

    undoRedo.on('actionCanceled', Y.bind(function(attrs) {
        var action = attrs.action,
            index = attrs.index;

        Y.Assert.isInstanceOf(Y.UndoRedoAction, action);
        Y.Assert.isNumber(index);
    }, this));

    undoRedo.on('actionMerged', Y.bind(function(attrs) {
        var action = attrs.action,
            mergedAction = attrs.mergedAction;

        Y.Assert.isInstanceOf(Y.UndoRedoAction, action);
        Y.Assert.isInstanceOf(Y.UndoRedoAction, mergedAction);
    }, this));

    undoRedo.on('actionRedone', Y.bind(function(attrs) {
        var action = attrs.action,
            index = attrs.index;

        Y.Assert.isInstanceOf(Y.UndoRedoAction, action);
        Y.Assert.isNumber(index);
    }, this));

    undoRedo.on('actionUndone', Y.bind(function(attrs) {
        var action = attrs.action,
            index = attrs.index;

        Y.Assert.isInstanceOf(Y.UndoRedoAction, action);
        Y.Assert.isNumber(index);
    }, this));

    suite.add(new Y.Test.Case({
        name: 'Test synchronous action',

        'test adding actions': function() {
            var undoRedoAction, canUndo, canRedo, i;

            for (i = 0; i < synActions; i++) {
                undoRedoAction = new TestUndoRedoAction({
                    'label': 'Action: ' + i
                });

                undoRedoAction.redo();
                undoRedo.add(undoRedoAction);
            }

            canUndo = undoRedo.canUndo();
            canRedo = undoRedo.canRedo();

            Y.Assert.areEqual(true, canUndo, 'Undoing must be allowed');
            Y.Assert.areEqual(false, canRedo, 'Redoing must be not allowed');
            Y.Assert.areEqual(synActions, testArray.length, 'There must be ' + synActions +
                ' actions in testArray');
            Y.Assert.areEqual(synActions, undoRedo.get('undoIndex'), 'Undo index must be: ' +
                synActions);
        },

        'test undor action': function() {
            var undoIndex, i;

            for (i = synActions - 1; i > 0; i--) {
                undoRedo.undo();

                undoIndex = undoRedo.get('undoIndex');

                Y.Assert.areEqual(i, undoIndex, 'Undo index must be: ' + i);
                Y.Assert.areEqual(true, undoRedo.canUndo(), 'Undoing must be allowed');
                Y.Assert.areEqual(true, undoRedo.canRedo(), 'Redoing must be allowed');
                Y.Assert.areEqual(i, testArray.length, 'Test array must contain:' + i + ' actions');
            }

            undoRedo.undo();
            undoIndex = undoRedo.get('undoIndex');

            Y.Assert.areEqual(0, undoIndex, 'Undo index must be: ' + 0);
            Y.Assert.areEqual(false, undoRedo.canUndo(), 'Undoing must be not allowed');
            Y.Assert.areEqual(true, undoRedo.canRedo(), 'Redoing must be allowed');

            Y.Assert.areEqual(0, testArray.length, 'Test array must be empty');
        },

        'test redo action': function() {
            var undoIndex, i;

            for (i = 0; i < synActions - 1; i++) {
                undoRedo.redo();

                undoIndex = undoRedo.get('undoIndex');

                Y.Assert.areEqual(i + 1, undoIndex, 'Undo index must be: ' + (i + 1));
                Y.Assert.areEqual(true, undoRedo.canUndo(), 'Undoing must be allowed');
                Y.Assert.areEqual(true, undoRedo.canRedo(), 'Redoing must be allowed');
                Y.Assert.areEqual(i + 1, testArray.length, 'Test array must contain:' + (i + 1) +
                    ' actions');
            }

            undoRedo.redo();
            undoIndex = undoRedo.get('undoIndex');

            Y.Assert.areEqual(synActions, undoIndex, 'Undo index must be: ' + synActions);
            Y.Assert.areEqual(true, undoRedo.canUndo(), 'Undoing must be allowed');
            Y.Assert.areEqual(false, undoRedo.canRedo(), 'Redoing must be not allowed');
        },

        'test multiple undo': function() {
            var undoIndex;

            undoRedo.processTo(0);

            undoIndex = undoRedo.get('undoIndex');

            Y.Assert.areEqual(0, undoIndex, 'Undo index must be: ' + 0);
            Y.Assert.areEqual(0, testArray.length, 'Test array must be ampty');
        },

        'test multiple redo': function() {
            var undoIndex;

            undoRedo.processTo(synActions);

            undoIndex = undoRedo.get('undoIndex');

            Y.Assert.areEqual(synActions, undoIndex, 'Undo index must be: ' + synActions);
            Y.Assert.areEqual(synActions, testArray.length, 'Test array must contain ' + synActions +
                'actions');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Test limit',

        setUp: function() {
            var undoRedoAction, i;

            undoRedo.purgeAll();

            undoRedo.set('limit', 0);

            for (i = 0; i < 5; i++) {
                undoRedoAction = new TestUndoRedoAction({
                    'label': 'Action' + i
                });

                undoRedo.add(undoRedoAction);
            }
        },

        'test set limit': function() {
            var undoRedoAction, actions;

            actions = undoRedo._actions;
            undoRedo.set('limit', synActions);

            undoRedoAction = new TestUndoRedoAction({
                'label': 'Action, added after limit'
            });

            undoRedo.add(undoRedoAction);

            Y.Assert.areEqual(synActions, testArray.length, 'There must be total: ' + synActions);
            Y.Assert.areEqual(undoRedoAction, actions[actions.length - 1],
                'The new added action must be the last one');

            // set unlimited number of actions
            undoRedo.set('limit', 0);
            Y.Assert.areEqual(0, undoRedo.get('limit'), 'The number of actions must be unlimited now');
        },

        'test limit to 1 action': function() {
            var actions = undoRedo._actions,
                undoRedoAction;

            undoRedo.purgeAll();
            undoRedo.set('limit', 1);

            undoRedoAction = new TestUndoRedoAction({
                'label': 'Action0'
            });

            undoRedo.add(undoRedoAction);

            Y.Assert.areEqual(1, actions.length, 'There must be 1 item');
            Y.Assert.areEqual('Action0', actions[0].get('label'), 'Label must be Action0');

            undoRedoAction = new TestUndoRedoAction({
                'label': 'Action1'
            });

            undoRedo.add(undoRedoAction);

            Y.Assert.areEqual(1, actions.length, 'There must be 1 item');
            Y.Assert.areEqual('Action1', actions[0].get('label'), 'Label must be Action1');

            undoRedoAction = new TestUndoRedoAction({
                'label': 'Action2'
            });

            undoRedo.add(undoRedoAction);

            Y.Assert.areEqual(1, actions.length, 'There must be 1 item');
            Y.Assert.areEqual('Action2', actions[0].get('label'), 'Label must be Action2');
        },

        'test limit 0': function() {
            var actions = undoRedo._actions;

            undoRedo.processTo(0);

            undoRedo.set('limit', 3);

            Y.Assert.areEqual(3, actions.length, 'There must be 3 actions');
            Y.Assert.areEqual('Action0', actions[0].get('label'), 'Label must be Action0');
            Y.Assert.areEqual('Action1', actions[1].get('label'), 'Label must be Action1');
            Y.Assert.areEqual('Action2', actions[2].get('label'), 'Label must be Action2');
        },

        'test limit 1': function() {
            var actions = undoRedo._actions;

            undoRedo.processTo(1);

            undoRedo.set('limit', 3);

            Y.Assert.areEqual(3, actions.length, 'There must be 3 actions');
            Y.Assert.areEqual('Action0', actions[0].get('label'), 'Label must be Action0');
            Y.Assert.areEqual('Action1', actions[1].get('label'), 'Label must be Action1');
            Y.Assert.areEqual('Action2', actions[2].get('label'), 'Label must be Action2');
        },

        'test limit 2': function() {
            var actions = undoRedo._actions;

            undoRedo.processTo(2);
            undoRedo.set('limit', 3);

            Y.Assert.areEqual(3, actions.length, 'There must be 3 actions');
            Y.Assert.areEqual('Action0', actions[0].get('label'), 'Label must be Action0');
            Y.Assert.areEqual('Action1', actions[1].get('label'), 'Label must be Action1');
            Y.Assert.areEqual('Action2', actions[2].get('label'), 'Label must be Action2');
        },

        'test limit 3': function() {
            var actions = undoRedo._actions;

            undoRedo.processTo(3);
            undoRedo.set('limit', 3);

            Y.Assert.areEqual(3, actions.length, 'There must be 3 actions');
            Y.Assert.areEqual('Action1', actions[0].get('label'), 'Label must be Action1');
            Y.Assert.areEqual('Action2', actions[1].get('label'), 'Label must be Action2');
            Y.Assert.areEqual('Action3', actions[2].get('label'), 'Label must be Action3');
        },

        'test limit 4': function() {
            var actions = undoRedo._actions;

            undoRedo.processTo(4);
            undoRedo.set('limit', 3);

            Y.Assert.areEqual(3, actions.length, 'There must be 3 actions');
            Y.Assert.areEqual('Action2', actions[0].get('label'), 'Label must be Action2');
            Y.Assert.areEqual('Action3', actions[1].get('label'), 'Label must be Action3');
            Y.Assert.areEqual('Action4', actions[2].get('label'), 'Label must be Action4');
        },

        'test limit 5': function() {
            var actions = undoRedo._actions;

            undoRedo.processTo(5);
            undoRedo.set('limit', 3);

            Y.Assert.areEqual(3, actions.length, 'There must be 3 actions');
            Y.Assert.areEqual('Action2', actions[0].get('label'), 'Label must be Action2');
            Y.Assert.areEqual('Action3', actions[1].get('label'), 'Label must be Action3');
            Y.Assert.areEqual('Action4', actions[2].get('label'), 'Label must be Action4');
        },

        'test limit 6': function() {
            var actions = undoRedo._actions;

            undoRedo.processTo(1);
            undoRedo.set('limit', 4);

            Y.Assert.areEqual(4, actions.length, 'There must be 4 actions');
            Y.Assert.areEqual('Action0', actions[0].get('label'), 'Label must be Action0');
            Y.Assert.areEqual('Action1', actions[1].get('label'), 'Label must be Action1');
            Y.Assert.areEqual('Action2', actions[2].get('label'), 'Label must be Action2');
            Y.Assert.areEqual('Action3', actions[3].get('label'), 'Label must be Action3');
        },

        'test limit 7': function() {
            var actions = undoRedo._actions;

            undoRedo.processTo(2);
            undoRedo.set('limit', 4);

            Y.Assert.areEqual(4, actions.length, 'There must be 4 actions');
            Y.Assert.areEqual('Action0', actions[0].get('label'), 'Label must be Action0');
            Y.Assert.areEqual('Action1', actions[1].get('label'), 'Label must be Action1');
            Y.Assert.areEqual('Action2', actions[2].get('label'), 'Label must be Action2');
            Y.Assert.areEqual('Action3', actions[3].get('label'), 'Label must be Action3');
        },

        'test limit 8': function() {
            var actions = undoRedo._actions;

            undoRedo.processTo(3);
            undoRedo.set('limit', 4);

            Y.Assert.areEqual(4, actions.length, 'There must be 4 actions');
            Y.Assert.areEqual('Action1', actions[0].get('label'), 'Label must be Action1');
            Y.Assert.areEqual('Action2', actions[1].get('label'), 'Label must be Action2');
            Y.Assert.areEqual('Action3', actions[2].get('label'), 'Label must be Action3');
            Y.Assert.areEqual('Action4', actions[3].get('label'), 'Label must be Action4');
        },

        'test limit 9': function() {
            var actions = undoRedo._actions;

            undoRedo.processTo(4);
            undoRedo.set('limit', 4);

            Y.Assert.areEqual(4, actions.length, 'There must be 4 actions');
            Y.Assert.areEqual('Action1', actions[0].get('label'), 'Label must be Action1');
            Y.Assert.areEqual('Action2', actions[1].get('label'), 'Label must be Action2');
            Y.Assert.areEqual('Action3', actions[2].get('label'), 'Label must be Action3');
            Y.Assert.areEqual('Action4', actions[3].get('label'), 'Label must be Action4');
        },

        'test limit 10': function() {
            var actions = undoRedo._actions;

            undoRedo.processTo(3);
            undoRedo.set('limit', 2);

            Y.Assert.areEqual(2, actions.length, 'There must be 2 actions');
            Y.Assert.areEqual('Action2', actions[0].get('label'), 'Label must be Action2');
            Y.Assert.areEqual('Action3', actions[1].get('label'), 'Label must be Action3');
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Test purge actions',

        'test purge actions': function() {
            var i, undoRedoAction, maxActions = 10,
                targetIndex, actions;

            undoRedo.purgeAll();
            undoRedo.set('limit', 0);

            for (i = 0; i < maxActions; i++) {
                undoRedoAction = new TestUndoRedoAction({
                    'label': 'Action' + i
                });

                undoRedo.add(undoRedoAction);
            }

            maxActions = parseInt(maxActions / 2, 10);
            targetIndex = parseInt(maxActions - 1, 10);

            undoRedo.processTo(targetIndex);
            undoRedo.purgeTo(maxActions);

            actions = undoRedo._actions;

            Y.Assert.areEqual(maxActions, actions.length, 'There must be ', maxActions, ' actions');
            Y.Assert.areEqual(targetIndex, undoRedo.get('undoIndex'), 'Undo index must be ' + targetIndex);

            undoRedo.purgeTo(maxActions); // must do nothing

            Y.Assert.areEqual(maxActions, actions.length, 'There must be ', maxActions, ' actions');
            Y.Assert.areEqual(targetIndex, undoRedo.get('undoIndex'), 'Undo index must be ' + targetIndex);

            maxActions -= 1;

            undoRedo.purgeTo(maxActions);

            Y.Assert.areEqual(maxActions, actions.length, 'There must be ', maxActions, ' actions');
            Y.Assert.areEqual(targetIndex, undoRedo.get('undoIndex'), 'Undo index must be ' + targetIndex);

            undoRedo.undo();

            Y.Assert.areEqual(maxActions, actions.length, 'There must be ', maxActions, ' actions');
            Y.Assert.areEqual(targetIndex - 1, undoRedo.get('undoIndex'), 'Undo index must be ' +
                targetIndex -
                1);

            undoRedo.redo();

            Y.Assert.areEqual(maxActions, actions.length, 'There must be ', maxActions, ' actions');
            Y.Assert.areEqual(targetIndex, undoRedo.get('undoIndex'), 'Undo index must be ' + targetIndex);
        }
    }));

    suite.add(new Y.Test.Case({
        name: 'Test merging action',

        'test merge actions': function() {
            var number1 = 2,
                number2 = 3,
                undoRedoAction;

            undoRedoAction = new UndoRedoActionMerge({
                number: number1
            });

            undoRedoAction.redo();

            undoRedo.add(undoRedoAction);

            undoRedoAction = new UndoRedoActionMerge({
                number: number2
            });

            undoRedoAction.redo();

            undoRedo.add(undoRedoAction);

            Y.Assert.areEqual(5, total, 'Total number must be ' + (number1 + number2));
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'aui-undo-redo']
});
