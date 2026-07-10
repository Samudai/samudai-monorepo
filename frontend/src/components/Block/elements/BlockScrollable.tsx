import clsx from 'clsx';

export type BlockScrollableProps = {
    className?: string;
    children?: React.ReactNode;
    component?: keyof JSX.IntrinsicElements;
};

const BlockScrollable: React.FC<BlockScrollableProps> = ({
    className,
    children,
    component: Tag = 'div',
}) => {
    return <Tag className={clsx('block-scrollable', className)}>{children}</Tag>;
};

export default BlockScrollable;
