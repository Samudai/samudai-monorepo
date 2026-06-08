import clsx from 'clsx';

interface ConnectListItemProps {
    className?: string;

    onClick?: () => void;
    disabled?: boolean;
    content?: string;
    children: React.ReactNode;
}

const ConnectListWallet: React.FC<ConnectListItemProps> = ({
    className,
    onClick,
    disabled,
    content,
    children,
}) => {
    return (
        <li className={clsx('connect-list-item', className)}>
            <div className="connect-list-item__content">{children}</div>
        </li>
    );
};

export default ConnectListWallet;
