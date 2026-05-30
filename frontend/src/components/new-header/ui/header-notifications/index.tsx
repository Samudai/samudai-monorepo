import { NotificationsModal } from 'components/@pages/notifications';
import { useClickOutside } from 'hooks/useClickOutside';
import React, { useState } from 'react';
import NotificationIcon from 'ui/SVG/Notification';
import css from './header-notifications.module.scss';
import clsx from 'clsx';
import { useTypedSelector } from 'hooks/useStore';
import { selectNewNotification } from 'store/features/notifications/slice';

interface HeaderNotificationsProps {
    activeDao: string;
}

export const HeaderNotifications: React.FC<HeaderNotificationsProps> = ({ activeDao }) => {
    const [active, setActive] = useState(false);
    const ref = useClickOutside<HTMLDivElement>(() => setActive(false));
    const newNotificationStatus = useTypedSelector(selectNewNotification);

    return (
        <div className={css.ntf} ref={ref}>
            <button
                // to={`/${activeDao}/notifications`}
                className={clsx(css.ntf_btn, newNotificationStatus && css.ntf_btn_active)}
                onClick={setActive.bind(null, !active)}
            >
                <NotificationIcon />
            </button>
            {active && (
                <NotificationsModal
                    openLink={`/${activeDao}/notifications`}
                    onClose={setActive.bind(null, false)}
                />
            )}
        </div>
    );
};
