import React from 'react';
import { isActiveMark, isBlockActive, toggleBlock, toggleMark } from '../../lib/utils';
import clsx from 'clsx';
import { useSlate } from 'slate-react';
import { EditorAlignFormats } from 'components/editor/types';
import css from './editor-button.module.scss';

const alignTypes = Object.values(EditorAlignFormats) as string[];

interface EditorButtonProps {
    className?: string;
    disabled?: boolean;
    isElement?: boolean;
    format: string;
    icon: () => React.ReactNode;
    onClick?: () => void;
}

export const EditorButton: React.FC<EditorButtonProps> = ({
    className,
    isElement,
    format,
    disabled,
    onClick,
    icon,
}) => {
    const editor = useSlate();

    const isActive = isElement
        ? isBlockActive(editor, format, alignTypes.includes(format) ? 'align' : 'type')
        : isActiveMark(editor, format);

    const onMouseDown = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
        if (isElement) {
            toggleBlock(editor, format);
        } else {
            toggleMark(editor, format);
        }
    };

    return (
        <button
            className={clsx(className, css.button, isActive && css.buttonActive)}
            onClick={onClick}
            onMouseDown={onMouseDown}
            disabled={disabled}
            type="button"
        >
            {icon()}
        </button>
    );
};
