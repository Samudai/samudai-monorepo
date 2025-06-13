import { useEffect } from 'react';
import { useRef } from 'react';
import { useEditorNodeRef } from './use-editor-node-ref';

export const useSelection = () => {
    const selection = useRef<Range | null>(null);
    const lastSelection = useRef<Range | null>(null);
    const editorNode = useEditorNodeRef();

    const handleSelection = (ev: any) => {
        const editor = editorNode.current;
        if (!editor) return;
        const domSelection = window.getSelection();
        if (!domSelection) {
            selection.current = null;
            return;
        }
        if (!editor.contains(domSelection.focusNode || domSelection.anchorNode)) {
            selection.current = null;
            return;
        }
        const range = domSelection.getRangeAt(0);
        selection.current = lastSelection.current = range.cloneRange();
    };

    const clearSelection = () => (selection.current = lastSelection.current = null);

    useEffect(() => {
        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    });

    return {
        clearSelection,
        lastSelection,
        selection,
    };
};
