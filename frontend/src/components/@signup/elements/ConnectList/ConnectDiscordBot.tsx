import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { selectSelectedDiscord } from 'store/features/Onboarding/slice';
import { useTypedSelector } from 'hooks/useStore';

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
    const discordSelected = useTypedSelector(selectSelectedDiscord);
    const [data, setData] = useState<string>('');
    useEffect(() => {
        setData(
            discordSelected?.isOnboarded
                ? 'Onboarded'
                : discordSelected?.dao_id
                ? 'Connected'
                : 'Connect'
        );
    }, [discordSelected]);

    useEffect(() => {
        function checkUserData() {
            const localData = localStorage.getItem('daoId');
            if (!!localData && localData === 'fetching data...') {
                setData(localData);
            } else if (!!localData && localData !== 'fetching data...') {
                setData('Connected');
            }
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
        };
    }, []);

    useEffect(() => {
        function checkUserData() {
            const localData = localStorage.getItem('daoId');
            if (!!localData && localData !== 'fetching data...') {
                setData('Connected');
            }
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
        };
    }, []);

    return (
        <li className={clsx('connect-list-item', className)}>
            <div className="connect-list-item__content">
                <div className="connect-list-item__icon_dis">
                    {typeof icon === 'string' ? <img src={icon} alt="icon" /> : icon}
                </div>
                <p className="connect-list-item__title">{discordSelected?.name}</p>
                <button
                    className="connect-list-item__btn"
                    onClick={data === 'Connect' ? onClick : () => {}}
                >
                    {content === 'Connected' ? 'Connected' : data}
                </button>
            </div>
        </li>
    );
};

export default ConnectListWallet;
