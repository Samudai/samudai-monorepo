import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store/store';
import { createProjectRequest } from './model';

require('dotenv').config();

export const userProfileApi = createApi({
    reducerPath: 'newProjectsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers) => {
            headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            headers.set('daoId', store.getState().commonReducer.activeDao);
            return headers;
        },
    }),
    tagTypes: ['Projects'],
    endpoints: (builder) => ({
        createProject: builder.mutation<any, createProjectRequest>({
            query: (body) => ({
                url: `/api/project/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Projects'],
        }),
    }),
});

export const { useCreateProjectMutation } = userProfileApi;
