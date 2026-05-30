import React, { useEffect } from 'react';
import { useContainer, useEditor } from '../lib/hooks';
import { useKeyDown } from '../lib/hooks/use-keydown';
import { renderElement, renderLeaf } from '../lib/render';
// import EditorLinkPopup from './editor-link-popup/editor-link-popup';
// import EditorToolbar from './editor-toolbar/editor-toolbar';
import clsx from 'clsx';
import { Editable, ReactEditor, Slate } from 'slate-react';
import { EditableEditorProps } from '../types';
import styles from '../editor.module.scss';
import { EditorToolbar } from './editor-toolbar';

export const EditorEditable: React.FC<EditableEditorProps> = ({
    onChange,
    value,
    classNameEditor,
    placeholder,
}) => {
    const editor = useEditor();
    const onKeyDownEvents = useKeyDown(editor);
    const containerRef = useContainer();

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.style.height = '';
            container.style.height = `${container.scrollHeight}px`;
        }
    });

    useEffect(() => {
        if (value.length > 0) return;
        onChange([{ type: 'paragraph', children: [{ text: '' }] }]);
    });

    return (
        <Slate editor={editor as ReactEditor} value={value} onChange={onChange}>
            {/* <EditorToolbar />
      <EditorLinkPopup /> */}
            <EditorToolbar />
            <Editable
                autoFocus={false}
                readOnly={false}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                className={clsx(classNameEditor, styles.editor_area)}
                placeholder={placeholder}
                onKeyDown={onKeyDownEvents}
                autoCapitalize="false"
                autoCorrect="false"
                spellCheck="false"
            />
        </Slate>
    );
};
