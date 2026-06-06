import { useEffect, useRef, useState } from 'react';
import { resizer } from './resizer';

export interface ContentSizeType {
    width: number;
    height: number;
}

function useResize<E extends HTMLElement>() {
    const elementRef = useRef<E>(null);

    const [contentSize, setContentSize] = useState<ContentSizeType>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const element = elementRef.current;
        if (element) {
            resizer.observe(element, (data) => {
                setContentSize(data);
            });
            return () => {
                resizer.unobserve(element);
            };
        }
    }, [elementRef.current]);

    return { elementRef, contentSize };
}

export default useResize;
