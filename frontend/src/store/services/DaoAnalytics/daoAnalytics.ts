import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store/store';
import {
    GetPageVisitsResponse,
    GetJobApplicantssResponse,
    GetActiveProjectTasksResponse,
    GetActiveForumsResponse,
    GetPendingProposalsResponse,
} from './model';

require('dotenv').config();

export const daoAnalyticsApi = createApi({
    reducerPath: 'daoAnalytics',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers) => {
            headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            headers.set('daoId', store.getState().commonReducer.activeDao);
            return headers;
        },
    }),
    tagTypes: ['discussion', 'message'],
    endpoints: (builder) => ({
        getPageVisits: builder.query<GetPageVisitsResponse, string>({
            query: (id) => `/api/dao/analytics/dao/${id}`,
        }),
        getJobApplicants: builder.query<GetJobApplicantssResponse, string>({
            query: (id) => `/api/dao/analytics/applicantcount/${id}`,
        }),
        getActiveProjectTasks: builder.query<GetActiveProjectTasksResponse, string>({
            query: (id) => `/api/dao/analytics/get/activetask/${id}`,
        }),
        getActiveForums: builder.query<GetActiveForumsResponse, string>({
            query: (id) => `/api/dao/analytics/get/activeforum/${id}`,
        }),
        getPendingProposals: builder.query<GetPendingProposalsResponse, string>({
            query: (id) => `/api/dao/analytics/get/pendingproposal/${id}`,
        }),
    }),
});

export const {
    useLazyGetPageVisitsQuery,
    useGetPageVisitsQuery,
    useGetJobApplicantsQuery,
    useGetActiveProjectTasksQuery,
    useGetActiveForumsQuery,
    useGetPendingProposalsQuery,
} = daoAnalyticsApi;
