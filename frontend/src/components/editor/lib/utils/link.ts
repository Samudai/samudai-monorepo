import { EditorType } from './../../types';
import { Editor } from 'slate';

export const isLinkActive = (editor: EditorType) => {
    const marks = Editor.marks(editor);
    return !!marks?.href;
};

export const toggleLink = (editor: EditorType, href: string) => {
    if (isLinkActive(editor)) {
        Editor.removeMark(editor, 'href');
    } else {
        Editor.addMark(editor, 'href', href);
    }
};

export const removeLink = (editor: Editor) => {
    Editor.removeMark(editor, 'href');
};

export const addLink = (editor: Editor, href: string) => {
    Editor.addMark(editor, 'href', href);
};
