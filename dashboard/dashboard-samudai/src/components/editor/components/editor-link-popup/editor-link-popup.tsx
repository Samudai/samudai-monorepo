import React, { useEffect, useRef } from 'react';
import { useEditor, useLinkPopupActions, useLinkPopupState, usePopup } from '../../lib/hooks';
import { useEditorNodeRef } from '../../lib/hooks/use-editor-node-ref';
import { isUrl } from '../../lib/utils';
import { addLink, removeLink } from '../../lib/utils/link';
import { CrossIcon, MarkIcon } from '../editor-icons';
import styles from './editor-link-popup.module.scss';

const EditorLinkPopup: React.FC = () => {
    const firstRender = useRef(true);
    const refLink = useRef<HTMLDivElement>(null);
    const { active, input, setHref, href, selection, hadHref } = useLinkPopupState();
    const linkActions = useLinkPopupActions();
    const { hide, show } = usePopup('bottom');
    const editor = useEditor();
    const editorNode = useEditorNodeRef();

    const hidePopup = () => {
        hide(refLink.current);
        linkActions.hide();
        linkActions.reset();
        editorNode.current?.focus();
    };

    const handleAdd = () => {
        if (selection.current && href) {
            addLink(editor, href);
            linkActions.setHasHref();
        }
    };

    const handleRemove = () => {
        removeLink(editor);
        linkActions.removeHasHref();
    };

    const handleMouseDown = (ev: React.MouseEvent<HTMLDivElement>) => {
        const target = ev.target as HTMLDivElement;
        if (!['INPUT', 'BUTTON'].includes(target.nodeName)) {
            ev.preventDefault();
        }
    };

    const handleClickOut = (ev: MouseEvent) => {
        const target = ev.target as HTMLElement;
        if (!refLink.current) return;
        if (target.closest('[data-tool]')) return;
        if (ev.composedPath().includes(refLink.current)) return;
        hidePopup();
    };

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (!active.current) {
            return hidePopup();
        }
        show(refLink.current);
        setTimeout(linkActions.focus);

        document.addEventListener('mousedown', handleClickOut);
        return () => document.addEventListener('mousedown', handleClickOut);
    }, [active.current]);

    return (
        <div ref={refLink} className={styles.link} onMouseDown={handleMouseDown}>
            <div className={styles.link_inner} data-valid={isUrl(href)}>
                <input
                    className={styles.link_input}
                    ref={input}
                    value={href}
                    onChange={(e) => setHref(e.target.value)}
                />
                <button
                    type="button"
                    className={styles.link_btn}
                    disabled={!isUrl(href)}
                    onClick={handleAdd}
                >
                    <MarkIcon />
                </button>
                {hadHref.current && (
                    <button type="button" className={styles.link_btn} onClick={handleRemove}>
                        <CrossIcon />
                    </button>
                )}
            </div>
        </div>
    );
};

export default EditorLinkPopup;
