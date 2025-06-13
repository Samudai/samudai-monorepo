import { useRef, useCallback } from 'react';

type CallbackType<T> = (props: T) => void;

const useDebounce = <T>(callback: CallbackType<T>, delay: number) => {
    const timer = useRef<NodeJS.Timeout>();

    const debounced = useCallback(
        (props: T) => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
            timer.current = setTimeout(() => {
                callback(props);
            }, delay);
        },
        [delay, callback]
    );

    return debounced;
};

export default useDebounce;
