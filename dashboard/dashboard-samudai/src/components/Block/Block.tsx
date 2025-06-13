import React, { useEffect, useState } from 'react';
import Detail from './elements/BlockDetail';
import DragButton from './elements/BlockDragButton';
import Header from './elements/BlockHeader';
import Link from './elements/BlockLink';
import Scrollable from './elements/BlockScrollable';
import Title from './elements/BlockTitle';
import clsx from 'clsx';
import { useResize } from 'hooks/useResize';
import { getMediaClasses } from 'utils/breakpoint/getMediaClasses';
import { BlockProps } from './types';
import './Block.scss';

const Block = React.forwardRef<HTMLDivElement, BlockProps>(
    ({ className, media, additionalClass, children, onChangeSize, ...props }, ref) => {
        const { elementRef, contentSize } = useResize<HTMLDivElement>();
        const [mediaClasses, setMediaClasses] = useState<string | null>(null);

        useEffect(() => {
            if (ref && typeof ref === 'object') {
                ref.current = elementRef.current;
            }
        }, [elementRef.current]);

        useEffect(() => {
            if (media) {
                const classNames = getMediaClasses(media, contentSize.width);
                onChangeSize?.(classNames);
                setMediaClasses(classNames);
            }
        }, [contentSize]);

        return (
            <div
                {...props}
                ref={elementRef}
                className={clsx('block', className, additionalClass, mediaClasses)}
                data-role="block-scrollable"
            >
                {children}
            </div>
        );
    }
);

Block.displayName = 'Block';

export default Object.assign(Block, {
    Title,
    Header,
    Detail,
    Scrollable,
    DragButton,
    Link,
});
