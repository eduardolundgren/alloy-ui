YUI.add('aui-datatable-tests', function(Y) {

    var suite = new Y.Test.Suite('aui-datatable');

    var data = [
        {
            name: 'Joan B. Jones',
            address: '3271 Another Ave',
            city: 'New York',
            state: 'AL',
            amount: 3,
            active: 'no',
            colors: ['red', 'blue'],
            fruit: ['apple'],
            date: '2013-01-01'
        },
        {
            name: 'Bob C. Uncle',
            address: '9996 Random Road',
            city: 'Los Angeles',
            state: 'CA',
            amount: 0,
            active: 'maybe',
            colors: ['green'],
            fruit: ['cherry'],
            date: '2013-01-01'
        },
        {
            name: 'John D. Smith',
            address: '1623 Some Street',
            city: 'San Francisco',
            state: 'CA',
            amount: 5,
            active: 'yes',
            colors: ['red'],
            fruit: ['cherry'],
            date: ''
        },
        {
            name: 'Joan E. Jones',
            address: '3217 Another Ave',
            city: 'New York',
            state: 'KY',
            amount: 3,
            active: 'no',
            colors: ['red', 'blue'],
            fruit: ['apple', 'cherry'],
            date: '2013-01-06'
        }
    ];

    new Y.DataTable({
        boundingBox: '#simple',
        columns: [
            {
                key: 'name',
                sortable: true,
                editor: new Y.TextAreaCellEditor({
                    on: {
                        save: function(event) {
                            console.log('save', event.newVal);
                        },
                        cancel: function(event) {
                            console.log('cancel', event);
                        }
                    },
                    validator: {
                        rules: {
                            value: {
                                required: true
                            }
                        }
                    }
                })
            },
            {
                key: 'address',
                editor: new Y.TextAreaCellEditor()
            },
            {
                key: 'city',
                editor: new Y.TextAreaCellEditor()
            },
            {
                key: 'state',
                editor: new Y.DropDownCellEditor({
                    editable: true,
                    options: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID",
                        "IL", "IN", "IA", "KS", "KY", "LA"]
                })
            },
            'amount',
            {
                key: "active",
                editor: new Y.RadioCellEditor({
                    editable: true,
                    options: {
                        yes: 'Yes',
                        no: 'No',
                        maybe: 'Maybe'
                    }
                })
            },
            {
                key: "colors",
                editor: new Y.CheckboxCellEditor({
                    editable: true,
                    multiple: true,
                    options: {
                        red: 'Red',
                        green: 'Green',
                        blue: 'Blue'
                    }
                })
            },
            {
                key: 'fruit',
                sortable: true,
                editor: new Y.DropDownCellEditor({
                    editable: true,
                    multiple: true,
                    options: {
                        apple: 'Apple',
                        cherry: 'Cherry',
                        banana: 'Banana',
                        kiwi: 'Kiwi'
                    }
                })
            },
            {
                key: 'date',
                sortable: true,
                editor: new Y.DateCellEditor({
                    calendar: {
                        width: '400px',
                        showPrevMonth: true,
                        showNextMonth: true,
                        selectionMode: 'multiple'
                    }
                })
            }
        ],
        data: data,
        editEvent: 'dblclick',
        plugins: [
            {
                fn: Y.Plugin.DataTableHighlight
            }
        ]
    }).render();

    function assertHighlightPosition(tableData) {
        var overlayActiveNode = Y.one('.table-highlight-overlay-active'),
            overlayActiveChildren = overlayActiveNode.get('children'),
            overlaySelectionNode = overlayActiveNode ? overlayActiveNode.next('.table-highlight-overlay') : null,

            lowerXLimit = tableData.getX() >= (overlayActiveNode.getX() - 1),
            lowerYLimit = tableData.getY() >= (overlayActiveNode.getY() - 1),
            overlayActiveBorderWidth = overlayActiveChildren.item(0).get('offsetHeight'),
            overlayActiveBottomWidth = overlayActiveChildren.item(2).get('offsetWidth'),
            overlayActiveLeftHeight = overlayActiveChildren.item(3).get('offsetHeight') + overlayActiveBorderWidth,
            overlayActiveRightHeight = overlayActiveChildren.item(1).get('offsetHeight') + overlayActiveBorderWidth,
            overlayActiveTopWidth = overlayActiveChildren.item(0).get('offsetWidth'),
            tableDataHeight = tableData.get('offsetHeight'),
            tableDataWidth = tableData.get('offsetWidth'),
            upperXLimit = tableData.getX() <= (overlayActiveNode.getX() + 1),
            upperYLimit = tableData.getX() <= (overlayActiveNode.getY() - 1);

        Y.Assert.isTrue(
            (lowerXLimit && upperXLimit),
            'X Position of <td></td> and highlight are not the similar.');

        Y.Assert.isTrue(
            (lowerYLimit && upperYLimit),
            'Y Position of <td></td> and highlight are not the similar.');

        Y.Assert.areSame(
            tableDataWidth,
            overlayActiveBottomWidth,
            'Hightlight bottom border width ' + overlayActiveBottomWidth + ' is not same width as table data ' +
            tableDataWidth + '.');

        Y.Assert.areSame(
            tableDataWidth,
            overlayActiveTopWidth,
            'Hightlight top border width ' + overlayActiveTopWidth + ' is not same width as table data ' +
            tableDataWidth + '.');

        Y.Assert.areSame(
            tableDataHeight,
            overlayActiveLeftHeight,
            'Hightlight left border height ' + overlayActiveLeftHeight + ' is not same height as table data ' +
            tableDataHeight + '.');

        Y.Assert.areSame(
            tableDataHeight,
            overlayActiveRightHeight,
            'Hightlight right border height ' + overlayActiveRightHeight + ' is not same height as table data ' +
            tableDataHeight + '.');
    };

    suite.add(new Y.Test.Case({
        name: 'Datatable Highlight',
        'table-cell should be highlighted on click': function() {
            var test = this,
                tableData = Y.one('tr.table-odd td.table-col-amount');

            tableData.once('mousedown', function(event) {
                setTimeout(function() {
                    test.resume(function() {
                        assertHighlightPosition(event.currentTarget);
                    });
                }, 800);
            });

            setTimeout(function() {
                tableData.simulate('mousedown');
                tableData.simulate('mouseup');
            }, 0);

            test.wait(1000);
        },

        'table-cell should still be highlighted when table is scrolled horizontally': function() {
            var test = this,
                datatableContainer = Y.one('#simple'),
                datatableContent = datatableContainer.one('.table-content'),
                tableData = Y.one('tr.table-odd td.table-col-amount');

            datatableContainer.setStyle('width', '300px');
            datatableContent.setStyle('overflow', 'auto');

            tableData.once('mousedown', function(event) {
                setTimeout(function() {
                    test.resume(function() {
                        assertHighlightPosition(event.currentTarget);
                    });
                }, 800);
            });

            setTimeout(function() {
                tableData.simulate('mousedown');
                tableData.simulate('mouseup');
                datatableContent.set('scrollLeft', 200);
            }, 0);

            test.wait(1000);
        }
    }));

    Y.Test.Runner.add(suite);

}, '', {
    requires: ['aui-datatable', 'node-event-simulate', 'test']
});
