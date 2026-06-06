import { removeLink } from './../utils/link';
import { toggleBlock } from './../utils/block';
import { Editor } from 'slate';
import { toggleMark } from '../utils';

export const useKeyDown = (editor: Editor) => {
    const onKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
        if (ev.key === 'Enter') {
            removeLink(editor);
        }
        if (ev.ctrlKey) {
            if (['b', 'u', 'i', '2', '3', '4'].includes(ev.key)) {
                ev.preventDefault();
            }

            if (ev.key === 'b') return toggleMark(editor, 'bold');
            if (ev.key === 'u') return toggleMark(editor, 'underline');
            if (ev.key === 'i') return toggleMark(editor, 'italic');
            if (ev.key === '2') return toggleBlock(editor, 'h2');
            if (ev.key === '3') return toggleBlock(editor, 'h3');
            if (ev.key === '4') return toggleBlock(editor, 'h4');
        }
    };

    return onKeyDown;
};
