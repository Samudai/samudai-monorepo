import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store/store';
import {
    AppsSendReq,
    LoginRequest,
    LoginResponse,
    departmentRequest,
    discordRequest,
    getLatestDaoForMemberResponse,
    githubOrgRequest,
    githubUserRequest,
    onBoardingUpdateResponse,
    onboardingUpdateRequest,
    typeOfMemberReq,
    TrialDashboardReq,
    submitFeedbackReq,
    BotAddedReq,
    addNameReq,
    profileDetailsReq,
    setUpProfileReq,
} from './model';

require('dotenv').config();

export const loginApi = createApi({
    reducerPath: 'loginApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers) => {
            headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            headers.set('daoId', store.getState().commonReducer.activeDao);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: `/api/member/login`,
                method: 'POST',
                body,
            }),
        }),
        typeOfMember: builder.mutation<any, typeOfMemberReq>({
            query: (body) => ({
                url: `/api/onboarding/add`,
                method: 'POST',
                body,
            }),
        }),
        setUpProfile: builder.mutation<any, setUpProfileReq>({
            query: (body) => ({
                url: `/api/onboarding/add`,
                method: 'POST',
                body,
            }),
        }),
        profileDetails: builder.mutation<any, profileDetailsReq>({
            query: (body) => ({
                url: `/api/onboarding/add`,
                method: 'POST',
                body,
            }),
        }),
        discord: builder.mutation<any, discordRequest>({
            query: (body) => ({
                url: `/api/member/linkdiscord`,
                method: 'POST',
                body,
            }),
        }),
        notionAuth: builder.mutation<any, githubUserRequest>({
            query: (body) => ({
                url: `/api/plugin/notion/auth`,
                method: 'POST',
                body,
            }),
        }),
        snapshotAuth: builder.mutation<any, { daoId: string; snapshot: string }>({
            query: (body) => ({
                url: `/api/dao/add/onboarding/snapshot`,
                method: 'POST',
                body,
            }),
        }),
        gnosisAuth: builder.mutation<
            any,
            {
                provider: {
                    dao_id: string;
                    name: string;
                    provider_type: string;
                    address: string;
                    chain_id: number;
                    is_default: boolean;
                    created_by: string;
                };
            }
        >({
            query: (body) => ({
                url: `/api/provider/create/`,
                method: 'POST',
                body,
            }),
        }),
        connectAppsSend: builder.mutation<any, AppsSendReq>({
            query: (body) => ({
                url: `/api/onboarding/add`,
                method: 'POST',
                body,
            }),
        }),
        githubUser: builder.mutation<any, githubUserRequest>({
            query: (body) => ({
                url: `/api/plugin/github/auth`,
                method: 'POST',
                body,
            }),
        }),
        githubOrg: builder.mutation<any, githubOrgRequest>({
            query: (body) => ({
                url: `/api/plugin/githubapp/auth`,
                method: 'POST',
                body,
            }),
        }),
        createDepartmentBulk: builder.mutation<any, departmentRequest>({
            query: (body) => ({
                url: `/api/dao/department/onboarding/createbulk`,
                method: 'POST',
                body,
            }),
        }),
        createDepartment: builder.mutation<any, departmentRequest>({
            query: (body) => ({
                url: `/api/dao/department/onboarding/create`,
                method: 'POST',
                body,
            }),
        }),
        uploadProfilePic: builder.mutation<{ message: string; data: string }, FormData>({
            query: (body) => ({
                url: `/api/member/uploadProfilePicture`,
                // mode: 'no-cors',
                method: 'POST',
                body,
            }),
        }),
        updateProfilePic: builder.mutation<{ message: string; data: string }, FormData>({
            query: (body) => ({
                url: `/api/member/update/pfp`,
                // mode: 'no-cors',
                method: 'POST',
                body,
            }),
        }),
        onboardingUpdate: builder.mutation<onBoardingUpdateResponse, onboardingUpdateRequest>({
            query: (body) => ({
                url: `/api/member/completeOnboarding`,
                method: 'POST',
                body,
            }),
        }),
        onboardingUpdateAdmin: builder.mutation<
            any,
            {
                daoId: string;
                onboarding: boolean;
                member_id: string;
                updated_by: string;
                memberOnboarded: boolean;
            }
        >({
            query: (body) => ({
                url: `/api/dao/update/onboarding`,
                method: 'POST',
                body,
            }),
        }),
        getLatestDaoForMember: builder.query<getLatestDaoForMemberResponse, string>({
            query: (guildId) => `/api/dao/getbyguildid/${guildId}`,
        }),
        checkUserName: builder.query<
            {
                message: string;
                data: {
                    exist: boolean;
                };
            },
            string
        >({
            query: (name) => `/api/member/checkusername/${name}`,
        }),
        completeTrialDashboard: builder.mutation<any, TrialDashboardReq>({
            query: (body) => ({
                url: `/api/onboarding/add`,
                method: 'POST',
                body,
            }),
        }),
        completeBotAdded: builder.mutation<any, BotAddedReq>({
            query: (body) => ({
                url: `/api/onboarding/add`,
                method: 'POST',
                body,
            }),
        }),
        submitFeedback: builder.mutation<any, submitFeedbackReq>({
            query: (body) => ({
                url: `/api/feedback/survey`,
                method: 'POST',
                body,
            }),
        }),
        addName: builder.mutation<any, addNameReq>({
            query: (body) => ({
                url: `/api/onboarding/add`,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useDiscordMutation,
    useOnboardingUpdateMutation,
    useUploadProfilePicMutation,
    useGetLatestDaoForMemberQuery,
    useLazyGetLatestDaoForMemberQuery,
    useGithubUserMutation,
    useNotionAuthMutation,
    useSnapshotAuthMutation,
    useGithubOrgMutation,
    useOnboardingUpdateAdminMutation,
    useLazyCheckUserNameQuery,
    useCreateDepartmentMutation,
    useTypeOfMemberMutation,
    useConnectAppsSendMutation,
    useUpdateProfilePicMutation,
    useGnosisAuthMutation,
    useCompleteTrialDashboardMutation,
    useSubmitFeedbackMutation,
    useCompleteBotAddedMutation,
    useAddNameMutation,
    useSetUpProfileMutation,
    useProfileDetailsMutation,
} = loginApi;
