import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WebNotification } from '@samudai_xyz/gateway-consumer-types';
import { useLazyFetchNotificationsQuery } from 'store/services/Notifications/Notifications';
import { NotificationsItem, getNotificationsTabs } from 'components/@pages/notifications';
import Button from 'ui/@buttons/Button/Button';
import Head from 'ui/head';
import Tabs from 'ui/tabs/tabs';
import { getMemberId } from 'utils/utils';
import css from './new-notifications.module.scss';
import { MembersEnums, NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import { toast } from 'utils/toast';
import { useUpdateConnectionMutation } from 'store/services/userProfile/userProfile';
import { useReadNotificationsMutation } from 'store/services/Notifications/Notifications';
import sendNotification from 'utils/notification/sendNotification';

const tabs = getNotificationsTabs();

const NewNotifications = () => {
    const [tab, setTab] = useState('All');
    const [notifications, setNotifications] = useState<WebNotification[]>([]);
    const [updateConnection] = useUpdateConnectionMutation();
    const [acceptConnectionReq, setAcceptConnectionReq] = useState(true);
    const [getNotifications] = useLazyFetchNotificationsQuery();
    const [readNotification] = useReadNotificationsMutation();
    const navigate = useNavigate();
    const { daoid } = useParams();
    const memberId = getMemberId();

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

    const handleConnection = async (id: string, type: MembersEnums.InviteStatus) => {
        const payload = {
            connection: {
                sender_id: id,
                receiver_id: memberId,
                status: type,
            },
        };

        await updateConnection(payload)
            .unwrap()
            .then(() => {
                toast('Success', 5000, `Request ${type}`, '')();
                setAcceptConnectionReq(false);
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

    return (
        <div className={css.root} data-analytics-page="new_notifications_page">
            <Head
                classNameRoot={css.head}
                breadcrumbs={[{ name: 'Notifications' }, { name: tab }]}
                children={
                    <Tabs
                        className={css.tabs}
                        activeTab={tab}
                        tabs={tabs}
                        onChange={(tab) => setTab(tab.name)}
                    />
                }
            />

            <div className={css.content} data-analytics-parent="new_notifications_parent">
                <div className="container">
                    {!currNotifications.length && (
                        <div className={css.empty}>
                            <img className={css.empty_img} src="/img/notif.svg" alt="notif" />

                            <p className={css.empty_text}>
                                You have no notifications. Let’s create a project.
                            </p>

                            <Button
                                className={css.empty_createBtn}
                                color="orange-outlined"
                                data-analytics-click="create_project_from_notifications_button"
                                onClick={() => navigate(`/${daoid}/projects`)}
                            >
                                <span>Create a Project</span>
                            </Button>
                        </div>
                    )}

                    {tab === tabs[2].name && !!currNotifications.length && (
                        <div>
                            {currNotifications.map((notification: any) => (
                                <div key={notification.notificationId} className={css.item}>
                                    <NotificationsItem
                                        type="not-10"
                                        date={new Date(notification.timestamp).toISOString()}
                                        tags={notification.notificationContent.tags}
                                        user={notification.notificationContent.metaData?.member}
                                        title={notification.notificationContent.notificationBody}
                                        onAccept={() => {
                                            readNoti(memberId, notification.notificationId);
                                            handleConnection(
                                                notification.notificationContent.metaData?.member
                                                    .member_id,
                                                MembersEnums.InviteStatus.ACCEPTED
                                            );
                                        }}
                                        onReject={() => {
                                            readNoti(memberId, notification.notificationId);
                                            handleConnection(
                                                notification.notificationContent.metaData?.member
                                                    .member_id,
                                                MembersEnums.InviteStatus.REJECTED
                                            );
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {tab != tabs[2].name &&
                        !!currNotifications.length &&
                        !!unreadNotifications.length && (
                            <div>
                                <div className={css.subhead}>
                                    <span className={css.empty_text}>UNREAD</span>
                                </div>
                                {unreadNotifications.map((notification: any) => (
                                    <div key={notification.notificationId} className={css.item}>
                                        <NotificationsItem
                                            type="not-1"
                                            date={new Date(notification.timestamp).toISOString()}
                                            id={notification.notificationId}
                                            text={notification.notificationContent.notificationBody}
                                            tags={notification.notificationContent.tags}
                                            user={notification.notificationContent.metaData?.member}
                                            onView={() => {
                                                readNoti(memberId, notification.notificationId);
                                                if (
                                                    notification.notificationContent.metaData
                                                        ?.redirect_link
                                                ) {
                                                    navigate(
                                                        notification.notificationContent.metaData
                                                            ?.redirect_link
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                    {tab != tabs[2].name &&
                        !!currNotifications.length &&
                        !!readNotifications.length && (
                            <div>
                                <div className={css.subhead}>
                                    <span className={css.empty_text}>READ</span>
                                </div>
                                {readNotifications.map((notification: any) => (
                                    <div key={notification.notificationId} className={css.item}>
                                        <NotificationsItem
                                            type="not-1"
                                            date={new Date(notification.timestamp).toISOString()}
                                            id={notification.notificationId}
                                            text={notification.notificationContent.notificationBody}
                                            tags={notification.notificationContent.tags}
                                            user={notification.notificationContent.metaData?.member}
                                            onView={
                                                notification.notificationContent.metaData
                                                    ?.redirect_link
                                                    ? () =>
                                                          navigate(
                                                              notification.notificationContent
                                                                  .metaData?.redirect_link
                                                          )
                                                    : undefined
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                    {/* {!!currNotifications.length && (
                        <>
                            <div className={css.item}>
                                <NotificationsItem
                                    type="not-1"
                                    date="2023-05-23T18:23:26.201Z"
                                    rating='B'
                                    id='alenawilliams01'
                                    text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...'
                                    user={{
                                        location: 'San Francisco, California',
                                        name: 'uname',
                                        profile_picture: '/img/icons/user-2.png'
                                    }}
                                    tags={['Task', 'Project']}
                                />
                            </div>

                            <div className={css.item}>
                                <NotificationsItem
                                    type="not-2"
                                    date="2023-05-23T18:23:26.201Z"
                                    user={{
                                        name: 'uname',
                                        profile_picture: '/img/icons/user-2.png'
                                    }}
                                    text='Incoming Connection Request'
                                    onCancel={() => {}}
                                    onConfirm={() => {}}
                                    tags={['Task', 'Project']}
                                />
                            </div>

                            <div className={css.item}>
                                <NotificationsItem
                                    type="not-3"
                                    date="2023-05-23T18:23:26.201Z"
                                    title="Meeting with customer"
                                    category='Task'
                                    members={[
                                        { name: '1', profile_picture: '/img/icons/user-1.png' },
                                        { name: '2', profile_picture: '/img/icons/user-2.png' },
                                        { name: '3', profile_picture: '/img/icons/user-3.png' },
                                    ]}
                                    oldStatus="Design"
                                    status='In - Review'
                                    projectName='Sleep app'
                                    onView={() => {}}
                                    tags={['Task', 'Project']}
                                />
                            </div>

                            <div className={css.item}>
                                <NotificationsItem
                                    type="not-2"
                                    date="2023-05-23T18:23:26.201Z"
                                    user={{
                                        name: 'uname',
                                        profile_picture: '/img/icons/user-2.png'
                                    }}
                                    text='Viewed your profile'
                                    onCancel={() => {}}
                                    tags={['Task', 'Project']}
                                />
                            </div>

                            <div className={css.item}>
                                <NotificationsItem
                                    type="not-6"
                                    date="2023-05-23T18:23:26.201Z"
                                    location='Zoom meeting'
                                    startDate='2023-05-26T18:23:26.201Z'
                                    title='Google job interview'
                                    onView={() => {}}
                                    tags={['Task', 'Project']}
                                />
                            </div>

                            <div className={css.item}>
                                <NotificationsItem
                                    type="not-7"
                                    date="2023-05-23T18:23:26.201Z"
                                    title='Google job interview'
                                    status='Active'
                                    votesAgain={55}
                                    votesFor={75}
                                    tags={['Task', 'Project']}
                                />
                            </div>
                        </>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default NewNotifications;
