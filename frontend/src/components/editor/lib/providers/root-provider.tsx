import React from 'react';
import { ContainerContext } from '../hooks/use-container';
import { Editor } from 'slate';
import { EditorContext } from '../hooks';

interface RootProviderProps {
    editor: Editor;
    children: React.ReactNode;
    container: { current: null | HTMLDivElement };
}

export const RootProvider: React.FC<RootProviderProps> = ({ editor, children, container }) => {
    // const linkState = useLinkPopupInitialValue();

    return (
        <ContainerContext.Provider value={container}>
            <EditorContext.Provider value={editor}>
                {children}
                {/* <LinkPopupContext.Provider value={linkState}>{children}</LinkPopupContext.Provider> */}
            </EditorContext.Provider>
        </ContainerContext.Provider>
    );
};
