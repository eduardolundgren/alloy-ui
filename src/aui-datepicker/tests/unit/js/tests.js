YUI.add('aui-datepicker-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-datepicker');

    suite.add(new Y.Test.Case({
        name: 'Datepicker Tests',

        selectDate: function(datePicker, dayIndex) {
            var popover = datePicker.getPopover(),
                dayCells = popover.bodyNode.all('.yui3-calendar-day'),
                toClick = dayCells.item(dayIndex);

            toClick.simulate('click');
        },

        'selectionChange event should only fire when selection changes': function() {
            var selectionChangeCount = 0,
                trigger = Y.one('#trigger'),

                datePicker = new Y.DatePicker({
                    on: {
                        selectionChange: function() {
                            selectionChangeCount++;
                        }
                    },
                    popover: {
                        zIndex: 1
                    },
                    panes: 1,
                    trigger: '#trigger'
                });

            Y.Assert.areEqual(0, selectionChangeCount);

            trigger.simulate('click');

            Y.Assert.areEqual(0, selectionChangeCount);

            this.selectDate(datePicker, 0);

            Y.Assert.areEqual(1, selectionChangeCount);

            trigger.simulate('click');

            this.selectDate(datePicker, 1);

            Y.Assert.areEqual(2, selectionChangeCount);
        },

        'selectionChange event should not fire when switching between datepickers': function() {
            var selectionChangeCount = 0,
                triggerA = Y.one('#triggerA'),
                triggerB = Y.one('#triggerB'),

                datePicker = new Y.DatePicker({
                    on: {
                        selectionChange: function() {
                            selectionChangeCount++;
                        }
                    },
                    popover: {
                        zIndex: 1
                    },
                    panes: 1,
                    trigger: '#triggerA, #triggerB'
                });

            triggerA.simulate('click');

            this.selectDate(datePicker, 0);

            triggerB.simulate('click');

            this.selectDate(datePicker, 1);

            Y.Assert.areEqual(2, selectionChangeCount);

            triggerA.simulate('click');

            Y.Assert.areEqual(2, selectionChangeCount);

            triggerB.simulate('click');

            Y.Assert.areEqual(2, selectionChangeCount);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['test', 'aui-datepicker', 'node-event-simulate']
});
