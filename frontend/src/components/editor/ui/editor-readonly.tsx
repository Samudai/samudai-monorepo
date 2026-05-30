import React from 'react';
import { useEditor } from '../lib/hooks';
import { renderElement, renderLeaf } from '../lib/render';
import clsx from 'clsx';
import { Editable, ReactEditor, Slate } from 'slate-react';
import { ReadonlyEditorProps } from '../types';
import styles from '../editor.module.scss';

export const EditorReadonly: React.FC<ReadonlyEditorProps> = ({ value, classNameEditor }) => {
    const editor = useEditor();

    // useEffect(() => {
    //   editor.children = value;
    // }, [value]);
    editor.children = value;

    return (
        <Slate editor={editor as ReactEditor} value={value}>
            <Editable
                autoFocus={false}
                readOnly={true}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                className={clsx(classNameEditor, styles.editor_area)}
                autoCapitalize="false"
                autoCorrect="false"
                spellCheck="false"
            />
        </Slate>
    );
};
