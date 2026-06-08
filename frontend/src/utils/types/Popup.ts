export type PopupType<T = any> = {
    active: boolean;
    payload: T | null;
    open: (payload?: T) => void;
    toggle: (payload?: T) => void;
    close: () => void;
};
