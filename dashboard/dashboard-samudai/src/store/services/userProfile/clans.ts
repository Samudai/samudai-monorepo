import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    addMemberRequest,
    addMemberResponse,
    createClanRequest,
    createClanResponse,
    getClanByMemberIdResponse,
} from './model';

require('dotenv').config();

export const userClansProfileApi = createApi({
    reducerPath: 'userClansProfileApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers) => {
            headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            return headers;
        },
    }),
    tagTypes: ['Clans'],
    endpoints: (builder) => ({
        getClanByMemberId: builder.query<getClanByMemberIdResponse, string>({
            query: (id) => `/api/clan/get/bymember/${id}`,
            providesTags: ['Clans'],
        }),
        createClan: builder.mutation<createClanResponse, createClanRequest>({
            query: (body) => ({
                url: `/api/clan/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Clans'],
        }),
        addMember: builder.mutation<addMemberResponse, addMemberRequest>({
            query: (body) => ({
                url: `/api/clan/addmember`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Clans'],
        }),
    }),
});

export const {
    useGetClanByMemberIdQuery,
    useLazyGetClanByMemberIdQuery,
    useCreateClanMutation,
    useAddMemberMutation,
} = userClansProfileApi;
