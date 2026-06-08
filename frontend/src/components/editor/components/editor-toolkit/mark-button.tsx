import React from 'react';
import { useSlate } from 'slate-react';
import { isActiveMark, toggleMark } from '../../lib/utils';
import ToolButton from '../tool-button/tool-button';

interface MarkButtonProps {
    format: string;
    icon: React.ReactNode;
}

export const MarkButton: React.FC<MarkButtonProps> = ({ format, icon }) => {
    const editor = useSlate();

    const handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
        toggleMark(editor, format);
    };

    return <ToolButton active={isActiveMark(editor, format)} icon={icon} onClick={handleClick} />;
};
