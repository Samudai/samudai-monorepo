import React, { useRef, useState } from 'react';
import { RootProvider } from './lib/providers';
import { EditorEditable } from './ui/editor-editable';
import { EditorReadonly } from './ui/editor-readonly';
import clsx from 'clsx';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { EditorProps } from './types';
import styles from './editor.module.scss';
import { getRawText } from 'utils/utils';

export const Editor: React.FC<EditorProps> = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [editor] = useState(withReact(createEditor()));

    return (
        <RootProvider editor={editor} container={containerRef}>
            <div
                ref={containerRef}
                className={clsx(styles.editor, props.className)}
                data-analytics-click={
                    props.readOnly ? props.dataAnalyticsReadOnly : props.dataAnalyticsEditable
                }
            >
                {!!props.emptyText && !getRawText(props.value) && props.readOnly && (
                    <div className={styles.emptyText}>{props.emptyText}</div>
                )}
                {props.readOnly === true ? (
                    <EditorReadonly {...props} />
                ) : (
                    <EditorEditable {...props} />
                )}
            </div>
        </RootProvider>
    );
};
