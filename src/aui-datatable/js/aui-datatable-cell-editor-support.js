var isBaseEditor,
    CellEditorSupport;

isBaseEditor = function(val) {
    return (val instanceof A.BaseCellEditor);
};

/**
 * An extension for A.DataTable to support Cell Editing.
 *
 * @class A.DataTable.CellEditorSupport
 * @param {Object} config Object literal specifying widget configuration
 *     properties.
 * @constructor
 */
CellEditorSupport = function() {};

/**
 * Static property provides a string to identify the class.
 *
 * @property NAME
 * @type String
 * @static
 */
CellEditorSupport.NAME = 'dataTableCellEditorSupport';

/**
 * TODO. Wanna help? Please send a Pull Request.
 *
 * @property EDITOR_ZINDEX
 * @default 9999
 * @type Number
 * @static
 */
CellEditorSupport.EDITOR_ZINDEX = 9999;

/**
 * Static property used to define the default attribute
 * configuration for the CellEditorSupport.
 *
 * @property ATTRS
 * @type Object
 * @static
 */
CellEditorSupport.ATTRS = {

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @attribute editEvent
     * @default 'click'
     * @type String
     */
    editEvent: {
        setter: '_setEditEvent',
        validator: A.Lang.isString,
        value: 'click'
    }
};

A.mix(CellEditorSupport.prototype, {

    /**
     * Construction logic executed during CellEditorSupport instantiation.
     * Lifecycle.
     *
     * @method initializer
     * @protected
     */
    initializer: function() {
        var instance = this,
            editEvent = instance.get('editEvent');

        instance.CLASS_NAMES_CELL_EDITOR_SUPPORT = {
            cell: instance.getClassName('cell'),
            readOnly: instance.getClassName('read', 'only')
        };

        instance.after('render', instance._afterCellEditorSupportRender);

        instance.delegate(editEvent, instance._onEditCell, '.' + instance.CLASS_NAMES_CELL_EDITOR_SUPPORT.cell,
            instance);

        A.after(instance._afterSelectionKey, instance, '_onSelectionKey');
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method getEditor
     * @param record
     * @param column
     */
    getEditor: function(record, column) {
        var columnEditor = column.editor,
            recordEditor = record.get('editor');

        if (columnEditor === false || recordEditor === false) {
            return null;
        }

        return recordEditor || columnEditor;
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method _afterCellEditorSupportRender
     * @protected
     */
    _afterCellEditorSupportRender: function() {
        var instance = this;

        instance._syncModelsReadOnlyUI();

        instance.body.after(A.bind(instance._syncModelsReadOnlyUI, instance), instance.body, 'render');
    },

    /**
     * Fires after '_onSelectionKey'. Opens editor of 'activeCell' on key press.
     *
     * @method _afterSelectionKey
     * @param {EventFacade} event
     * @protected
     */
    _afterSelectionKey: function(event) {
        var instance = this,
            activeCell = instance.get('activeCell');

        if (activeCell && (event.keyCode === 13)) {
            instance._onEditCell(activeCell);
        }
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method _onEditCell
     * @param event
     * @protected
     */
    _onEditCell: function(event) {
        var instance = this,
            activeCell = instance.get('activeCell'),
            alignNode = event.alignNode || activeCell,
            column = instance.getColumn(alignNode),
            record = instance.getRecord(alignNode),
            editor = instance.getEditor(record, column);

        if (isBaseEditor(editor) && !record.get('readOnly')) {
            if (!editor.get('rendered')) {
                editor.on({
                    visibleChange: A.bind(instance._onEditorVisibleChange, instance),
                    save: A.bind(instance._onEditorSave, instance),
                    cancel: A.bind(instance._onEditorCancel, instance)
                });

                editor.set('zIndex', CellEditorSupport.EDITOR_ZINDEX);
                editor.render();
            }

            editor.set('value', record.get(column.key));

            editor.show().move(alignNode.getXY());
        }
    },

    /**
     * Invoked when the editor fires the 'cancel' event.
     *
     * @method _onEditorCancel
     * @protected
     */
    _onEditorCancel: function() {
        var instance = this;

        instance._refocusActiveCell();
    },

    /**
     * Invoked when the editor fires the 'save' event.
     *
     * @method _onEditorSave
     * @param event
     * @protected
     */
    _onEditorSave: function(event) {
        var instance = this,
            editor = event.currentTarget,
            column = instance.getActiveColumn(),
            record = instance.getActiveRecord();

        editor.set('value', event.newVal);

        record.set(column.key, event.newVal);

        instance._refocusActiveCell();
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method _onEditorVisibleChange
     * @param event
     * @protected
     */
    _onEditorVisibleChange: function(event) {
        var instance = this,
            editor = event.currentTarget;

        if (event.newVal) {
            editor._syncFocus();
        }
    },

    /**
     * Places keyboard focus onto the last active cell.
     *
     * @method _refocusActiveCell
     * @protected
     */
    _refocusActiveCell: function() {
        var instance = this,
            activeCell = instance.get('activeCell'),
            coords = instance.getCoord(activeCell);

        instance.set('activeCoord', coords);
        instance.set('selection', coords);
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method _syncModelReadOnlyUI
     * @param model
     * @protected
     */
    _syncModelReadOnlyUI: function(model) {
        var instance = this,
            row = instance.getRow(model);

        row.toggleClass(instance.CLASS_NAMES_CELL_EDITOR_SUPPORT.readOnly, model.get('readOnly') === true);
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method _syncModelsReadOnlyUI
     * @protected
     */
    _syncModelsReadOnlyUI: function() {
        var instance = this;

        instance.get('data').each(function(model) {
            instance._syncModelReadOnlyUI(model);
        });
    },

    // Deprecated methods
    // Use getEditor

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method getCellEditor
     */
    getCellEditor: function() {
        return this.getEditor.apply(this, arguments);
    },

    /**
     * TODO. Wanna help? Please send a Pull Request.
     *
     * @method getRecordColumnValue
     * @param record
     * @param column
     */
    getRecordColumnValue: function(record, column) {
        return record.get(column.key);
    }
});

A.DataTable.CellEditorSupport = CellEditorSupport;

A.Base.mix(A.DataTable, [CellEditorSupport]);
