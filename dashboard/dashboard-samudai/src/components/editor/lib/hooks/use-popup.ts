import { useContainer } from './use-container';
import { useSelection } from './use-selection';
import { css } from '../utils';

export const usePopup = (posY: 'top' | 'bottom' = 'top') => {
    const container = useContainer();
    const { selection } = useSelection();

    const show = (element?: HTMLElement | null) => {
        const range = selection.current;
        const containerEl = container.current;
        if (!range || !element || !containerEl || range.toString() === '') return;
        const rangeRect = range.getBoundingClientRect();
        const containerElRect = containerEl.getBoundingClientRect();

        const offsetTop = posY === 'top' ? -element.offsetHeight : rangeRect.height;
        const top = rangeRect.top - containerElRect.top + offsetTop;
        const left =
            rangeRect.left - containerElRect.left + rangeRect.width / 2 - element.offsetWidth / 2;

        css(element, {
            opacity: '1',
            transform: `translate(${Math.max(0, left)}px, ${top}px)`,
        });
    };

    const hide = (element?: HTMLElement | null) => {
        if (!element) return;
        // css(element, { opacity: '0' });
        element.removeAttribute('style');
    };
    return { show, hide };
};
