import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { notificationResponse } from './model';

export const notificationsApi = createApi({
    reducerPath: 'notificationsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_NOTIFICATIONS_URL,
    }),
    endpoints: (builder) => ({
        fetchNotifications: builder.query<notificationResponse, string>({
            query: (memberId) => `/notification/get/${memberId}`,
        }),
        readNotifications: builder.mutation<
            notificationResponse,
            { memberId: string; notificationId: string }
        >({
            query: ({ memberId, notificationId }) => ({
                url: `/notification/readnotification/${memberId}/${notificationId}`,
                method: 'POST',
            }),
        }),
    }),
});

export const { useLazyFetchNotificationsQuery, useReadNotificationsMutation } = notificationsApi;
