import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    DiscoveryDaoResp,
    DiscoveryMemberResp,
    FavDAOReq,
    FavouriteDaoRes,
    getMostViewedResponse,
    getMostActiveResponse,
    DiscoveryViewRequest,
    getAllSkillsResponse,
    getAllTagsResponse,
    getDiscoveryTagsResponse,
    getBulkDiscoveryDaoRequest,
    getBulkDiscoveryMemberResponse,
    getBulkDiscoveryDaoResponse,
    getBulkDiscoveryMemberRequest,
    getAllDomainTagsResponse,
} from './model';

require('dotenv').config();

export const discoveryApi = createApi({
    reducerPath: 'discoveryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers) => {
            headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            return headers;
        },
    }),
    tagTypes: ['Fav-Dao'],
    endpoints: (builder) => ({
        discoveryDao: builder.query<DiscoveryDaoResp, { memberId: string; filter: string }>({
            query: ({ memberId, filter }) => `/api/discovery/dao/${memberId}?${filter}`,
        }),
        discoveryMember: builder.query<DiscoveryMemberResp, { memberId: string; filter: string }>({
            query: ({ memberId, filter }) => `/api/discovery/member/${memberId}?${filter}`,
        }),
        getFavDaos: builder.query<FavouriteDaoRes, string>({
            query: (memberId) => `/api/dao/favourites/get/${memberId}`,
            providesTags: ['Fav-Dao'],
        }),
        // removeFavDao: builder.query<any, string>({
        //   query: (daoId) => `/api/dao/favourites/delete/${daoId}`,
        // }),
        createFavDao: builder.mutation<any, FavDAOReq>({
            query: (body) => ({
                url: `/api/dao/favourites/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Fav-Dao'],
        }),
        removeFavDao: builder.mutation<any, string>({
            query: (favouriteId) => ({
                url: `/api/dao/favourites/delete/${favouriteId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Fav-Dao'],
        }),
        getMostActiveDao: builder.query<getMostActiveResponse, void>({
            query: () => `/api/discovery/mostactive/dao`,
        }),
        getMostViewedDao: builder.query<getMostViewedResponse, void>({
            query: () => `/api/discovery/mostviewed/dao`,
        }),
        getMostActiveContributor: builder.query<getMostActiveResponse, void>({
            query: () => `/api/discovery/mostactive/contributor`,
        }),
        getMostViewedContributor: builder.query<getMostViewedResponse, void>({
            query: () => `/api/discovery/mostviewed/contributor`,
        }),
        addDiscoveryView: builder.mutation<any, DiscoveryViewRequest>({
            query: (body) => ({
                url: `/api/discovery/views/add`,
                method: 'POST',
                body,
            }),
        }),
        getContributorSkills: builder.query<getAllSkillsResponse, void>({
            query: () => `/api/member/skill/getall`,
        }),
        getContributorDomainTags: builder.query<getAllDomainTagsResponse, void>({
            query: () => `/api/member/domaintags/getall`,
        }),
        getContributorTags: builder.query<getAllTagsResponse, void>({
            query: () => `/api/member/tag/getall`,
        }),
        getDaoTags: builder.query<getAllTagsResponse, void>({
            query: () => `/api/dao/tag/getall`,
        }),
        getDiscoveryTags: builder.query<getDiscoveryTagsResponse, string>({
            query: (memberId) => `/api/discovery/fetch/tags/${memberId}`,
        }),
        getBulkDiscoveryDao: builder.mutation<
            getBulkDiscoveryDaoResponse,
            getBulkDiscoveryDaoRequest
        >({
            query: (body) => ({
                url: `/api/dao/getbulkdao/discovery`,
                method: 'POST',
                body,
            }),
        }),
        getBulkDiscoveryMember: builder.mutation<
            getBulkDiscoveryMemberResponse,
            getBulkDiscoveryMemberRequest
        >({
            query: (body) => ({
                url: `/api/member/getbulkmember/discovery`,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useLazyDiscoveryDaoQuery,
    useLazyDiscoveryMemberQuery,
    useCreateFavDaoMutation,
    useLazyGetFavDaosQuery,
    useRemoveFavDaoMutation,
    useLazyGetMostActiveContributorQuery,
    useLazyGetMostActiveDaoQuery,
    useLazyGetMostViewedContributorQuery,
    useLazyGetMostViewedDaoQuery,
    useAddDiscoveryViewMutation,
    useGetContributorSkillsQuery,
    useGetContributorTagsQuery,
    useGetDaoTagsQuery,
    useLazyGetContributorSkillsQuery,
    useLazyGetDaoTagsQuery,
    useLazyGetContributorTagsQuery,
    useLazyGetDiscoveryTagsQuery,
    useGetBulkDiscoveryDaoMutation,
    useGetBulkDiscoveryMemberMutation,
    useGetContributorDomainTagsQuery,
} = discoveryApi;
