export const throttleFunction = (func, wait = 1000) => {
    console.count('throttle');
    let timer = false;
    let lastArgs;
    return function (...args) {
        if (!timer) {
            func.apply(this, args);
            timer = true;
            setTimeout(() => {
                timer = false;
                if (lastArgs) {
                    func.apply(this, lastArgs);
                }
            }, wait);
        } else {
            lastArgs = args;
        }
    };
};

export function debounceFunction(func, timeout = 300) {
    let timer;
    return (...args) => {
        if (!timer) {
            func.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
        }, timeout);
    };
}
