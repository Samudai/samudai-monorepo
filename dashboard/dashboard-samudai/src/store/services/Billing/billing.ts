import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store/store';
import {
    getUsedLimitCountResponse,
    subscriptionResponse,
    firstTimeCheckoutRequest,
    cancellationFeedbackRequest,
    getMembersForDaoResponse,
    bulkLicenseUpdateRequest,
} from './model';

require('dotenv').config();

export const billingApi = createApi({
    reducerPath: 'billingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers) => {
            headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            headers.set('daoId', store.getState().commonReducer.activeDao);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getManageSubscription: builder.query<subscriptionResponse, string>({
            query: (id) => `/api/stripe/managesubscription/${id}`,
        }),
        getUsedLimitCount: builder.query<getUsedLimitCountResponse, string>({
            query: (id) => `/api/stripe/usedlimits/${id}`,
        }),
        getFirstTimeCheckout: builder.mutation<subscriptionResponse, firstTimeCheckoutRequest>({
            query: (body) => ({
                url: `/api/stripe/firsttime/checkout`,
                method: 'POST',
                body,
            }),
        }),
        submitCancellationFeedback: builder.mutation<any, cancellationFeedbackRequest>({
            query: (body) => ({
                url: `/api/feedback/cancellation`,
                method: 'POST',
                body,
            }),
        }),
        getMembersForDao: builder.query<getMembersForDaoResponse, string>({
            query: (id) => `/api/dao/member/getfordao/${id}`,
        }),
        bulkLicenseUpdate: builder.mutation<any, bulkLicenseUpdateRequest>({
            query: (body) => ({
                url: `/api/dao/member/update/licensebulk`,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useLazyGetManageSubscriptionQuery,
    useGetUsedLimitCountQuery,
    useLazyGetUsedLimitCountQuery,
    useGetFirstTimeCheckoutMutation,
    useSubmitCancellationFeedbackMutation,
    useGetMembersForDaoQuery,
    useBulkLicenseUpdateMutation,
} = billingApi;
