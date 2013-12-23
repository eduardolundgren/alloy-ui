AUI Undo/Redo
========

Undo/Redo module allows different applications to implement undo and redo actions.

How to use it:

1. Load 'aui-undo-redo' module
2. Implement UndoRedoAction. This requires to extend the UndoRedoAction and implement the following methods:
 - undo
 - redo
 - cancel (optional)
 - merge (optional)