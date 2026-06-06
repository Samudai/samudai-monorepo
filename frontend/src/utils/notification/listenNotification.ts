import { NotificationsEnums, WebNotification } from '@samudai_xyz/gateway-consumer-types';
import { setNotificationSocket } from 'store/features/common/slice';
import store from 'store/store';
import { toast } from 'utils/toast';
import { EVENTS } from '@pushprotocol/socket';
import { setReloadChats } from 'store/features/messages/slice';
import { updateNewMessage, updateNewNotification } from 'store/features/notifications/slice';

const listenNotification = () => {
    const socket = store.getState().commonReducer.socket;
    const provider = store.getState().commonReducer.provider;

    if (socket) {
        socket.on(
            NotificationsEnums.NewSocketEventsFromService.ALL,
            (notification: WebNotification) => {
                store.dispatch(updateNewNotification(true));
                if (notification?.notificationContent.popup) {
                    toast(
                        'Attention',
                        5000,
                        notification.notificationContent.notificationBody,
                        ''
                    )();
                }
            }
        );

        socket.on(
            NotificationsEnums.NewSocketEventsFromService.MENTIONS,
            (notification: WebNotification) => {
                store.dispatch(updateNewNotification(true));
                if (notification?.notificationContent.tags.includes('Chat')) {
                    store.dispatch(updateNewMessage(true));
                }
                if (notification?.notificationContent.popup) {
                    toast(
                        'Attention',
                        5000,
                        notification.notificationContent.notificationBody,
                        ''
                    )();
                }
            }
        );

        socket.on(
            NotificationsEnums.NewSocketEventsFromService.CONNECTION_REQUESTS,
            (notification: WebNotification) => {
                store.dispatch(updateNewNotification(true));
                if (notification?.notificationContent.popup) {
                    toast(
                        'Attention',
                        5000,
                        notification.notificationContent.notificationBody,
                        ''
                    )();
                }
            }
        );

        socket.on(
            NotificationsEnums.NewSocketEventsFromService.MEMBER_CONNECTED,
            (notification: WebNotification) => {
                store.dispatch(setNotificationSocket({ socket }));
            }
        );
    }
};

export const listenPushNotification = () => {
    const pushSDKSocket = store.getState().commonReducer.pushSDKSocket;

    if (pushSDKSocket) {
        pushSDKSocket.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message: any) => {
            if (message?.messageOrigin !== 'self') {
                store.dispatch(setReloadChats(true));
                // toast(
                //   'Success',
                //   5000,
                //   'New message received', ''
                // )();
            }
        });
    }
};

export default listenNotification;
