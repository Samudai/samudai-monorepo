import React, { useEffect, useState } from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { ArrowDownIcon } from '../icons';
import css from './editor-font.module.scss';

export const EditorFont: React.FC = () => {
    const editor = useSlate();
    const [fontSize, setFontSize] = useState(14);

    const onIncreaseFont = (n = 1) => {
        const size = Math.max(10, Math.min(20, fontSize + n));
        setFontSize(size);
        Editor.addMark(editor, 'fontSize', `${size}px`);
    };

    useEffect(() => {
        const marks = Editor.marks(editor);
        const fontSize = parseInt(marks?.fontSize || '');
        if (fontSize) {
            setFontSize(fontSize);
        }
    });

    return (
        <div className={css.font}>
            <p className={css.font_size}>{fontSize} pt</p>
            <div className={css.font_buttons}>
                <button
                    className={css.font_buttons_up}
                    onClick={onIncreaseFont.bind(null, 1)}
                    disabled={fontSize === 20}
                    type="button"
                >
                    <ArrowDownIcon />
                </button>
                <button
                    className={css.font_buttons_down}
                    onClick={onIncreaseFont.bind(null, -1)}
                    disabled={fontSize === 10}
                    type="button"
                >
                    <ArrowDownIcon />
                </button>
            </div>
        </div>
    );
};
