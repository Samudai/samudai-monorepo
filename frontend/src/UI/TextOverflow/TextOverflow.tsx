import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import './TextOverflow.scss';

type TextOverflowProps = React.HTMLAttributes<HTMLParagraphElement> & {
    trigger?: number | string;
};

const TextOverflow: React.FC<TextOverflowProps> = ({ children, className, trigger, ...props }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const paragraphRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const parent = rootRef.current;
        const paragraph = paragraphRef.current;

        if (!paragraph || !parent) return;

        parent.removeAttribute('style');
        paragraph.removeAttribute('style');

        const width = paragraph.offsetWidth;
        parent.style.width = '100%';
        paragraph.style.maxWidth = '';
        paragraph.style.fontSize = '0px';

        if (paragraph.offsetWidth < width) {
            paragraph.style.maxWidth = paragraph.offsetWidth + 'px';
        } else {
            parent.style.width = '';
        }

        paragraph.style.fontSize = '';
    });

    return (
        <div ref={rootRef} className={clsx('ui-text-overflow', className)}>
            <p ref={paragraphRef} {...props} className="ui-text-overflow-text">
                {children}
            </p>
            <p className="ui-text-overflow-full">{children}</p>
        </div>
    );
};

export default TextOverflow;
