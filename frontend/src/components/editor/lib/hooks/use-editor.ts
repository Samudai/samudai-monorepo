import { useContext } from 'react';
import { Editor } from 'slate';
import { createContext } from 'react';

export const EditorContext = createContext({} as Editor);

export const useEditor = () => {
    return useContext(EditorContext);
};
