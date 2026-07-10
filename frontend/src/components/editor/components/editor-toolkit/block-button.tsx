import React from 'react';
import { isBlockActive, toggleBlock } from '../../lib/utils';
import ToolButton from '../tool-button/tool-button';
import { useSlate } from 'slate-react';

interface BlockButtonProps {
    element: string;
    icon: React.ReactNode;
}

export const BlockButton: React.FC<BlockButtonProps> = ({ element, icon }) => {
    const editor = useSlate();

    const handleClick = () => {
        toggleBlock(editor, element);
    };

    return <ToolButton active={isBlockActive(editor, element)} icon={icon} onClick={handleClick} />;
};
