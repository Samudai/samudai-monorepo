import React from 'react';
import { useLinkPopupActions } from '../../lib/hooks';
import { LinkIcon } from '../editor-icons';
import ToolButton from '../tool-button/tool-button';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import styles from './editor-toolkit.module.scss';

export const LinkButton: React.FC = () => {
    const editor = useSlate();
    const actions = useLinkPopupActions();

    const handleClick = () => {
        const marks = Editor.marks(editor);
        if (!marks) return;
        actions.show(editor.selection, marks?.href || '');
    };

    const getActiveMark = () => {
        const marks = Editor.marks(editor);
        return marks ? !!marks.href?.length : false;
    };

    return (
        <ToolButton
            active={getActiveMark()}
            icon={<LinkIcon className={styles.toolkit_link} />}
            onClick={handleClick}
        />
    );
};
