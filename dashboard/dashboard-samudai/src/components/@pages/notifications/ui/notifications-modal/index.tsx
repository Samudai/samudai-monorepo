import Sprite from 'components/sprite';
import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Tabs from 'ui/tabs/tabs';
import { getNotificationsTabs } from '../../lib';
import { NotificationsItemMini } from '../notifications-item-mini';
import css from './notifications-modal.module.scss';
import { useLazyFetchNotificationsQuery } from 'store/services/Notifications/Notifications';
import { WebNotification } from '@samudai_xyz/gateway-consumer-types';
import { getMemberId } from 'utils/utils';
import { NewNotificationScope } from '@samudai_xyz/gateway-consumer-types/dist/types/notifications/enums';
import {
    useLazyGetConnectionsByReceiverIdQuery,
    useUpdateConnectionMutation,
} from 'store/services/userProfile/userProfile';
import { useReadNotificationsMutation } from 'store/services/Notifications/Notifications';
import { MembersEnums, NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import { toast } from 'utils/toast';
import sendNotification from 'utils/notification/sendNotification';
import { updateNewNotification } from 'store/features/notifications/slice';
import { useTypedDispatch } from 'hooks/useStore';

const tabs = getNotificationsTabs();

interface NotificationsModalProps {
    openLink: string;
    onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ openLink, onClose }) => {
    const [tab, setTab] = useState(tabs[0].name);
    const [notifications, setNotifications] = useState<WebNotification[]>([]);
    const memberId = getMemberId();
    const navigate = useNavigate();
    const [getNotifications] = useLazyFetchNotificationsQuery();
    const [updateConnection] = useUpdateConnectionMutation();
    const [readNotification] = useReadNotificationsMutation();
    const [acceptConnectionReq, setAcceptConnectionReq] = useState(true);
    const [isTabLists, setIsTabLists] = useState(false);
    const dispatch = useTypedDispatch();

    const [getRequests] = useLazyGetConnectionsByReceiverIdQuery();
    const [connectionRequests, setConnectionRequests] = useState([]);

    const [currNotifications, readNotifications, unreadNotifications] = useMemo(() => {
        const currIndex = tabs.find((item) => item.name === tab)?.value;
        const sortedList = [...notifications].sort((a, b) => b.timestamp - a.timestamp);
        const allnotification = sortedList.filter(
            (notification) => notification.scope === currIndex
        );

        const unreadNotifications: any = [];
        const readNotifications: any = [];

        allnotification.map((notification) => {
            if (notification.read === true) {
                readNotifications.push(notification);
            } else {
                unreadNotifications.push(notification);
            }
        });

        return [allnotification, readNotifications, unreadNotifications];
    }, [notifications, tab]);

    useEffect(() => {
        getNotifications(memberId)
            .unwrap()
            .then((res) => {
                setNotifications(res.data || []);
            });
    }, []);

    const tabsList = useMemo(() => {
        const items: {
            name: string;
            value: NewNotificationScope;
            count?: number;
        }[] = [...tabs.map((tab) => ({ ...tab, count: 0 }))];

        return items.map((item) => {
            if (item.value != 2) {
                for (const not of notifications) {
                    item.count =
                        (item.count || 0) +
                        (not.scope === item.value && not.read === false ? 1 : 0);
                }
            } else {
                for (const not of notifications) {
                    const connectionRequest = connectionRequests.find(
                        (x: any) =>
                            x.member_id === not.notificationContent.metaData?.member?.member_id
                    );
                    item.count =
                        (item.count || 0) + (not.scope === item.value && connectionRequest ? 1 : 0);
                }
            }
            return item;
        });
    }, [connectionRequests, notifications, tabs]);

    useEffect(() => {
        getRequests(memberId)
            .unwrap()
            .then((res: any) => {
                setConnectionRequests(res.data.connections || []);
            });
    }, [memberId]);

    useEffect(() => {
        if (tabsList[0].count! + tabsList[1].count! + tabsList[2].count! > 0) {
            setIsTabLists(true);
        }

        if (isTabLists && tabsList[0].count! + tabsList[1].count! + tabsList[2].count! === 0) {
            dispatch(updateNewNotification(false));
        }
    }, [tabsList]);

    const handleConnection = async (id: string, type: MembersEnums.InviteStatus) => {
        const payload = {
            connection: {
                sender_id: id,
                receiver_id: getMemberId(),
                status: type,
            },
        };

        await updateConnection(payload)
            .unwrap()
            .then(() => {
                toast('Success', 5000, `Request ${type}`, '')();
                setAcceptConnectionReq(false);
                tabsList[2].count!--;
                if (type === MembersEnums.InviteStatus.ACCEPTED) {
                    sendNotification({
                        to: [id],
                        for: NotificationsEnums.NotificationFor.MEMBER,
                        from: memberId,
                        origin: '',
                        by: NotificationsEnums.NotificationCreatedby.MEMBER,
                        metadata: {
                            id: '',
                            redirect_link: `/${memberId}/profile`,
                        },
                        type: NotificationsEnums.SocketEventsToServiceContributorProfile
                            .CONNECTION_ACCEPTED_REQUEST,
                    });
                }
            })
            .catch((err) => {
                toast('Failure', 5000, `Failed to ${type.slice(0, -2)} request`, '')();
            });
    };

    const readNoti = async (memberId: string, notificationId: string) => {
        await readNotification({ memberId, notificationId });
        setNotifications((prevNotification) =>
            prevNotification.map((notification) =>
                notification.notificationId === notificationId
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    return (
        <div className={css.root}>
            <div className={css.head}>
                <h3 className={css.head_title}>Notifications</h3>

                <div className={css.head_controls}>
                    <NavLink to={openLink} className={css.head_btn} onClick={onClose}>
                        <Sprite url="/img/sprite.svg#maximize" />
                    </NavLink>

                    <button className={css.head_btn} onClick={onClose}>
                        <Sprite url="/img/sprite.svg#cross-box" />
                    </button>
                </div>
            </div>

            <div className={css.row}>
                <Tabs
                    className={css.tabs}
                    activeTab={tab}
                    tabs={tabsList}
                    onChange={(tab) => setTab(tab.name)}
                />

                {/* <button className={css.settingsBtn}>
                    <Sprite url="/img/sprite.svg#gear" />
                </button> */}
            </div>

            {tab != tabs[2].name && (
                <ul className={css.list}>
                    {unreadNotifications.length > 0 && (
                        <span className={css.subhead_text}>UNREAD</span>
                    )}
                    {[...unreadNotifications].map((notification, index) => (
                        <li
                            className={css.list_item}
                            key={index}
                            onClick={() => {
                                readNoti(memberId, notification.notificationId);
                                !!notification.notificationContent.metaData?.redirect_link &&
                                    navigate(
                                        notification.notificationContent.metaData?.redirect_link
                                    );
                            }}
                        >
                            <NotificationsItemMini
                                type="not-9"
                                date={new Date(notification.timestamp).toISOString()}
                                title={notification.notificationContent.notificationBody}
                                user={notification.notificationContent.metaData?.member}
                                tags={notification.notificationContent.tags}
                            />
                        </li>
                    ))}
                    {readNotifications.length > 0 && <span className={css.subhead_text}>READ</span>}
                    {[...readNotifications].map((notification, index) => (
                        <li
                            className={css.list_item}
                            key={index}
                            onClick={() =>
                                !!notification.notificationContent.metaData?.redirect_link &&
                                navigate(notification.notificationContent.metaData?.redirect_link)
                            }
                        >
                            <NotificationsItemMini
                                type="not-9"
                                date={new Date(notification.timestamp).toISOString()}
                                title={notification.notificationContent.notificationBody}
                                user={notification.notificationContent.metaData?.member}
                                tags={notification.notificationContent.tags}
                            />
                        </li>
                    ))}
                </ul>
            )}
            {tab === tabs[2].name && (
                <ul className={css.list}>
                    {[...currNotifications].map((notification, index) => {
                        const connectionRequest = connectionRequests.find(
                            (x: any) =>
                                x.member_id ===
                                notification.notificationContent.metaData?.member?.member_id
                        );

                        return (
                            acceptConnectionReq &&
                            connectionRequest && (
                                <li
                                    className={css.list_item}
                                    key={index}
                                    onClick={() =>
                                        !!notification.notificationContent.metaData?.member &&
                                        navigate(
                                            `/${notification.notificationContent.metaData?.member?.member_id}/profile`
                                        )
                                    }
                                >
                                    <NotificationsItemMini
                                        type="not-10"
                                        date={new Date(notification.timestamp).toISOString()}
                                        title={notification.notificationContent.notificationBody}
                                        user={notification.notificationContent.metaData?.member}
                                        tags={notification.notificationContent.tags}
                                        onAccept={(event: any) => {
                                            event.stopPropagation();
                                            readNoti(memberId, notification.notificationId);
                                            handleConnection(
                                                notification.notificationContent.metaData?.member
                                                    ?.member_id,
                                                MembersEnums.InviteStatus.ACCEPTED
                                            );
                                        }}
                                        onReject={(event: any) => {
                                            event.stopPropagation();
                                            readNoti(memberId, notification.notificationId);
                                            handleConnection(
                                                notification.notificationContent.metaData?.member
                                                    ?.member_id,
                                                MembersEnums.InviteStatus.REJECTED
                                            );
                                        }}
                                    />
                                </li>
                            )
                        );
                    })}
                </ul>
            )}
        </div>
    );
};
