import { ReactEditor } from 'slate-react';
import { useEditor } from './use-editor';
import { useEffect, useRef } from 'react';

export const useEditorNodeRef = () => {
    const editorNode = useRef<HTMLElement | null>(null);
    const editor = useEditor();

    useEffect(() => {
        editorNode.current = ReactEditor.toDOMNode(editor as ReactEditor, editor);
    }, [editor]);

    return editorNode;
};
