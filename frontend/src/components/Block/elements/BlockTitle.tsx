import clsx from 'clsx';

type BlockTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
    type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    className?: string;
    children?: React.ReactNode;
};

const BlockTitle: React.FC<BlockTitleProps> = ({ type = 'h3', className, children, ...props }) => {
    const Title = ['h3', 'h4', 'h5'].includes(type) ? type : 'h3';
    return (
        <Title {...props} className={clsx('block-title', className)}>
            {children}
        </Title>
    );
};

export default BlockTitle;
