import { useEffect, useRef } from 'react';

type useHorizontalScrollParams = {
    ignoreElements?: string;
};

function getElementOffset<E extends HTMLElement>(el?: E | null) {
    return el?.getBoundingClientRect().left || 0;
}

export function useHorizontalScroll<E extends HTMLElement>(params?: useHorizontalScrollParams) {
    const targetRef = useRef<E>(null);
    const activeScroll = useRef(false);
    const positionCoords = useRef({
        x: 0,
        startX: 0,
    });
    /* 
    Important. Disable drag and drop
  */
    const handleDragStart = (ev: DragEvent) => {
        ev.preventDefault();
        return false;
    };

    /* 
    Disable select texts
  */
    const handleSelectStart = (ev: Event) => {
        ev.preventDefault();
        return false;
    };

    const handleMouseDown = (ev: MouseEvent) => {
        const target = ev.target as E;
        /* 
      If there are elements that need to be ignored and happen 
      on this element, or there is no main element with 
      scrolling, we prevent the action.
    */
        if (
            (params?.ignoreElements && target.closest(params.ignoreElements)) ||
            !targetRef.current
        ) {
            return;
        }
        activeScroll.current = true;

        const coords = positionCoords.current;
        const targetLeft = getElementOffset(targetRef.current);
        coords.x = targetRef.current.scrollLeft;
        coords.startX = ev.clientX - targetLeft;
    };

    const handleMouseMove = (ev: MouseEvent) => {
        if (!activeScroll.current || !targetRef.current) return;

        const coords = positionCoords.current;
        const targetLeft = getElementOffset(targetRef.current);
        targetRef.current.scrollLeft = coords.x + coords.startX - (ev.clientX - targetLeft);
    };

    const handleMouseUp = (ev: MouseEvent) => {
        activeScroll.current = false;

        const coords = positionCoords.current;
        const targetLeft = getElementOffset(targetRef.current);
        coords.x += coords.startX - (ev.clientX - targetLeft);
    };

    useEffect(() => {
        const targetEl = targetRef.current;
        targetEl?.addEventListener('mousedown', handleMouseDown);
        targetEl?.addEventListener('mousemove', handleMouseMove);
        targetEl?.addEventListener('mouseup', handleMouseUp);
        targetEl?.addEventListener('dragstart', handleDragStart);
        targetEl?.addEventListener('selectstart', handleSelectStart);

        return () => {
            targetEl?.removeEventListener('mousedown', handleMouseDown);
            targetEl?.removeEventListener('mousemove', handleMouseMove);
            targetEl?.removeEventListener('mouseup', handleMouseUp);
            targetEl?.removeEventListener('dragstart', handleDragStart);
            targetEl?.removeEventListener('selectstart', handleSelectStart);
        };
    });

    useEffect(() => {
        if (targetRef.current) {
            targetRef.current.scrollLeft = positionCoords.current.x;
        }
    }, []);

    return { targetRef };
}
