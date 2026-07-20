import { useLinkPopupInitialValue, LinkPopupContext } from '../hooks';

export const WithLinks: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const state = useLinkPopupInitialValue();

    return <LinkPopupContext.Provider value={state}>{children}</LinkPopupContext.Provider>;
};
