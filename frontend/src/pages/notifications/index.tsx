import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { WebNotification } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { changePaymentsData, changeReviewsData } from 'store/features/common/slice';
import { useLazyFetchNotificationsQuery } from 'store/services/Notifications/Notifications';
import { useTypedDispatch } from 'hooks/useStore';
import useTabs from 'hooks/useTabs';
import { NfInfo, NfList } from 'components/notifications/elements';
import TabNavigation from 'ui/TabNavigation/TabNavigation';
import Head from 'ui/head';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from './notifications.module.scss';

const Tabs = {
    General: 'general',
    Payments: '',
    // Messages: 'messages',
};

const Notifications = () => {
    const { activeTab, navigate } = useTabs(Tabs);
    const dispatch = useTypedDispatch();

    const [getNotifications] = useLazyFetchNotificationsQuery();
    const [paymentData, setPaymentData] = useState<WebNotification[]>([] as WebNotification[]);
    const [reviewsData, setReviewsData] = useState<WebNotification[]>([] as WebNotification[]);
    useEffect(() => {
        const fun = async () => {
            try {
                const res = await getNotifications(getMemberId()).unwrap();
                setPaymentData([...(res?.data || [])]?.reverse() || ([] as WebNotification[]));
                setReviewsData([...(res?.data || [])]?.reverse() || ([] as WebNotification[]));
                dispatch(changeReviewsData({ reviewsData: reviewsData }));
                dispatch(changePaymentsData({ paymentsData: paymentData }));
                console.log('res', res);
                console.log('payment:', paymentData);
                console.log('reviews:', reviewsData);
            } catch (err) {
                toast('Failure', 5000, 'Unable to fetch notifications', 'Please retry')();
            }
        };
        fun();
    }, []);

    return (
        <div className={styles.root} data-analytics-page={`notifications_${activeTab}`}>
            <Head
                breadcrumbs={[
                    { name: 'Notification Center' },
                    {
                        name: activeTab
                            ? activeTab[0].toUpperCase() + activeTab.slice(1)
                            : 'Payments',
                    },
                ]}
            >
                <div className={styles.head}>
                    <TabNavigation className={styles.navigation}>
                        {Object.values(Tabs).map((tab) => (
                            <TabNavigation.Button
                                className={styles.navigationTab}
                                key={tab}
                                active={tab === activeTab}
                                onClick={() => navigate(tab)}
                                data-analytics-click={`navigate_to_notifications_tab_${tab}`}
                            >
                                <span>{tab || 'payments'}</span>
                            </TabNavigation.Button>
                        ))}
                    </TabNavigation>
                    <div className={styles.info}>
                        <NfInfo />
                    </div>
                </div>
            </Head>
            <div className={clsx(styles.container, 'container')}>
                {paymentData.length > 0 && activeTab !== 'general' && (
                    <NfList className={styles.body}>
                        <Outlet />
                    </NfList>
                )}
                {
                    // reviewsData.length > 0 &&
                    activeTab === 'general' && (
                        <NfList className={styles.body}>
                            <Outlet />
                        </NfList>
                    )
                }
            </div>
        </div>
    );
};

export default Notifications;
