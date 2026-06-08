type CSSStyles = {
    [P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P];
};

export function css<T extends HTMLElement>(el: T, styles: CSSStyles) {
    Object.assign(el.style, styles);
}
