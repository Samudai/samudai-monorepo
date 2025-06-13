import { createContext, useContext } from 'react';
import { Task, SubTask, TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import usePopup from 'hooks/usePopup';

type PopupType<T = any> = {
    active: boolean;
    payload: T | null;
    open: (payload?: T) => void;
    toggle: (payload?: T) => void;
    close: () => void;
};

type SubtasksContextType = {
    subtaskState: PopupType;
    detailState: PopupType<TaskResponse>;
    subtaskDetailState: PopupType<SubTask>;
    assigneesState: PopupType;
    payoutState: PopupType<string>;
    postJobState: PopupType<Task>;
};

const getState = () => ({
    active: false,
    payload: null,
    close: () => {},
    open: () => {},
    toggle: () => {},
});

export const SubtasksContext = createContext<SubtasksContextType>({
    subtaskState: getState(),
    detailState: getState(),
    subtaskDetailState: getState(),
    assigneesState: getState(),
    payoutState: getState(),
    postJobState: getState(),
});

export const useSubtaskInitialValue = () => {
    const subtaskState = usePopup();
    const detailState = usePopup<TaskResponse>();
    const subtaskDetailState = usePopup<SubTask>();
    const assigneesState = usePopup();
    const payoutState = usePopup<string>();
    const postJobState = usePopup<Task>();

    return {
        subtaskState,
        detailState,
        subtaskDetailState,
        assigneesState,
        payoutState,
        postJobState,
    };
};

export const useSubtaskState = () => {
    const context = useContext(SubtasksContext);
    return context;
};
