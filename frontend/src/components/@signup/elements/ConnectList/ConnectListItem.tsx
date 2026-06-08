import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { selectSelectedDiscord } from 'store/features/Onboarding/slice';
import { selectGcal, selectSnapshot } from 'store/features/common/slice';
import { useTypedSelector } from 'hooks/useStore';

interface ConnectListItemProps {
    className?: string;
    icon: string | JSX.Element;
    title: string;
    onClick: () => void;
    disabled?: boolean;
    content?: string;
}

const ConnectListItem: React.FC<ConnectListItemProps> = ({
    icon,
    title,
    className,
    onClick,
    disabled,
    content,
}) => {
    const gcal = useTypedSelector(selectGcal);
    const snapshot = useTypedSelector(selectSnapshot);
    const [apps, setApps] = useState<any>({});
    const lcaseTitle = title.toLowerCase();
    const selectedDiscordInfo = useTypedSelector(selectSelectedDiscord);
    useEffect(() => {
        const val: any = sessionStorage.getItem('apps');
        const vals = !!val && JSON.parse(val);

        if (!!vals && vals.length > 0) {
            const obj: any = {};
            vals?.forEach((i: any) => {
                const a = Object.keys(i).map((key) => {
                    return key;
                });
                const valu = i[a[0]];
                obj[a[0]] = valu;
            });
            setApps(obj);
        }
    }, [selectedDiscordInfo.id]);

    useEffect(() => {
        if (title.toLowerCase() === 'google calendar' && gcal) {
            setConnected(true);
        } else if (title.toLowerCase() === 'snapshot' && snapshot) {
            setConnected(true);
        }
    }, [gcal, snapshot]);

    useEffect(() => {
        if (title.toLowerCase() === 'google calendar' && apps?.['google calendar']) {
            setConnected(true);
        }
    }, [selectedDiscordInfo.id]);

    useEffect(() => {
        if (title.toLowerCase() === 'google calendar' && apps?.['google calendar']) {
            setConnected(true);
        }
    }, []);

    useEffect(() => {
        function checkUserData() {
            const connectedApp = title.toLowerCase();
            const localData = localStorage.getItem(connectedApp);
            if (localData) {
                setConnected(localData === 'true');
            }
        }
        window.addEventListener('storage', checkUserData);
        return () => {
            window.removeEventListener('storage', checkUserData);
        };
    }, [selectedDiscordInfo.id]);

    const [connected, setConnected] = useState(false);

    return (
        <li className={clsx('connect-list-item', className)}>
            {!apps?.[lcaseTitle] || title.toLowerCase() === 'ethereum' ? (
                <div className="connect-list-item__content">
                    <div
                        className={
                            title.toLowerCase() !== 'snapshot'
                                ? 'connect-list-item__icon'
                                : 'connect-list-item__icon1'
                        }
                    >
                        {typeof icon === 'string' ? <img src={icon} alt="icon" /> : icon}
                    </div>
                    <p className="connect-list-item__title">{title}</p>
                    {!connected
                        ? !disabled &&
                          !content && (
                              <button className="connect-list-item__btn" onClick={onClick}>
                                  Connect
                              </button>
                          )
                        : (connected || !disabled) && (
                              <span
                                  className="connect-list-item__btn"
                                  style={{ color: '#fdc087', cursor: 'default' }}
                              >
                                  {content ? content : 'Connected'}
                              </span>
                          )}
                </div>
            ) : (
                <div className="connect-list-item__content">
                    <div className="connect-list-item__icon">
                        {typeof icon === 'string' ? <img src={icon} alt="icon" /> : icon}
                    </div>
                    <p className="connect-list-item__title">{title}</p>

                    <span
                        className="connect-list-item__btn"
                        style={{ color: '#fdc087', cursor: 'default' }}
                    >
                        Connected
                    </span>
                </div>
            )}
        </li>
    );
};

export default ConnectListItem;
