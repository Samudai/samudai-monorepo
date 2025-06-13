import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { JobFile } from '@samudai_xyz/gateway-consumer-types/dist/types';
import store from 'store/store';
import {
    createApplicantRequest,
    createBountyRequest,
    createOpportunityRequest,
    createSubmissionRequest,
    favouriteBountyRequest,
    favouriteOpportunityRequest,
    getApplicantsByIdResponse,
    getApplicantsByMemberIdResponse,
    getBountiesByDaoIdResponse,
    getBountyByDaoIdResponse,
    getBountyByIdResponse,
    getFavouriteBounties,
    getFavouriteOpportunities,
    getOpportunityByDaoIdResponse,
    getOpportunityByIdResponse,
    getSkillsForJob,
    getSubmissionsByIdResponse,
    getSubmissionsByMemberIdResponse,
    reviewSubmissionRequest,
    totalApplicantAndAppliedCountRequest,
    totalApplicantAndAppliedCountResponse,
    updateApplicantStatusRequest,
    updateBountyStatusRequest,
    updateOpportunityStatusRequest,
} from './model';
import { getAllTagsResponse } from '../Discovery/model';

require('dotenv').config();

export const jobsApi = createApi({
    reducerPath: 'jobsApi',
    tagTypes: [
        'Jobs',
        'Bounty',
        'Applicants',
        'Submissions',
        'Project',
        'JobsSkills',
        'FavouriteJob',
        'FavouriteBounty',
    ],
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers) => {
            headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            headers.set('daoId', store.getState().commonReducer.activeDao);
            // headers.set('taskid', store.getState().commonReducer.taskid);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getOpportunityById: builder.query<getOpportunityByIdResponse, string>({
            query: (jobid) => `/api/jobs/get/${jobid}`,
            providesTags: ['Jobs'],
        }),
        getOpportunityByDAOId: builder.query<getOpportunityByDaoIdResponse, string>({
            query: (daoid) => `/api/jobs/list/${daoid}`,
            providesTags: ['Jobs'],
        }),
        getPublicOpportunities: builder.query<getOpportunityByDaoIdResponse, string | undefined>({
            query: (filter) => `/api/jobs/publiclist?${filter}`,
            providesTags: ['Jobs'],
        }),
        getBountyById: builder.query<getBountyByIdResponse, string>({
            query: (bountyid) => `/api/bounty/${bountyid}`,
            providesTags: ['Jobs'],
        }),
        getOpenBounties: builder.query<getBountyByDaoIdResponse, void>({
            query: () => `/api/bounty/get/openlist`,
            providesTags: ['Bounty'],
        }),
        getBountiesByDAOId: builder.query<getBountiesByDaoIdResponse, string>({
            query: (daoid) => `/api/bounty/list/${daoid}`,
            providesTags: ['Bounty'],
        }),
        getSkillListForJob: builder.query<getSkillsForJob, void>({
            query: () => `/api/skill/list/job`,
            providesTags: ['JobsSkills'],
        }),
        uploadJobFile: builder.mutation<any, JobFile>({
            query: (body) => ({
                url: `/api/jobsFile/create`,
                method: 'POST',
                body,
            }),
        }),
        createOpportunity: builder.mutation<any, createOpportunityRequest>({
            query: (body) => ({
                url: `/api/jobs/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Jobs'],
        }),
        createBounty: builder.mutation<any, createBountyRequest>({
            query: (body) => ({
                url: `/api/bounty/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Bounty'],
        }),
        getApplicantsByJobId: builder.query<getApplicantsByIdResponse, string>({
            query: (jobid) => `/api/applicant/list/${jobid}`,
            providesTags: ['Applicants'],
        }),
        getApplicantsByMemberId: builder.query<getApplicantsByMemberIdResponse, string>({
            query: (memberid) => `/api/applicant/list/member/${memberid}`,
            providesTags: ['Applicants'],
        }),
        createApplicant: builder.mutation<any, createApplicantRequest>({
            query: (body) => ({
                url: `/api/applicant/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Applicants'],
        }),
        updateApplicantStatus: builder.mutation<any, updateApplicantStatusRequest>({
            query: (body) => ({
                url: `/api/applicant/update/status`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Applicants'],
        }),
        updateOpportunity: builder.mutation<any, createOpportunityRequest>({
            query: (body) => ({
                url: `/api/jobs/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Jobs'],
        }),
        updateOpportunityStatus: builder.mutation<any, updateOpportunityStatusRequest>({
            query: (body) => ({
                url: `/api/jobs/update/status`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Jobs'],
        }),
        updateBounty: builder.mutation<any, createBountyRequest>({
            query: (body) => ({
                url: `/api/bounty/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Bounty'],
        }),
        updateBountyStatus: builder.mutation<any, updateBountyStatusRequest>({
            query: (body) => ({
                url: `/api/bounty/update/status`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Bounty'],
        }),
        getSubmissionsByBountyId: builder.query<getSubmissionsByIdResponse, string>({
            query: (bountyid) => `/api/submission/list/bounty/${bountyid}`,
            providesTags: ['Submissions'],
        }),
        getSubmissionsByMemberId: builder.query<getSubmissionsByMemberIdResponse, string>({
            query: (memberid) => `/api/submission/list/member/${memberid}`,
            providesTags: ['Submissions'],
        }),
        createSubmission: builder.mutation<any, createSubmissionRequest>({
            query: (body) => ({
                url: `/api/submission/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Submissions'],
        }),
        reviewSubmission: builder.mutation<any, reviewSubmissionRequest>({
            query: (body) => ({
                url: `/api/submission/review`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Submissions'],
        }),
        getOpportunityByDAOIdBulk: builder.mutation<any, { dao_ids: string[] }>({
            query: (body) => ({
                url: `/api/jobs/listbulkdao`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Jobs'],
        }),
        getBountiesByDAOIdBulk: builder.mutation<any, { dao_ids: string[] }>({
            query: (body) => ({
                url: `/api/bounty/listbulkdao`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Bounty'],
        }),
        getFavouriteOpportunitiesForMember: builder.query<getFavouriteOpportunities, string>({
            query: (memberid) => `/api/favourite/get/member/${memberid}`,
            providesTags: ['FavouriteJob'],
        }),
        favouriteOpportunity: builder.mutation<any, favouriteOpportunityRequest>({
            query: (body) => ({
                url: `/api/favourite/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['FavouriteJob'],
        }),
        deleteFavouriteOpportunity: builder.mutation<any, { jobId: string; memberId: string }>({
            query: ({ jobId, memberId }) => ({
                url: `/api/favourite/delete/${jobId}/${memberId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['FavouriteJob'],
        }),
        getFavouriteBountiesForMember: builder.query<getFavouriteBounties, string>({
            query: (memberid) => `/api/favourite/bounty/get/member/${memberid}`,
            providesTags: ['FavouriteBounty'],
        }),
        favouriteBounty: builder.mutation<any, favouriteBountyRequest>({
            query: (body) => ({
                url: `/api/favourite/bounty/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['FavouriteBounty'],
        }),
        deleteFavouriteBounty: builder.mutation<any, { bountyId: string; memberId: string }>({
            query: ({ bountyId, memberId }) => ({
                url: `/api/favourite/bounty/delete/${bountyId}/${memberId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['FavouriteBounty'],
        }),
        deleteOpportunity: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/jobs/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Jobs'],
        }),
        deleteBounty: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/bounty/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Bounty'],
        }),
        getJobTags: builder.query<getAllTagsResponse, void>({
            query: () => `/api/tag/list/job`,
        }),
        CompleteJobPayout: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/jobs/payout/complete/${id}`,
                method: 'POST',
            }),
        }),
        totalApplicantAndAppliedCount: builder.mutation<
            totalApplicantAndAppliedCountResponse,
            totalApplicantAndAppliedCountRequest
        >({
            query: (body) => ({
                url: `/api/jobs/analytics/jobstats`,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useGetOpportunityByIdQuery,
    useLazyGetOpportunityByIdQuery,
    useGetOpportunityByDAOIdQuery,
    useLazyGetSkillListForJobQuery,
    useGetSkillListForJobQuery,
    useLazyGetOpportunityByDAOIdQuery,
    useGetPublicOpportunitiesQuery,
    useLazyGetPublicOpportunitiesQuery,
    useGetOpenBountiesQuery,
    useLazyGetOpenBountiesQuery,
    useCreateOpportunityMutation,
    useCreateBountyMutation,
    useCreateApplicantMutation,
    useUpdateOpportunityMutation,
    useGetBountiesByDAOIdQuery,
    useCreateSubmissionMutation,
    useGetOpportunityByDAOIdBulkMutation,
    useGetBountiesByDAOIdBulkMutation,
    useLazyGetBountyByIdQuery,
    useLazyGetSubmissionsByBountyIdQuery,
    useLazyGetApplicantsByJobIdQuery,
    useUpdateBountyMutation,
    useUpdateOpportunityStatusMutation,
    useUpdateBountyStatusMutation,
    useUpdateApplicantStatusMutation,
    useReviewSubmissionMutation,
    useLazyGetApplicantsByMemberIdQuery,
    useLazyGetSubmissionsByMemberIdQuery,
    useGetFavouriteOpportunitiesForMemberQuery,
    useGetFavouriteBountiesForMemberQuery,
    useFavouriteOpportunityMutation,
    useFavouriteBountyMutation,
    useDeleteFavouriteOpportunityMutation,
    useDeleteFavouriteBountyMutation,
    useDeleteOpportunityMutation,
    useDeleteBountyMutation,
    useGetJobTagsQuery,
    useCompleteJobPayoutMutation,
    useTotalApplicantAndAppliedCountMutation,
} = jobsApi;
