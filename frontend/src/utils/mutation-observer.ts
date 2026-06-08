export class MutationObserverElement {
    private observer: MutationObserver;

    constructor(
        private readonly element: HTMLElement,
        private readonly onUpdate?: () => void
    ) {
        this.observer = new MutationObserver(this.onMutation);
        this.observer.observe(this.element, {
            childList: true,
            attributes: true,
            subtree: true,
        });
    }

    onMutation = () => {
        this.onUpdate?.();
        console.log('mutattion');
    };

    destroy() {
        this.observer.disconnect();
    }
}
