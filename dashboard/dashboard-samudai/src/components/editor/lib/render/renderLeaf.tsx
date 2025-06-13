import { RenderLeafProps } from 'slate-react';
import { LinkLeaf } from './elements';

const getMarked = ({ leaf, children }: RenderLeafProps) => {
    if (leaf.fontSize) {
        const style = {
            fontSize: leaf.fontSize,
            verticalAlign: 'middle',
        };
        children = <span style={style}>{children}</span>;
    }
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
        children = <em>{children}</em>;
    }
    if (leaf.underline) {
        children = <u>{children}</u>;
    }
    if (leaf.href) {
        children = <LinkLeaf href={leaf.href} children={children} />;
    }
    return children;
};

export const renderLeaf = (props: RenderLeafProps) => {
    const childrenLeaf = getMarked(props);
    return <span {...props.attributes}>{childrenLeaf}</span>;
};
