export type createResizerArg = (arg: { width: number; height: number }) => void;

export type HandlerType = ({ width, height }: { width: number; height: number }) => void;

export type HandlerObjectType = {
    handler: HandlerType;
    element: HTMLElement;
};

export const resizer = new (class {
    private handlers: HandlerObjectType[] = [];
    private resizer: ResizeObserver;

    constructor() {
        this.resizer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const data = entry.borderBoxSize[0];
                const target = entry.target;
                const objHandler = this.handlers.find((obj) => obj.element === target);

                if (!objHandler) return;

                objHandler.handler({ width: data.inlineSize, height: data.blockSize });
            }
        });
    }

    get observer() {
        return this.resizer;
    }

    observe(element: HTMLElement, handler: HandlerType) {
        this.handlers.push({ element, handler });
        this.resizer.observe(element);

        return true;
    }

    unobserve(element: HTMLElement) {
        for (let i = 0; i < this.handlers.length; i++) {
            const objHandler = this.handlers[i];
            if (objHandler.element === element) {
                this.resizer.unobserve(objHandler.element);
                this.handlers.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    destroy() {
        this.resizer.disconnect();
    }
})();
