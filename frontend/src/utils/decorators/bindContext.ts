export function bindContext(
    target: any,
    key: string,
    { configurable, enumerable, value }: PropertyDescriptor
) {
    return {
        configurable,
        enumerable,
        get(...args: any[]) {
            return value.bind(this, ...args);
        },
    };
}
