import { getDefaultProviderRequest } from '../Dashboard/model';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store/store';
import {
    IChainListResponse,
    addPaymentsRequest,
    addPaymentsResponse,
    addProviderRequest,
    addProviderResponse,
    getParcelSafesRequest,
    getParcelSafesResponse,
    getPaymentBYDaoResponse,
    getPendingPaymentBYDaoResponse,
    parcelBalanceRequest,
    parcelBalanceResponse,
    providerResponse,
    updatePaymentStatusRequest,
    updatePaymentStatusResponse,
    updateProviderRequest,
} from './model';

require('dotenv').config();

export const paymentsApi = createApi({
    reducerPath: 'paymentsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers) => {
            headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            headers.set('daoId', store.getState().commonReducer.activeDao);
            return headers;
        },
    }),
    tagTypes: ['Payments', 'Provider', 'Create', 'Balance', 'Update'],
    endpoints: (builder) => ({
        getProvider: builder.query<providerResponse, string>({
            query: (id) => `/api/provider/get/dao/${id}`,
            // providesTags: ['Provider'],
        }),
        getChainList: builder.query<IChainListResponse, void>({
            query: () => `/api/chain/list`,
        }),
        getPaymentByDao: builder.query<getPaymentBYDaoResponse, string>({
            query: (id) => `/api/payment/get/dao/${id}`,
            // providesTags: ['Payments'],
        }),
        getAwaitingPaymentByDao: builder.query<getPendingPaymentBYDaoResponse, string>({
            query: (id) => `/api/payment/get/uninitiatedfordao/${id}`,
            // providesTags: ['Payments'],
        }),
        getDefaultProvider: builder.query<getDefaultProviderRequest, string>({
            query: (dao_id) => `/api/provider/get/default/${dao_id}`,
            // providesTags: ['Provider'],
        }),
        addProvider: builder.mutation<addProviderResponse, addProviderRequest>({
            query: (body) => ({
                url: `/api/provider/create`,
                method: 'POST',
                body,
            }),
            // invalidatesTags: ['Provider'],
        }),
        changeDefault: builder.mutation<any, { daoId: string; providerId: string }>({
            query: (body) => ({
                url: `/api/provider/update/default`,
                method: 'POST',
                body,
            }),
            // invalidatesTags: ['Provider'],
        }),
        getParcelSafes: builder.mutation<getParcelSafesResponse, getParcelSafesRequest>({
            query: (body) => ({
                url: `/api/parcel/get/safes`,
                method: 'POST',
                body,
            }),
        }),
        deleteProvider: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/provider/delete/${id}`,
                method: 'DELETE',
            }),
            // invalidatesTags: ['Provider'],
        }),
        updateProvider: builder.mutation<any, updateProviderRequest>({
            query: (body) => ({
                url: `/api/provider/update`,
                method: 'POST',
                body,
            }),
            // invalidatesTags: ['Provider'],
        }),
        addPayments: builder.mutation<addPaymentsResponse, addPaymentsRequest>({
            query: (body) => ({
                url: `/api/payment/add`,
                method: 'POST',
                body,
            }),
            // invalidatesTags: ['Payments'],
        }),
        updatePaymentStatus: builder.mutation<
            updatePaymentStatusResponse,
            updatePaymentStatusRequest
        >({
            query: (body) => ({
                url: `/api/payment/update/status`,
                method: 'POST',
                body,
            }),
        }),
        getParcelBalance: builder.mutation<parcelBalanceResponse, parcelBalanceRequest>({
            query: (body) => ({
                url: `/api/parcel/get/balance`,
                method: 'POST',
                body,
            }),
            // invalidatesTags: ['Balance'],
        }),
    }),
});

export const {
    useGetProviderQuery,
    useLazyGetProviderQuery,
    useGetChainListQuery,
    useLazyGetChainListQuery,
    useAddProviderMutation,
    useLazyGetDefaultProviderQuery,
    useGetPaymentByDaoQuery,
    useGetAwaitingPaymentByDaoQuery,
    useLazyGetAwaitingPaymentByDaoQuery,
    useLazyGetPaymentByDaoQuery,
    useAddPaymentsMutation,
    useGetParcelBalanceMutation,
    useUpdatePaymentStatusMutation,
    useChangeDefaultMutation,
    useDeleteProviderMutation,
    useUpdateProviderMutation,
    useGetParcelSafesMutation,
} = paymentsApi;
