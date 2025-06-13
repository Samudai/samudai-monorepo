interface AnimateProps {
    duration: number;
    timingFunction: (progress: number) => number;
    draw: (progress: number) => void;
}

export function animate({ duration, timingFunction, draw }: AnimateProps) {
    const time = performance.now();
    requestAnimationFrame(function play(timestamp) {
        let fraction = (timestamp - time) / duration;
        if (fraction > 1) fraction = 1;

        const progress = timingFunction(fraction);
        draw(progress);

        if (fraction < 1) requestAnimationFrame(play);
    });
}
