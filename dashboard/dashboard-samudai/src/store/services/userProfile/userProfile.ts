import { checkSubdomainDaoResponse, fetchSubdomainInfoResponse } from '../Dao/model';
import {
    addProjectsByMemberResponse,
    getProjectByMemberIdQRequest,
    getProjectByMemberIdResponse,
} from '../projects/model';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Project, Subdomain } from '@samudai_xyz/gateway-consumer-types';
import store from 'store/store';
import {
    claimNFTResponse,
    createConnectionReq,
    getConnectionsById,
    getContributorProgressResponse,
    getDiscordGuilds,
    getMemberByIdResponse,
    getMemberWorkProgress,
    searchMemberRes,
    updateConnectionReq,
    updateFeaturedProjectsRequest,
    updateHourlyRate,
    updateMemberReq,
    updateOpenForOpportunity,
    getCID,
    checkSubdomainAccessResponse,
} from './model';
import { NewContributorItems } from '@samudai_xyz/gateway-consumer-types/dist/types/activity/enums';

require('dotenv').config();

export const userProfileApi = createApi({
    reducerPath: 'userProfileApi',
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
    tagTypes: ['Project', 'Member', 'Connections', 'progress'],
    endpoints: (builder) => ({
        getConnectionsByReceiverId: builder.query<getConnectionsById, string>({
            query: (id) => ({
                url: `/api/member/connection/receiver/${id}`,
                method: 'GET',
                headers: {
                    authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
                },
            }),
            providesTags: ['Connections'],
        }),
        getConnectionsByMemberId: builder.query<getConnectionsById, string>({
            query: (id) => ({
                url: `/api/member/connection/list/${id}`,
                method: 'GET',
                headers: {
                    authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
                },
            }),
            providesTags: ['Connections'],
        }),
        getConnectionsBySenderId: builder.query<getConnectionsById, string>({
            query: (id) => `/api/member/connection/sender/${id}`,
            providesTags: ['Connections'],
        }),
        getConnectionStatus: builder.query<{ data: null | { status: string } }, string>({
            query: (id) => `/api/member/connection/status/${id}`,
            providesTags: ['Connections'],
        }),
        getMemberWorkProgress: builder.query<getMemberWorkProgress, string>({
            query: (id) => `/api/member/get/workprogress/${id}`,
        }),

        updateConnection: builder.mutation<any, updateConnectionReq>({
            query: (body) => ({
                url: `/api/member/connection/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Connections'],
        }),
        getProjectByMemberId: builder.mutation<
            getProjectByMemberIdResponse,
            getProjectByMemberIdQRequest
        >({
            query: (body) => ({
                url: `/api/project/get/bymemberdao`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Project'],
        }),
        getAllProjectByMemberId: builder.mutation<
            getProjectByMemberIdResponse,
            getProjectByMemberIdQRequest
        >({
            query: (body) => ({
                url: `/api/project/get/bymember`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Project'],
        }),
        addProjectsByMember: builder.mutation<addProjectsByMemberResponse, { project: Project }>({
            query: (body) => ({
                url: `/api/project/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Project'],
        }),
        getMemberById: builder.mutation<
            getMemberByIdResponse,
            { member: { type: string; value: string } }
        >({
            query: (body) => ({
                url: `/api/member/fetch`,
                method: 'POST',
                body,
                headers: {
                    authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
                },
            }),
            invalidatesTags: ['Member'],
        }),
        updateMember: builder.mutation<any, updateMemberReq>({
            query: (body) => ({
                url: `/api/member/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Member'],
        }),
        createConnection: builder.mutation<any, createConnectionReq>({
            query: (body) => ({
                url: `/api/member/connection/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Connections'],
        }),
        updateSkills: builder.mutation<any, { memberId: string; skills: string[] }>({
            query: (body) => ({
                url: `/api/member/update/skills`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Member'],
        }),
        updateSubDomain: builder.mutation<any, { memberId: string; subdomain: string }>({
            query: (body) => ({
                url: `/api/member/update/subdomain`,
                method: 'POST',
                body,
            }),
        }),
        updateHourlyRate: builder.mutation<any, updateHourlyRate>({
            query: (body) => ({
                url: `/api/member/rate/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Member'],
        }),
        searchMember: builder.query<searchMemberRes, string>({
            query: (value) => `/api/search/member/${value}`,
        }),
        updateOpenForOpportunity: builder.mutation<any, updateOpenForOpportunity>({
            query: (body) => ({
                url: `/api/member/update/opportunitystatus`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Member'],
        }),
        updateDomainTagsForWork: builder.mutation<
            any,
            { member_id: string; domain_tags_for_work: string[] }
        >({
            query: (body) => ({
                url: `/api/member/update/domaintags`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Member'],
        }),
        updateFeaturedProjects: builder.mutation<any, updateFeaturedProjectsRequest>({
            query: (body) => ({
                url: `/api/member/update/featuredprojects`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Member'],
        }),
        getContributorProgress: builder.query<getContributorProgressResponse, string>({
            query: (id) => `/api/progressbar/get/contributor/${id}`,
            providesTags: ['progress'],
        }),
        updateContributorProgress: builder.mutation<
            getContributorProgressResponse,
            { memberId: string; itemId: NewContributorItems[] }
        >({
            query: (body) => ({
                url: `/api/progressbar/contributor/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['progress'],
        }),
        updateClaimNFTRequest: builder.mutation<claimNFTResponse, { memberId: string }>({
            query: (body) => ({
                url: `/api/member/update/claimnft`,
                method: 'POST',
                body,
            }),
        }),
        updateClaimSubdomainRequest: builder.mutation<
            claimNFTResponse,
            { memberId: string; walletAddress: string; subdomain: string }
        >({
            query: (body) => ({
                url: `/api/member/update/subdomainrequest`,
                method: 'POST',
                body,
            }),
        }),
        getDiscordGuilds: builder.query<getDiscordGuilds, string>({
            query: (id) => `/api/discord/get/guilds/${id}`,
        }),
        getAllConnectionsByReceiverId: builder.query<getConnectionsById, string>({
            query: (id) => `/api/member/connection/listall/${id}`,
            providesTags: ['Connections'],
        }),
        checkSubdomainExists: builder.query<checkSubdomainDaoResponse, string>({
            query: (subdomain) => `/api/member/checksubdomain/${subdomain}`,
        }),
        fetchSubdomainInfoForMember: builder.query<fetchSubdomainInfoResponse, string>({
            query: (memberId) => `/api/member/fetchsubdomainbymemberid/${memberId}`,
        }),
        getCID: builder.query<getCID, { memberId: string; subdomain: string }>({
            query: ({ memberId, subdomain }) => `/api/member/getCID/${memberId}/${subdomain}`,
        }),
        createSubdomain: builder.mutation<any, { subdomain: Subdomain }>({
            query: (body) => ({
                url: `/api/member/subdomain/create`,
                method: 'POST',
                body,
            }),
        }),
        getSubdomain: builder.query<any, { memberId: string; subdomain: string }>({
            query: ({ memberId, subdomain }) =>
                `/api/member/subdomain/get/${memberId}/${subdomain}`,
        }),
        checkSubdomainAccessForMember: builder.query<checkSubdomainAccessResponse, string>({
            query: (memberId) => `/api/member/subdomain/checksubdomaincreate/${memberId}`,
        }),
        getEmail: builder.query<any, string>({
            query: (memberId) => `/api/member/is/emailupdated/${memberId}`,
        }),
        updateEmail: builder.mutation<any, { memberId: string; email: string }>({
            query: (body) => ({
                url: `/api/member/update/email`,
                method: 'POST',
                body,
            }),
        }),
        addDaoForMember: builder.mutation<any, { memberId: string; value: any }>({
            query: (body) => ({
                url: `/api/member/adddao`,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useLazyGetConnectionsByMemberIdQuery,
    useLazyGetConnectionsByReceiverIdQuery,
    useLazyGetConnectionsBySenderIdQuery,
    useLazyGetConnectionStatusQuery,
    useGetMemberByIdMutation,
    useAddProjectsByMemberMutation,
    useGetProjectByMemberIdMutation,
    useGetAllProjectByMemberIdMutation,
    useCreateConnectionMutation,
    useUpdateMemberMutation,
    useLazySearchMemberQuery,
    useUpdateSubDomainMutation,
    useUpdateSkillsMutation,
    useUpdateConnectionMutation,
    useUpdateHourlyRateMutation,
    useUpdateOpenForOpportunityMutation,
    useUpdateDomainTagsForWorkMutation,
    useUpdateFeaturedProjectsMutation,
    useGetMemberWorkProgressQuery,
    useLazyGetMemberWorkProgressQuery,
    useGetContributorProgressQuery,
    useUpdateClaimNFTRequestMutation,
    useLazyGetDiscordGuildsQuery,
    useUpdateClaimSubdomainRequestMutation,
    useLazyCheckSubdomainExistsQuery,
    useLazyFetchSubdomainInfoForMemberQuery,
    useLazyGetCIDQuery,
    useCreateSubdomainMutation,
    useUpdateContributorProgressMutation,
    useLazyGetAllConnectionsByReceiverIdQuery,
    useLazyGetSubdomainQuery,
    useLazyCheckSubdomainAccessForMemberQuery,
    useUpdateEmailMutation,
    useGetEmailQuery,
    useAddDaoForMemberMutation,
} = userProfileApi;
