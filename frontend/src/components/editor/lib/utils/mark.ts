import { Editor } from 'slate';
import { EditorType } from '../../types';

export const isActiveMark = (editor: EditorType, format: string) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format as keyof typeof marks] === true : false;
};

export const toggleMark = (editor: EditorType, format: string) => {
    const isActive = isActiveMark(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};
