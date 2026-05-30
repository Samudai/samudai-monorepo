import clsx from 'clsx';

interface ConnectListItemProps {
    className?: string;
    icon: string | JSX.Element;
    title: string;
    onClick: () => void;
    disabled?: boolean;
    content?: string;
}

const ConnectListWallet: React.FC<ConnectListItemProps> = ({
    icon,
    title,
    className,
    onClick,
    disabled,
    content,
}) => {
    return (
        <li className={clsx('connect-list-item', className)}>
            <div className="connect-list-item__content">
                <div className="connect-list-item__icon2">
                    {typeof icon === 'string' ? <img src={icon} alt="icon" /> : icon}
                </div>
                <p className="connect-list-item__title">{title}</p>
                <button className="connect-list-item__btn" onClick={onClick}>
                    Connect
                </button>
            </div>
        </li>
    );
};

export default ConnectListWallet;
