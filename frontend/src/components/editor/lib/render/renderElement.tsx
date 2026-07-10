import { CSSProperties } from 'react';
import { RenderElementProps } from 'slate-react';

export const renderElement = ({ attributes, children, element }: RenderElementProps) => {
    const style: CSSProperties = { textAlign: element.align as any };

    if (element.type === 'h2') {
        return (
            <h2 style={style} {...attributes}>
                {children}
            </h2>
        );
    }
    if (element.type === 'h3') {
        return (
            <h3 style={style} {...attributes}>
                {children}
            </h3>
        );
    }
    if (element.type === 'h4') {
        return (
            <h4 style={style} {...attributes}>
                {children}
            </h4>
        );
    }
    if (element.type === 'block-quote') {
        return (
            <blockquote style={style} {...attributes}>
                {children}
            </blockquote>
        );
    }
    if (element.type === 'bulleted-list') {
        return (
            <ul style={style} {...attributes}>
                {children}
            </ul>
        );
    }
    if (element.type === 'numbered-list') {
        return (
            <ol style={style} {...attributes}>
                {children}
            </ol>
        );
    }
    if (element.type === 'list-item') {
        return (
            <li style={style} {...attributes}>
                {children}
            </li>
        );
    }

    return (
        <p style={style} {...attributes}>
            {children}
        </p>
    );
};
