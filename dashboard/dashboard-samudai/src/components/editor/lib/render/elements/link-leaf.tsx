import { RenderLeafProps } from 'slate-react';

interface LinkLeafProps {
    href: string;
    children: RenderLeafProps['children'];
}

type LinkMouseEvent = (ev: React.MouseEvent<HTMLAnchorElement>) => void;

export const LinkLeaf: React.FC<LinkLeafProps> = ({ href, children }) => {
    const mouseClick: LinkMouseEvent = (ev) => {
        if (ev.ctrlKey) {
            window.open(href);
        }
    };

    const mouseMove: LinkMouseEvent = (ev) => {
        const target = ev.currentTarget as HTMLAnchorElement;
        if (ev.ctrlKey) {
            target.classList.add('anchor');
        } else if (target.classList.contains('anchor')) {
            target.classList.remove('anchor');
        }
    };

    const mouseLeave: LinkMouseEvent = (ev) => {
        const target = ev.currentTarget as HTMLAnchorElement;
        target.classList.remove('anchor');
    };

    return (
        <a href={href} onClick={mouseClick} onMouseMove={mouseMove} onMouseLeave={mouseLeave}>
            {children}
        </a>
    );
};
