import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store/store';
import {
    addParticipantBulkReq,
    addParticipantReq,
    archiveForumRequest,
    bookmarkForumRequest,
    creatDiscussionRequest,
    createMessageReq,
    discussionByProposalRes,
    editMessageReq,
    getDiscussionByMemberIdResponse,
    getDiscussionResponse,
    getMessageResponse,
    getTagsResponse,
} from './model';

require('dotenv').config();

export const discussionApi = createApi({
    reducerPath: 'discussionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers) => {
            headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            headers.set('daoId', store.getState().commonReducer.activeDao);
            return headers;
        },
    }),
    tagTypes: ['discussion', 'message', 'tags'],
    endpoints: (builder) => ({
        getMessages: builder.query<getMessageResponse, string>({
            query: (id) => `/api/discussion/message/${id}`,
        }),
        getDiscussionsByMemberId: builder.query<getDiscussionByMemberIdResponse, string>({
            query: (id) => `/api/discussion/getfor/${id}`,
        }),
        getDiscussionsByProposal: builder.query<discussionByProposalRes, string>({
            query: (id) => `/api/discussion/byproposal/${id}`,
        }),
        createMessage: builder.mutation<any, createMessageReq>({
            query: (body) => ({
                url: `/api/discussion/message/create`,
                method: 'POST',
                body,
                // headers: { daoId: daoId },
            }),
            // async onQueryStarted(props, { dispatch, queryFulfilled }) {
            //   await queryFulfilled;
            //   setTimeout(() => {
            //     dispatch(discussionApi.util.invalidateTags(['message']));
            //   }, 3000);
            // },
            invalidatesTags: ['message', 'discussion'],
        }),
        editMessage: builder.mutation<any, editMessageReq>({
            query: (body) => ({
                url: `/api/discussion/message/update/content`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['message', 'discussion'],
        }),
        deleteMessage: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/discussion/message/delete/${id}`,
                method: 'DELETE',
            }),
        }),
        getDiscussions: builder.query<getDiscussionResponse, string>({
            query: (id) => ({
                url: `/api/discussion/getall/${id}`,
                method: 'GET',
                // headers: { daoId: daoId },
            }),
            providesTags: ['discussion'],
        }),
        addParticipant: builder.mutation<any, addParticipantReq>({
            query: (body) => ({
                url: `/api/discussion/participant/add`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['discussion', 'message'],
        }),
        addParticipantBulk: builder.mutation<any, addParticipantBulkReq>({
            query: (body) => ({
                url: `/api/discussion/participant/addbulk`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['discussion', 'message'],
        }),
        removeParticipant: builder.mutation<any, addParticipantReq>({
            query: (body) => ({
                url: `/api/discussion/participant/remove`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['discussion', 'message'],
        }),
        checkIsParticipant: builder.query<any, { discussionId: string; memberId: string }>({
            query: ({ discussionId, memberId }) =>
                `/api/discussion/isparticipant/${discussionId}/${memberId}`,
        }),
        createDiscussion: builder.mutation<any, creatDiscussionRequest>({
            query: (body) => ({
                url: `/api/discussion/create`,
                method: 'POST',
                body,
                // headers: { daoId: daoId },
            }),
            invalidatesTags: ['discussion'],
        }),
        updateDiscussion: builder.mutation<any, creatDiscussionRequest>({
            query: (body) => ({
                url: `/api/discussion/update`,
                method: 'POST',
                body,
                // headers: { daoId: daoId },
            }),
            invalidatesTags: ['discussion'],
        }),
        archiveForum: builder.mutation<any, archiveForumRequest>({
            query: (body) => ({
                url: `/api/discussion/close`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['discussion'],
        }),
        bookmarkForum: builder.mutation<any, bookmarkForumRequest>({
            query: (body) => ({
                url: `/api/discussion/updatebookmark`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['discussion'],
        }),
        getTags: builder.query<getTagsResponse, string>({
            query: (id) => ({
                url: `/api/discussion/gettags/${id}`,
                method: 'GET',
                // headers: { daoId: daoId },
            }),
            providesTags: ['tags'],
        }),
        updateView: builder.query<{ message: string }, string>({
            query: (id) => ({
                url: `/api/discussion/updateview/${id}`,
                method: 'GET',
                // headers: { daoId: daoId },
            }),
            providesTags: ['discussion'],
        }),
    }),
});

export const {
    useCreateDiscussionMutation,
    useUpdateDiscussionMutation,
    useLazyGetDiscussionsQuery,
    useLazyGetMessagesQuery,
    useCreateMessageMutation,
    useAddParticipantMutation,
    useRemoveParticipantMutation,
    useLazyCheckIsParticipantQuery,
    useLazyGetDiscussionsByMemberIdQuery,
    useLazyGetDiscussionsByProposalQuery,
    useArchiveForumMutation,
    useBookmarkForumMutation,
    useLazyGetTagsQuery,
    useAddParticipantBulkMutation,
    useLazyUpdateViewQuery,
    useEditMessageMutation,
    useDeleteMessageMutation,
} = discussionApi;
