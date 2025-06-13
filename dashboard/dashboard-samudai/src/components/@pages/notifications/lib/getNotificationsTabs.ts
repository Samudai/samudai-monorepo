import { NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';

export const getNotificationsTabs = () => [
    { name: 'All', value: NotificationsEnums.NewNotificationScope.ALL },
    { name: 'Mentions', value: NotificationsEnums.NewNotificationScope.MENTIONS },
    {
        name: 'Connection Requests',
        value: NotificationsEnums.NewNotificationScope.CONNECTION_REQUESTS,
    },
];
