export function css<T extends HTMLElement>(element: T, styles: Partial<CSSStyleDeclaration>) {
    Object.assign(element.style, styles);
}

export const toggleScroll = (bool: boolean) => {
    css(document.body, { overflow: '', paddingRight: '' });

    if (!bool) {
        const paddingRight = window.innerWidth - document.body.getBoundingClientRect().width + 'px';
        css(document.body, {
            overflow: 'hidden',
            paddingRight,
        });
    }
};

export const includeValue = (str1: string, str2: string) => {
    return str1.toLowerCase().includes(str2.toLocaleLowerCase());
};

export function toggleArrayItem<T extends any[]>(arr: T, value: any) {
    if (arr.includes(value)) {
        return arr.filter((v) => v !== value);
    }

    return [...arr, value];
}
