export interface NotificationType {
    id: string;
    type: 'Success' | 'Attention' | 'Failure';
    title: string;
    description: string;
    timeout: number;
}

export type PushNoticationType = Omit<NotificationType, 'id'>;

export type NotificationsSlice = {
    data: NotificationType[];
    newNotification: boolean;
    newMessage: boolean;
};

export const notificationsState: NotificationsSlice = {
    data: [],
    newNotification: false,
    newMessage: false,
};
