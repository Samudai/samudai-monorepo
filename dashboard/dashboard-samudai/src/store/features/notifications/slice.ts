import { RootState } from 'store/store';
import { createSlice } from '@reduxjs/toolkit';
import { notificationReducers } from './reducers';
import { notificationsState } from './state';

export const notificationSlice = createSlice({
    name: 'notifications',
    reducers: notificationReducers,
    initialState: notificationsState,
});

export const selectNotifications = (state: RootState) => state.notifications.data;
export const selectNewNotification = (state: RootState) => state.notifications.newNotification;
export const selectNewMessage = (state: RootState) => state.notifications.newMessage;

export const {
    notificationPush,
    notificationRemove,
    notificationRemoveAll,
    updateNewMessage,
    updateNewNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
