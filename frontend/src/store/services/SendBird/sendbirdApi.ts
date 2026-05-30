import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateUserRequest } from './model';

export const sendbirdApi = createApi({
    reducerPath: 'sendbirdApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `https://api-${process.env.REACT_APP_SEND_BIRD_APP_ID}.sendbird.com/v3`,
        prepareHeaders: (headers) => {
            headers.set('Api-Token', `${process.env.REACT_APP_SEND_BIRD_API_TOKEN}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        createUser: builder.mutation<any, CreateUserRequest>({
            query: (body) => ({
                url: `/users`,
                method: 'POST',
                body,
            }),
        }),
        getUser: builder.query<any, string>({
            query: (id) => `/users/${id}`,
        }),
    }),
});

export const { useCreateUserMutation, useLazyGetUserQuery } = sendbirdApi;
