import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DAO, TeamMemberResponse } from '@samudai_xyz/gateway-consumer-types';
import { NewDAOItems } from '@samudai_xyz/gateway-consumer-types/dist/types/activity/enums';
import store from 'store/store';
import {
    addDaoResponse,
    checkSubdomainDaoResponse,
    createCollaborationRequest,
    fetchCollaborationResponse,
    fetchSubdomainInfoResponse,
    getDaoMembersResponse,
    getDaoProgressResponse,
    getDaoResponse,
    getSingleDaoResponse,
    inviteDaoResponse,
    updateCollaborationRequest,
    Subdomain,
} from './model';
import { checkSubdomainAccessResponse } from '../userProfile/model';

require('dotenv').config();

export const daoApi = createApi({
    reducerPath: 'daoApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers) => {
            if (!headers.has('authorization')) {
                headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            }
            headers.set('daoId', store.getState().commonReducer.activeDao);
            return headers;
        },
    }),
    tagTypes: ['dao', 'member', 'progress', 'collaborate'],
    endpoints: (builder) => ({
        getDao: builder.query<getDaoResponse, string>({
            query: (memberId) => ({
                url: `/api/dao/getformember/${memberId}`,
                method: 'GET',
                headers: {
                    authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
                },
            }),
            providesTags: ['dao'],
        }),
        getDaoMembers: builder.query<getDaoMembersResponse, string>({
            query: (daoId) => `/api/dao/member/list/${daoId}`,
            providesTags: ['member'],
        }),
        getDaoMemberInfo: builder.query<TeamMemberResponse, { daoId: string; memberId: string }>({
            query: (body) => `/api/dao/member/team/${body.daoId}/${body.memberId}`,
        }),
        getDaoByDaoId: builder.query<getSingleDaoResponse, string>({
            query: (daoId) => `/api/dao/get/${daoId}`,
            providesTags: ['dao'],
        }),
        updateDao: builder.mutation<DAO, any>({
            query: (body) => ({
                url: `/api/dao/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['dao'],
        }),
        createInvite: builder.mutation<inviteDaoResponse, { dao_id: string; created_by: string }>({
            query: (body) => ({
                url: `/api/dao/invite/create`,
                method: 'POST',
                body,
            }),
        }),
        addMemberToDao: builder.mutation<
            addDaoResponse,
            { invite_code: string; member_id: string }
        >({
            query: (body) => ({
                url: `/api/dao/invite/add/member`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['member'],
        }),
        updateDaoProfilePic: builder.mutation<
            { message: string; profilePicture: string },
            FormData
        >({
            query: (body) => ({
                url: `/api/dao/update/profile_picture`,
                // mode: 'no-cors',
                method: 'POST',
                body,
            }),
        }),
        getDaoProgress: builder.query<getDaoProgressResponse, string>({
            query: (id) => `/api/progressbar/get/dao/${id}`,
            providesTags: ['progress'],
        }),
        updateDaoProgress: builder.mutation<
            getDaoProgressResponse,
            { daoId: string; itemId: NewDAOItems[] }
        >({
            query: (body) => ({
                url: `/api/progressbar/dao/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['progress'],
        }),
        claimSubdomainDao: builder.mutation<
            { message: string; data?: any; error?: any },
            { daoId: string; subdomain: string; providerAddress: string }
        >({
            query: (body) => ({
                url: `/api/dao/claimsubdomain`,
                method: 'POST',
                body,
            }),
        }),
        checkSubdomainExists: builder.query<checkSubdomainDaoResponse, string>({
            query: (subdomain) => `/api/dao/checksubdomain/${subdomain}`,
        }),
        fetchSubdomainInfo: builder.query<fetchSubdomainInfoResponse, string>({
            query: (daoId) => `/api/dao/fetchsubdomainbydaoid/${daoId}`,
        }),
        fetchCollaborations: builder.query<fetchCollaborationResponse, string>({
            query: (daoId) => `/api/dao/collaboration/get/${daoId}`,
            providesTags: ['collaborate'],
        }),
        createCollaboration: builder.mutation<any, createCollaborationRequest>({
            query: (body) => ({
                url: `/api/dao/collaboration/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['collaborate'],
        }),
        updateCollaboration: builder.mutation<any, updateCollaborationRequest>({
            query: (body) => ({
                url: `/api/dao/collaboration/update/status`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['collaborate'],
        }),
        createSubdomainDao: builder.mutation<any, { subdomain: Subdomain }>({
            query: (body) => ({
                url: `/api/dao/subdomain/create`,
                method: 'POST',
                body,
            }),
        }),
        getSubdomainDao: builder.query<any, { daoId: string; subdomain: string }>({
            query: ({ daoId, subdomain }) => `/api/dao/subdomain/get/${daoId}/${subdomain}`,
        }),
        checkSubdomainAccessForDao: builder.query<checkSubdomainAccessResponse, string>({
            query: (daoId) => `/api/dao/subdomain/checksubdomaincreate/${daoId}`,
        }),
        linkDiscordBot: builder.mutation<any, { daoId: string; guildId: string }>({
            query: ({ daoId, guildId }) => ({
                url: `/api/dao/linkdiscordbot/${daoId}/${guildId}`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useGetDaoQuery,
    useLazyGetDaoQuery,
    useLazyGetDaoMembersQuery,
    useLazyGetDaoMemberInfoQuery,
    useLazyCheckSubdomainExistsQuery,
    useGetDaoByDaoIdQuery,
    useLazyGetDaoByDaoIdQuery,
    useUpdateDaoMutation,
    useCreateInviteMutation,
    useAddMemberToDaoMutation,
    useUpdateDaoProfilePicMutation,
    useGetDaoProgressQuery,
    useLazyFetchSubdomainInfoQuery,
    useUpdateDaoProgressMutation,
    useClaimSubdomainDaoMutation,
    useCreateCollaborationMutation,
    useFetchCollaborationsQuery,
    useUpdateCollaborationMutation,
    useCreateSubdomainDaoMutation,
    useLazyGetSubdomainDaoQuery,
    useLazyCheckSubdomainAccessForDaoQuery,
    useLinkDiscordBotMutation,
} = daoApi;
