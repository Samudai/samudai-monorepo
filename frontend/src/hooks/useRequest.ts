import { useCallback, useState } from 'react';

export type useRequestPropsCallback<T = any> = (payload: T) => Promise<any>;
type useRequestOutput<T> = [useRequestPropsCallback<T>, boolean];

function useRequest<T = void>(callback: useRequestPropsCallback<T>): useRequestOutput<T> {
    const [loading, setLoading] = useState<boolean>(false);

    const callbackFunction = useCallback(
        async (payload: T) => {
            try {
                setLoading(true);
                await callback(payload);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.error(err);
            }
        },
        [callback]
    );

    return [callbackFunction, loading];
}

export default useRequest;
