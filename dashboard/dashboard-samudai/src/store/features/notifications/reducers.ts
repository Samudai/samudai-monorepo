import { PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { NotificationType, NotificationsSlice, PushNoticationType } from './state';

export const notificationReducers = {
    notificationPush: (state: NotificationsSlice, action: PayloadAction<PushNoticationType>) => {
        const notification: NotificationType = {
            ...action.payload,
            id: uuid(),
        };

        state.data = [...state.data, notification];
    },
    notificationRemove: (state: NotificationsSlice, action: PayloadAction<string>) => {
        state.data = state.data.filter((not) => not.id !== action.payload);
    },
    notificationRemoveAll: (state: NotificationsSlice) => {
        state.data = [];
    },
    updateNewNotification: (state: NotificationsSlice, { payload }: PayloadAction<boolean>) => {
        state.newNotification = payload;
    },
    updateNewMessage: (state: NotificationsSlice, { payload }: PayloadAction<boolean>) => {
        state.newMessage = payload;
    },
};
