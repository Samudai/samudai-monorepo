import React, { useEffect, useRef } from 'react';
import { usePopup, useSelection } from '../../lib/hooks';
import { useEditorNodeRef } from '../../lib/hooks/use-editor-node-ref';

interface EditorToolbarCoreProps {
    className: string;
    children: React.ReactNode;
}

const EditorToolbarCore: React.FC<EditorToolbarCoreProps> = ({ className, children }) => {
    const refToolbar = useRef<HTMLDivElement>(null);
    const editorNode = useEditorNodeRef();
    const { show, hide } = usePopup();
    const { selection: slctn } = useSelection();

    const preventEvent = (ev: React.MouseEvent<HTMLDivElement>) => {
        ev.preventDefault();
    };

    const handleSelection = () => {
        const domSelection = slctn.current;

        if (!editorNode.current || !refToolbar.current) return;
        if (!domSelection || domSelection.collapsed) return hide(refToolbar.current);

        show(refToolbar.current);
    };

    useEffect(() => {
        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    });

    return (
        <div ref={refToolbar} className={className} onMouseDown={preventEvent}>
            {children}
        </div>
    );
};

export default EditorToolbarCore;
