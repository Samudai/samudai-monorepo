import { useEffect, useRef, useState } from 'react';

export function useScrollbar<E extends HTMLElement>(wHeight?: boolean) {
    const [isScrollbar, setScrollbar] = useState(false);
    const ref = useRef<E>(null);

    const handleCheckScrollbar = () => {
        const element = ref.current;

        if (element) {
            if (wHeight) {
                setScrollbar(
                    document.documentElement.getBoundingClientRect().width < window.innerWidth
                );
            } else {
                setScrollbar(element.offsetHeight !== element.scrollHeight);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleCheckScrollbar);
        return () => window.removeEventListener('resize', handleCheckScrollbar);
    });

    useEffect(() => {
        handleCheckScrollbar();
    });

    return { ref, isScrollbar };
}
