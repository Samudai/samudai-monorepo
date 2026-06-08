import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

type CustomElement = {
    type: string;
    children: CustomText[];
    url?: string;
    align?: string;
};
type CustomText = {
    text: string;
    bold?: true;
    italic?: true;
    underline?: true;
    href?: string;
    fontSize?: string;
};

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}
