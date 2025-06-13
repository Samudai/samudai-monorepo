import { useCallback, useRef } from 'react';

type CallbackType<T> = (props: T) => void;
type ExecuteType = () => void;

const useDelayedSearch = <T = void>(callback: CallbackType<T>, delay: number) => {
    const disabled = useRef<boolean>(false);
    const execute = useRef<ExecuteType | null>(null);

    const debounceCallback = useCallback(
        (props: T) => {
            if (disabled.current) {
                execute.current = () => callback(props);
                return;
            }
            execute.current = null;
            disabled.current = true;
            callback(props);
            setTimeout(() => {
                disabled.current = false;
                if (execute.current) {
                    execute.current();
                }
            }, delay);
        },
        [callback, delay]
    );

    return debounceCallback;
};

export default useDelayedSearch;
