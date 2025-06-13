import React from 'react';
import { BlockButton, LinkButton, MarkButton } from '../editor-toolkit';
import EditorToolbarCore from './editor-toolbar-core';
import styles from './editor-toolbar.module.scss';

const EditorToolbar: React.FC = () => {
    return (
        <EditorToolbarCore className={styles.toolbar}>
            <MarkButton format="bold" icon={<span className={styles.toolbar_bold}>B</span>} />
            <MarkButton format="italic" icon={<span className={styles.toolbar_italic}>I</span>} />
            <MarkButton
                format="underline"
                icon={<span className={styles.toolbar_underlined}>U</span>}
            />
            <BlockButton element="h2" icon={<span className={styles.toolbar_heading}>H2</span>} />
            <BlockButton element="h3" icon={<span className={styles.toolbar_heading}>H3</span>} />
            <BlockButton element="h4" icon={<span className={styles.toolbar_heading}>H4</span>} />
            <LinkButton />
        </EditorToolbarCore>
    );
};

export default EditorToolbar;
