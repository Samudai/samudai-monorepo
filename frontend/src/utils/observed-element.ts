type UpdateFunction = (width: number, height: number) => void;

export class ObserverElement {
    observer: ResizeObserver;
    width = 0;
    height = 0;

    constructor(
        private readonly element: HTMLElement,
        private readonly onUpdate?: UpdateFunction
    ) {
        this.observer = new ResizeObserver(this.onResize);
        this.observer.observe(this.element);
    }

    onResize = ([entry]: ResizeObserverEntry[]) => {
        if (entry) {
            const { width, height } = entry.contentRect;
            this.width = width;
            this.height = height;
            this.onUpdate?.(this.width, this.height);
        }
    };

    destroy() {
        this.observer.disconnect();
    }
}
