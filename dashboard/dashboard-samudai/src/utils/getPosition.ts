export const getScrollPosition = () => {
    return {
        pageX: window.pageXOffset || document.documentElement.offsetLeft,
        pageY: window.pageYOffset || document.documentElement.offsetTop,
    };
};

export function getElementCoords<E extends HTMLElement>(el: E) {
    const coords = el.getBoundingClientRect();
    const { pageX, pageY } = getScrollPosition();

    const height = coords.height;
    const width = coords.width;
    const left = coords.left;
    const right = coords.right;
    const top = coords.top;
    const bottom = coords.bottom;
    const offsetLeft = pageX + left;
    const offsetTop = pageY + top;
    const scrollHeight = el.scrollHeight;

    return {
        height,
        width,
        left,
        right,
        top,
        bottom,
        offsetLeft,
        offsetTop,
        scrollHeight,
    };
}

export const parseSizeToPixels = (size?: string) => {
    if (!size || size === '') {
        return null;
    }

    const number = parseInt(size);
    if (size.includes('%')) {
        return window.innerHeight * (parseInt(size) / 100);
    }

    return number;
};
