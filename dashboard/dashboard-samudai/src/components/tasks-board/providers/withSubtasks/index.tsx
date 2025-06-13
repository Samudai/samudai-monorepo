import { SubtasksContext, useSubtaskInitialValue, useSubtaskState } from './context';

export { useSubtaskState };

export const WithSubtasks: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const state = useSubtaskInitialValue();

    return <SubtasksContext.Provider value={state}>{children}</SubtasksContext.Provider>;
};
