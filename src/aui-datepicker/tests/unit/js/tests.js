YUI.add('module-tests', function(Y) {

    //--------------------------------------------------------------------------
    // DatePicker Tests
    //--------------------------------------------------------------------------

    var suite = new Y.Test.Suite('aui-datepicker'),
        datePicker;

    //--------------------------------------------------------------------------
    // Test Case for DatePickerDelegate events
    //--------------------------------------------------------------------------

    suite.add(new Y.Test.Case({

        name: 'DatePicker focus/blur tests',

        /**
         * @tests AUI-985
         */
        'assert DatePicker shows and hides on focus/blur events': function() {
            var instance = this;

            datePicker = new Y.TimePicker({
                trigger: '#delegate input',
                on: {
                    selectionChange: function(event) {
                        console.log(event.newSelection);
                    }
                }
            });

            instance._showDatePicker('#pickerInput1');

            Y.Test.Assert.isNull(Y.one('.timepicker-popover.popover-hidden'),
                'DatePicker should be visible now');

            Y.one('#outside').focus();
            Y.one('#outside').simulate('click');

            Y.Test.Assert.isNotNull(Y.one('.timepicker-popover.popover-hidden'),
                'DatePicker should be hidden now');
        },

        _showDatePicker: function(trigger) {
            trigger = Y.one(trigger);

            trigger.simulate('mousedown');
            trigger.focus();
            trigger.simulate('click');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-timepicker', 'aui-timepicker-native', 'event-custom-base', 'node-event-simulate', 'test']
});
