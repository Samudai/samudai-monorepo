import { NotificationPartialData, NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import store from 'store/store';

const sendNotification: {
    (data: {
        to: string[];
        for: NotificationsEnums.NotificationFor;
        from: string;
        origin?: string;
        by: NotificationsEnums.NotificationCreatedby;
        metadata: NotificationPartialData['metaData'];
        type: string;
    }): void;
} = async (data: any) => {
    const notificationsSocket = store.getState().commonReducer.socket;

    const notificationData: NotificationPartialData = {
        to: {
            to: data.to,
            for: data.for,
        },
        from: {
            from: data.from,
            origin: data.origin || '',
            by: data.by,
        },
        metaData: {
            id: data.metadata.id || '',
            extra: data.metadata.extra || '',
            redirect_link: data.metadata.redirect_link || '',
        },
        timestamp: new Date().toISOString(),
    };

    notificationsSocket.emit(data.type, notificationData);
    console.log('in sendNotification', notificationData);
    //   store.dispatch({
    //     type: 'socket/emit',
    //     payload: {
    //       event: NotificationsEnums.SocketEventsToService.PAYMENT_CREATED_NOTIFICATION,
    //       data: notificationData,
    //     },
    //   });
};

export default sendNotification;
