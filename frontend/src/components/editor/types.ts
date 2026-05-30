import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';

export enum EditorAlignFormats {
    LEFT = 'left',
    RIGHT = 'right',
    CENTER = 'center',
    JUSTIFY = 'justify',
}

export enum EditorListEnum {
    NUMBERED = 'numbered-list',
    BULLETED = 'bulleted-list',
}

export type EditorType = (BaseEditor & ReactEditor) | BaseEditor;

interface CommonProps {
    className?: string;
    classNameEditor?: string;
    readOnly?: boolean;
    value: Descendant[];
    dataAnalyticsReadOnly?: string;
    dataAnalyticsEditable?: string;
    emptyText?: string;
}

export interface WithEditProps {
    readOnly?: false;
    placeholder?: string;
    onChange: (value: Descendant[]) => void;
}

export interface WithReadProps {
    readOnly: true;
}

export type EditorProps = CommonProps & (WithReadProps | WithEditProps);
export type EditableEditorProps = Omit<EditorProps, 'className'> & WithEditProps;
export type ReadonlyEditorProps = Omit<EditorProps, 'className'> & WithReadProps;
