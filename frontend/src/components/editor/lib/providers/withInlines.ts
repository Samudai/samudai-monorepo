import { Editor } from 'slate';
import { EditorType } from './../../types';
import { addLink } from './../utils/link';
import { isUrl } from '../utils';

export const withInlines = (editor: EditorType) => {
    const { insertText } = editor;

    editor.insertText = (text: string) => {
        if (text && isUrl(text)) {
            if (Editor.string(editor, editor.selection as any) === '') {
                insertText(text);
            }
            addLink(editor, text);
        } else {
            insertText(text);
        }
    };

    return editor;
};
