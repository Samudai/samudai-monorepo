import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FormResponse, MemberReviewResponse } from '@samudai_xyz/gateway-consumer-types';
import store from 'store/store';
import {
    DiscordEventsRes,
    activityResponse,
    addReviewRequest,
    addUserReviewReq,
    createDashboardRequest,
    createFormReq,
    dashboardIdResponse,
    getBlogResponse,
    getFormRes,
    getFormsRes,
    getReviewResponse,
    updateDaosocialsReq,
    updateDashBoardRequest,
    updateDashboardNameRequest,
    updateFormReq,
} from './model';

require('dotenv').config();

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers) => {
            if (!headers.has('authorization')) {
                headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            }
            headers.set(
                'daoId',
                localStorage.getItem('daoid') || store.getState().commonReducer.activeDao
            );
            return headers;
        },
    }),
    tagTypes: [
        'tweets',
        'blog',
        'review',
        'userReview',
        'projectActivity',
        'daoSocials',
        'form',
        'responses',
    ],
    endpoints: (builder) => ({
        getTweet: builder.query<any, string>({
            query: (daoId) => `/api/twitter/get/featured/${daoId}`,
            providesTags: ['tweets'],
        }),
        getDashboardId: builder.query<dashboardIdResponse, string>({
            query: (daoId) => `/api/dashboard/list/${daoId}`,
        }),
        getActivity: builder.query<activityResponse, string>({
            query: (daoId) => `/api/activity/dao/${daoId}`,
        }),
        getProjectActivity: builder.query<activityResponse, string>({
            query: (projectId) => `/api/activity/project/${projectId}`,
            providesTags: ['projectActivity'],
        }),
        updateDashboardWidget: builder.mutation<any, updateDashBoardRequest>({
            query: (body) => ({
                url: `/api/dashboard/widget/update`,
                method: 'POST',
                body,
            }),
        }),
        createDashboard: builder.mutation<any, createDashboardRequest>({
            query: (body) => ({
                url: `/api/dashboard/create`,
                method: 'POST',
                body,
            }),
        }),
        updateDashboardName: builder.mutation<any, updateDashboardNameRequest>({
            query: (body) => ({
                url: `/api/dashboard/update/name`,
                method: 'POST',
                body,
            }),
        }),
        deleteDashboard: builder.mutation<any, string>({
            query: (body) => ({
                url: `/api/dashboard/delete/${body}`,
                method: 'DELETE',
                body,
            }),
        }),
        updateDaoSocials: builder.mutation<any, updateDaosocialsReq>({
            query: (body) => ({
                url: `/api/dao/social/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['daoSocials'],
        }),
        // getDefaultProvider: builder.query<getDefaultProviderRequest, string>({
        //   query: (daoId) => `/api/provider/get/default/${daoId}`,
        // }),
        getBlog: builder.query<getBlogResponse, string>({
            query: (daoId) => `/api/dao/blog/get/${daoId}`,
            providesTags: ['blog'],
        }),
        addBlog: builder.mutation<any, { blog: { dao_id: string; link: string } }>({
            query: (body) => ({
                url: `/api/dao/blog/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['blog'],
        }),
        deleteBlog: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/dao/blog/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['blog'],
        }),
        addTweet: builder.mutation<any, { linkId: string; tweetId: string }>({
            query: (body) => ({
                url: `/api/twitter/add/featured`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['tweets'],
        }),
        getUserReview: builder.query<{ data?: { reviews: MemberReviewResponse[] } }, string>({
            query: (memberId) => ({
                url: `/api/member/review/get/${memberId}`,
                method: 'GET',
                headers: {
                    authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
                },
            }),
            providesTags: ['userReview'],
        }),
        addUserReviews: builder.mutation<any, addUserReviewReq>({
            query: (body) => ({
                url: `/api/member/review/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['userReview'],
        }),
        getReview: builder.query<getReviewResponse, string>({
            query: (daoId) => `/api/dao/review/get/${daoId}`,
            providesTags: ['review'],
        }),
        getGuildEvents: builder.query<DiscordEventsRes, string>({
            query: (guildId) => `/api/discord/get/events/byguild/${guildId}`,
        }),
        getMemberEvents: builder.query<DiscordEventsRes, string>({
            query: (daoId) => `/api/discord/get/events/bymember/${daoId}`,
        }),
        addReviews: builder.mutation<any, addReviewRequest>({
            query: (body) => ({
                url: `/api/dao/review/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['review'],
        }),
        getForm: builder.query<getFormsRes, string>({
            query: (daoId) => `/api/form/deal/get/dao/${daoId}`,
            providesTags: ['form'],
        }),
        getDaoSocials: builder.query<any, string>({
            query: (daoId) => `/api/dao/social/get/${daoId}`,
            providesTags: ['daoSocials'],
        }),
        responsesByFormID: builder.query<any, string>({
            query: (formId) => `/api/form/deal/response/get/${formId}`,
            providesTags: ['responses'],
        }),
        getFormbyFormId: builder.query<getFormRes, string>({
            query: (formId) => `/api/form/deal/get/${formId}`,
            // providesTags: ['form'],
        }),

        responsesByDaoID: builder.query<any, string>({
            query: (daoid) => `/api/form/deal/response/getbydao/${daoid}`,
            providesTags: ['responses'],
        }),
        taskResponseByForm: builder.query<any, string>({
            query: (formId) => `/api/taskformresponse/byformresponse/${formId}`,
        }),
        createForm: builder.mutation<any, createFormReq>({
            query: (body) => ({
                url: `/api/form/deal/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['form'],
        }),
        createResponse: builder.mutation<any, { response: FormResponse; daoId: string }>({
            query: (body) => ({
                url: `/api/form/deal/response/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['responses'],
        }),
        updateForm: builder.mutation<any, updateFormReq>({
            query: (body) => ({
                url: `/api/form/deal/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['form'],
        }),
        deleteForm: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/form/deal/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['form'],
        }),
    }),
});

export const {
    useGetTweetQuery,
    useLazyGetTweetQuery,
    useLazyGetActivityQuery,
    useLazyGetProjectActivityQuery,
    useAddTweetMutation,
    // useLazyGetDefaultProviderQuery,
    useAddBlogMutation,
    useLazyGetBlogQuery,
    useAddReviewsMutation,
    useLazyGetReviewQuery,
    useGetReviewQuery,
    useGetDashboardIdQuery,
    useLazyGetDashboardIdQuery,
    useUpdateDashboardWidgetMutation,
    useCreateDashboardMutation,
    useUpdateDashboardNameMutation,
    useDeleteDashboardMutation,
    useCreateFormMutation,
    useLazyGetFormQuery,
    useGetFormQuery,
    useUpdateFormMutation,
    useLazyGetUserReviewQuery,
    useGetUserReviewQuery,
    useAddUserReviewsMutation,
    useLazyGetGuildEventsQuery,
    useLazyGetMemberEventsQuery,
    useLazyGetFormbyFormIdQuery,
    useCreateResponseMutation,
    useLazyResponsesByFormIDQuery,
    useLazyResponsesByDaoIDQuery,
    useLazyGetDaoSocialsQuery,
    useUpdateDaoSocialsMutation,
    useLazyTaskResponseByFormQuery,
    useDeleteBlogMutation,
    useDeleteFormMutation,
} = dashboardApi;
