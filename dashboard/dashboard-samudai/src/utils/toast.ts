import { notificationPush } from 'store/features/notifications/slice';
import { PushNoticationType } from 'store/features/notifications/state';
import store from 'store/store';

export const toast = (
    type: PushNoticationType['type'],
    time: number,
    title: string,
    description: string
) => {
    return () => {
        const data: PushNoticationType = {
            type,
            timeout: time || 500000,
            description: description || '',
            title: title,
        };

        store.dispatch(notificationPush(data));
    };
};
