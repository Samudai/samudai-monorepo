import { createContext, useContext } from 'react';

export const ContainerContext = createContext({ current: null } as {
    current: HTMLDivElement | null;
});

export const useContainer = () => {
    return useContext(ContainerContext);
};
