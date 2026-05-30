import clsx from 'clsx';

export interface BlockHeaderProps {
    className?: string;
    children?: React.ReactNode;
}

const BlockHeader: React.FC<BlockHeaderProps> = ({ className, children }) => {
    return <header className={clsx('block-header', className)}>{children}</header>;
};

export default BlockHeader;
