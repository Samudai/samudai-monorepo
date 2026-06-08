import { EditorAlignFormats, EditorListEnum, EditorType } from '../../types';
import { Transforms, Editor, Element as SlateElement } from 'slate';

export const alignTypes = Object.values(EditorAlignFormats) as string[];
export const listTypes = Object.values(EditorListEnum) as string[];

// Slate's base `Element` type doesn't declare the editor's custom props (`type`
// and the dynamic `blockType` key), so widen it explicitly instead of `as any`.
type SlateElementWithType = SlateElement & { type?: string; [key: string]: unknown };

export const isBlockActive = (editor: EditorType, format: string, blockType: string = 'type') => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                (n as SlateElementWithType)[blockType] === format,
        })
    );

    return !!match;
};
export const toggleBlock = (editor: EditorType, format: string) => {
    const isActive = isBlockActive(editor, format, alignTypes.includes(format) ? format : 'type');

    const isList = listTypes.includes(format);

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            listTypes.includes((n as SlateElementWithType).type ?? '') &&
            !alignTypes.includes(format),
        split: true,
    });

    let newProperties: Partial<SlateElement & { align?: string }>;

    if (alignTypes.includes(format)) {
        newProperties = {
            align: isActive ? 'type' : format,
        };
    } else {
        newProperties = {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        };
    }

    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};
