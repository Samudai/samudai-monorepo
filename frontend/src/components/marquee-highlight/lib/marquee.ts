interface Props {
    duration?: number;
    direction?: 'up' | 'down';
}

export const createMarquee = (
    element: HTMLElement,
    { duration = 2000, direction = 'up' }: Props = {}
) => {
    const position = { y: 0 };

    let raf = -1;
    let now = performance.now();
    let start = now;

    const draw = () => {
        element.style.transform = `translate3d(0, ${-position.y}px, 0)`;
    };

    const update = (timestamp: number) => {
        if (timestamp - now < 1000 / 60) return;

        now = timestamp;

        let fraction = (timestamp - start) / duration;

        if (fraction > 1) {
            fraction = 1;
            start = now;
        }

        const height = element.offsetHeight;
        const center = height / 2;

        if (direction === 'up') {
            position.y = center * fraction;
        }

        if (direction === 'down') {
            position.y = center - center * fraction;
        }
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
