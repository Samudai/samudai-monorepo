import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store/store';
import {
    projectReasrchRes,
    searchDAOReq,
    searchMemberRes,
    searchMemberforDao,
    searchRes,
} from './Model';

require('dotenv').config();

export const searchApi = createApi({
    reducerPath: 'searchApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers) => {
            headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            headers.set('daoId', store.getState().commonReducer.activeDao);
            return headers;
        },
    }),
    tagTypes: ['DAO', 'Member', 'DAOMember'],
    endpoints: (builder) => ({
        universalSearch: builder.query<searchRes, string>({
            query: (value) => `/api/search/universal/${value}`,
        }),
        projectSearch: builder.query<projectReasrchRes, string>({
            query: (value) => `/api/search/project/${value}`,
        }),
        searchDAO: builder.query<searchDAOReq, string>({
            query: (value) => `/api/search/dao/${value}`,
            // query: (value) => `/api/search/dao/${encodeURIComponent(value)}`,
            providesTags: ['DAO'],
        }),
        searchMember: builder.query<searchMemberRes, string>({
            query: (value) => `/api/search/member/${value}`,
            // query: (value) => `/api/search/member/${encodeURIComponent(value)}`,
            providesTags: ['Member'],
        }),
        searchMemberByDao: builder.query<searchMemberforDao, { daoId: string; value: string }>({
            // query: ({ daoId, value }) => `/api/search/daomember/${daoId}/${value}`,
            query: ({ daoId, value }) =>
                `/api/search/daomember/${daoId}?query=${encodeURIComponent(value)}`,
            providesTags: ['DAOMember'],
        }),
    }),
});

export const {
    useLazyUniversalSearchQuery,
    useLazySearchDAOQuery,
    useLazySearchMemberQuery,
    useLazySearchMemberByDaoQuery,
    useLazyProjectSearchQuery,
} = searchApi;
