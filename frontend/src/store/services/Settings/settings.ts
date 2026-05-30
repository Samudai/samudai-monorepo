import store from '../../store';
import { departmentRequest, departmentRequestBulk } from '../Login/model';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    createAccessRequest,
    createAccessRequestAll,
    getAccessResponse,
    getConnectionResponse,
    getDepartmentsRes,
    getRolesResponse,
    getTokenTesponse,
    Telegram,
    getOtpResponse,
    getTelegramExistResponse,
} from './model';
import { discordRequest } from '../Login/model';

require('dotenv').config();

export const settingsApi = createApi({
    reducerPath: 'settingsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers, { getState }) => {
            headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            headers.set('daoid', store.getState().commonReducer.activeDao);
            return headers;
        },
    }),
    tagTypes: ['roles', 'access', 'connection', 'departments'],
    endpoints: (builder) => ({
        getDepartments: builder.query<getDepartmentsRes, string>({
            query: (id) => `api/dao/department/get/${id}`,
            providesTags: ['departments'],
        }),
        createDepartment: builder.mutation<any, departmentRequest>({
            query: (body) => ({
                url: `/api/dao/department/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['departments'],
        }),
        createDepartmentBulk: builder.mutation<any, departmentRequestBulk>({
            query: (body) => ({
                url: `/api/dao/department/onboarding/createbulk`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['departments'],
        }),
        deleteDepartments: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/dao/department/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['departments'],
        }),
        getRoles: builder.query<getRolesResponse, string>({
            query: (id) => `api/dao/role/get/${id}`,
        }),
        getAccess: builder.query<getAccessResponse, string>({
            query: (id) => `api/access/get/${id}`,
        }),
        getTokenGating: builder.query<getTokenTesponse, string>({
            query: (id) => `api/web3/tokengating/get/${id}`,
        }),
        getConnected: builder.query<getConnectionResponse, string>({
            query: (id) => `/api/plugin/list/dao/${id}`,
            providesTags: ['connection'],
        }),
        getConnectedContributor: builder.query<getConnectionResponse, string>({
            query: (id) => `/api/plugin/list/member/${id}`,
            providesTags: ['connection'],
        }),
        deleteNotion: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/plugin/notion/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['connection'],
        }),
        deleteGcal: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/plugin/gcal/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['connection'],
        }),
        deleteGitHub: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/plugin/github/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['connection'],
        }),
        deleteToken: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/web3/tokengating/delete/${id}`,
                method: 'DELETE',
            }),
        }),
        createAccess: builder.mutation<any, createAccessRequest>({
            query: (body) => ({
                url: `/api/access/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['access'],
        }),
        updateAccess: builder.mutation<any, createAccessRequest>({
            query: (body) => ({
                url: `/api/access/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['access'],
        }),
        updateAllAccess: builder.mutation<any, createAccessRequestAll>({
            query: (body) => ({
                url: `/api/access/update/allaccess`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['access'],
        }),
        verifyTwitter: builder.mutation<any, { username: string; linkId: string; address: string }>(
            {
                query: (body) => ({
                    url: `/api/twitter/verify`,
                    method: 'POST',
                    body,
                }),
                invalidatesTags: ['connection'],
            }
        ),
        deleteTwitter: builder.mutation<any, string>({
            query: (linkId) => ({
                url: `/api/twitter/delete/${linkId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['connection'],
        }),
        reconnectDiscord: builder.mutation<any, discordRequest>({
            query: (body) => ({
                url: `/api/discord/reconnect`,
                method: 'POST',
                body,
            }),
        }),
        deleteDiscord: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/discord/disconnect/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['connection'],
        }),
        addTelegram: builder.mutation<any, Telegram>({
            query: (body) => ({
                url: `/api/member/telegram/add`,
                method: 'POST',
                body,
            }),
        }),
        generateOtp: builder.mutation<getOtpResponse, { memberId: string }>({
            query: (body) => ({
                url: `/api/member/telegram/generateOtp`,
                method: 'POST',
                body,
            }),
        }),
        deleteTelegram: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/member/telegram/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['connection'],
        }),
        getTelegramExists: builder.query<getTelegramExistResponse, string>({
            query: (id) => `/api/member/telegram/exists/${id}`,
        }),
    }),
});

export const {
    useCreateAccessMutation,
    useLazyGetRolesQuery,
    useUpdateAccessMutation,
    useUpdateAllAccessMutation,
    useLazyGetAccessQuery,
    useLazyGetConnectedQuery,
    useLazyGetConnectedContributorQuery,
    useVerifyTwitterMutation,
    useDeleteTwitterMutation,
    useReconnectDiscordMutation,
    useDeleteDiscordMutation,
    useDeleteNotionMutation,
    useDeleteGcalMutation,
    useLazyGetTokenGatingQuery,
    useDeleteTokenMutation,
    useLazyGetDepartmentsQuery,
    useCreateDepartmentMutation,
    useDeleteDepartmentsMutation,
    useDeleteGitHubMutation,
    useCreateDepartmentBulkMutation,
    useAddTelegramMutation,
    useGenerateOtpMutation,
    useDeleteTelegramMutation,
    useLazyGetTelegramExistsQuery,
} = settingsApi;
