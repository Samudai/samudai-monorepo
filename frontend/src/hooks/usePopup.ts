import { useRef, useState } from 'react';

type Props<T> = {
    payload?: T;
    transition?: number;
};

function usePopup<T = any>({ payload, transition = 400 }: Props<T> = {}) {
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const [data, setData] = useState<{
        active: boolean;
        payload: T | null;
    }>({
        active: false,
        payload: payload === undefined ? null : payload,
    });

    const open = (payload?: T) => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        setData({
            active: true,
            payload: payload === undefined ? null : payload,
        });
    };

    const close = () => {
        setData((prev) => ({ ...prev, active: false }));
        timeout.current = setTimeout(() => {
            setData((prev) => ({ ...prev, payload: null }));
        }, transition);
    };

    const toggle = (payload?: T) => {
        const isActive = !data.active;
        if (isActive) open(payload);
        if (!isActive) close();
    };

    return {
        active: data.active,
        payload: data.payload,
        open,
        close,
        toggle,
    };
}

export default usePopup;
