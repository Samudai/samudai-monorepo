export const createHighlight = (element: HTMLElement) => {
    const opacity = 0;
    let raf = -1;
    let now = performance.now();

    const update = (timestamp: number) => {
        if (timestamp - now < 1000 / 16) return;

        now = timestamp;

        const parent = element.parentElement;
        if (!parent) return;

        const center = parent.offsetHeight / 2;
    };

    const draw = () => {
        element.style.opacity = opacity.toString();
    };

    const tick = (timestamp: number) => {
        update(timestamp);
        draw();

        raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return {
        destroy() {
            cancelAnimationFrame(raf);
        },
    };
};
