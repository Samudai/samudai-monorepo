import { CustomElement, CustomText } from '../../editor-types';
import escapeHtml from 'escape-html';
import { Descendant, Text } from 'slate';
import { jsx } from 'slate-hyperscript';

export const createDomFromString = (text: string) => {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc;
};

export function parseDocumentToSlate<T extends Element>(
    el: T,
    markAttributes = {} as CustomText
): unknown {
    if (el.nodeType === Node.TEXT_NODE) {
        return jsx('text', markAttributes, el.textContent);
    } else if (el.nodeType !== Node.ELEMENT_NODE) {
        return null;
    }

    const nodeAttributes = { ...markAttributes };
    const styles = (el as any).style;

    if (styles.fontSize) {
        nodeAttributes.fontSize = styles.fontSize;
    }

    // define attributes for text nodes
    switch (el.nodeName) {
        case 'STRONG':
            nodeAttributes.bold = true;
            break;
        case 'A':
            nodeAttributes.href = (el as any).href;
            break;
        case 'U':
            nodeAttributes.underline = true;
            break;
        case 'EM':
            nodeAttributes.italic = true;
            break;
    }

    const children = Array.from(el.childNodes)
        .map((node) => parseDocumentToSlate(node as T, nodeAttributes))
        .flat();

    if (children.length === 0) {
        children.push(jsx('text', nodeAttributes, ''));
    }

    const attributes: Record<string, string> = {};

    if (styles.textAlign) {
        attributes.align = styles.textAlign;
    }

    switch (el.nodeName) {
        case 'BODY':
            return jsx('fragment', {}, children);
        case 'BR':
            return '\n';
        case 'H2':
            return jsx('element', { ...attributes, type: 'h2' }, children);
        case 'H3':
            return jsx('element', { ...attributes, type: 'h3' }, children);
        case 'H4':
            return jsx('element', { ...attributes, type: 'h4' }, children);
        case 'P':
            return jsx('element', { ...attributes, type: 'paragraph' }, children);
        case 'BLOCKQUOTE':
            return jsx('element', { ...attributes, type: 'block-quote' }, children);
        case 'UL':
            return jsx('element', { ...attributes, type: 'bulleted-list' }, children);
        case 'OL':
            return jsx('element', { ...attributes, type: 'numbered-list' }, children);
        case 'LI':
            return jsx('element', { ...attributes, type: 'list-item' }, children);
        default:
            return children;
    }
}

export const parseFromSlateToString = (node: CustomElement | CustomText): string => {
    if (Text.isText(node)) {
        let string = escapeHtml(node.text);
        if (node.bold) {
            string = `<strong>${string}</strong>`;
        }
        if (node.italic) {
            string = `<em>${string}</em>`;
        }
        if (node.underline) {
            string = `<u>${string}</u>`;
        }
        if (node.href) {
            string = `<a href="${node.href}">${string}</a>`;
        }
        if (node.fontSize) {
            string = `<span style="font-size:${node.fontSize};verticalAlign:middle;">${string}</span>`;
        }
        return string;
    }

    const children = node.children.map((n) => parseFromSlateToString(n)).join('');

    const align = (node as any).align ? ` style="text-align: ${(node as any).align};"` : '';

    switch (node.type) {
        case 'h2':
            return `<h2${align}>${children}</h2$>`;
        case 'h3':
            return `<h3${align}>${children}</h2>`;
        case 'h4':
            return `<h4${align}>${children}</h2>`;
        case 'paragraph':
            return `<p${align}>${children}</p>`;
        case 'block-quote':
            return `<blockquote${align}>${children}</blockquote>`;
        case 'numbered-list':
            return `<ol${align}>${children}</ol>`;
        case 'bulleted-list':
            return `<ul${align}>${children}</ul>`;
        case 'list-item':
            return `<li${align}>${children}</li>`;
        default:
            return children;
    }
};

export const parseToString = (values: Descendant[]) => {
    const stringify = function (val: Descendant): string {
        return Text.isText(val) ? val.text : val.children.map(stringify).join('');
    };
    return values
        .map(stringify)
        .filter((str) => str !== '')
        .join(' ');
};

export const deserialize = (text?: string) => {
    const newDescedant = [
        {
            type: 'paragraph',
            children: [{ text: '' }],
        },
    ] as Descendant[];

    if (!text) return newDescedant;

    const document = createDomFromString(text);
    const descedants = parseDocumentToSlate(document.body) as Descendant[];

    if (descedants.length === 0 || !(descedants[0] as any)?.type) {
        return newDescedant;
    }

    return descedants;
};

export const serialize = (state: Descendant[]): string => {
    return state.map(parseFromSlateToString).join('');
};
