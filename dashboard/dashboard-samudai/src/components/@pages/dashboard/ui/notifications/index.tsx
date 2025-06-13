import { useEffect, useState } from 'react';
import axios from 'axios';
import useRequest from 'hooks/useRequest';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import {
    NotificationsRequestSkeleton,
    NotificationsTransaction,
    NotificationsTransactionSkeleton,
} from './components';
import styles from './components/notifications-request-skeleton/notifications-request-skeleton.module.scss';
import './notifications.scss';

export const NotificationsCenter: React.FC = (props = {}) => {
    const [requests, setRequests] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);

    const [fetchRequests, loadingRequests] = useRequest(async () => {
        const { data } = await axios.get('/mockup/requests.json');
        setRequests(data);
    });
    const [fetchTransactions, loadingTransactions] = useRequest(async () => {
        const { data } = await axios.get('/mockup/transactions.json');
        setTransactions(data);
    });

    useEffect(() => {
        fetchTransactions();
        fetchRequests();
    }, []);

    return (
        <Block
            {...props}
            className="notifications"
            data-analytics-parent="notifications_widget_parent"
        >
            <Block.Header>
                <Block.Title>Notification Center</Block.Title>
            </Block.Header>
            <Block.Scrollable className="notifications__content">
                <div className="notifications__col notifications__col_requests">
                    <h3 className="notifications__title">
                        {loadingRequests ? (
                            <Skeleton.Title className={styles.title} />
                        ) : (
                            'Incoming requests'
                        )}
                    </h3>
                    <Skeleton
                        className="notifications__list"
                        component="ul"
                        loading={loadingRequests}
                        skeleton={<NotificationsRequestSkeleton />}
                    >
                        {/* {requests.map(NotificationsRequest)} */}
                    </Skeleton>
                </div>
                <div className="notifications__col notifications__col_payments">
                    <h3 className="notifications__title">
                        {loadingTransactions ? (
                            <Skeleton.Title className={styles.title} />
                        ) : (
                            'Payments pending receipt'
                        )}
                    </h3>
                    <Skeleton
                        className="notifications__list"
                        component="ul"
                        loading={loadingTransactions}
                        skeleton={<NotificationsTransactionSkeleton />}
                    >
                        {transactions.map(NotificationsTransaction)}
                    </Skeleton>
                </div>
            </Block.Scrollable>
        </Block>
    );
};
