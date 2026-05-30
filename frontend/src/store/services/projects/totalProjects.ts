import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store/store';
import {
    IGetNotionProperties,
    IPayoutRequest,
    addColumnRequest,
    addCommentRequest,
    bulkResponsePositionUpdateRequest,
    bulkSubTaskPositionUpdateRequest,
    bulkTaskPositionUpdateRequest,
    createFileRq,
    createFolderReq,
    createFolderRes,
    createSubTaskRequest,
    createTaskRequest,
    createTaskResponse,
    getAccessResponse,
    getCurrencyResp,
    getDepartmentByDaoIdResponse,
    getFolderByFIdRes,
    getFolderByPIdRes,
    getNotionDatabaseResponse,
    getProjectByIdResponse,
    getProjectByLinkResponse,
    getSubTasksByProjectIdResponse,
    getTasksByProjectIdResponse,
    getTokenRes,
    gitHubReposRes,
    importNotionRequest,
    personalTaskResponse,
    taskUpdateReq,
    tokenCreate,
    updateColumnHeadsRequest,
    updateColumnsRequest,
    updateInvestmentColumnsRequest,
    updateInvestmentPositionRequest,
    updatePinnedRequest,
    updatePositionRequest,
    updateProjectAccessRequest,
    updateProjectReq,
    updateSubTaskColumnRequest,
    updateSubTaskRequest,
    updateSubTaskRowRequest,
} from './model';

require('dotenv').config();

export const projectApi = createApi({
    reducerPath: 'projectApi',
    tagTypes: ['Task', 'Project', 'Folder', 'SubTask', 'Payout'],
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers) => {
            const projectId =
                localStorage.getItem('_projectid') || store.getState().commonReducer.projectid;
            headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            headers.set('daoId', store.getState().commonReducer.activeDao);
            if (projectId) headers.set('projectid', projectId);
            // headers.set('taskid', store.getState().commonReducer.taskid);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getProjectAccess: builder.query<getAccessResponse, string>({
            query: (id) => `/api/projectaccess/get/${id}`,
        }),
        getCurrencyForAddress: builder.query<getCurrencyResp, string>({
            query: (id) => `/api/web3/token/get/${id}`,
        }),
        getProjectById: builder.query<getProjectByIdResponse, string>({
            query: (id) => `/api/project/${id}`,
            providesTags: ['Task', 'Project'],
        }),
        getProjectByLinkId: builder.query<getProjectByLinkResponse, string>({
            query: (id) => `/api/project/getall/${id}`,
            providesTags: ['Task'],
        }),
        getMonthlyProgressByDaoId: builder.query<any, string>({
            query: (id) => `/api/project/getall/${id}`,
            providesTags: ['Task'],
        }),
        getTasksByProjectId: builder.query<getTasksByProjectIdResponse, string>({
            query: (id) => `/api/task/alltask/${id}`,
            providesTags: ['Task'],
        }),
        getPersonalTasks: builder.query<personalTaskResponse, string>({
            query: (id) => `/api/task/get/personaltask/${id}`,
            providesTags: ['Task'],
        }),
        getAssignedTask: builder.query<personalTaskResponse, string>({
            query: (id) => `/api/task/get/assignedtask/${id}`,
            providesTags: ['Task'],
        }),
        getRepos: builder.query<gitHubReposRes, string>({
            query: (id) => `/api/plugin/githubapp/getrepos/${id}`,
        }),
        checkGithubRepos: builder.query<any, string>({
            query: (id) => `/api/plugin/githubapp/exists/${id}`,
        }),
        getDepartmentByDaoId: builder.query<getDepartmentByDaoIdResponse, string>({
            query: (id) => `/api/dao/department/get/${id}`,
        }),
        getTokens: builder.query<getTokenRes, string>({
            query: (id) => `/api/dao/token/get/${id}`,
        }),
        getFolderByFId: builder.query<getFolderByFIdRes, string>({
            query: (id) => `/api/folder/${id}`,
            providesTags: ['Folder'],
        }),
        getFoldersByPID: builder.query<getFolderByPIdRes, string>({
            query: (id) => `/api/folder/byproject/${id}`,
            providesTags: ['Folder'],
        }),
        deleteFolder: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/folder/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Folder'],
        }),
        deleteFileinFolder: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/file/delete/project/${id}`,
                method: 'DELETE',
            }),
        }),
        createFolder: builder.mutation<createFolderRes, createFolderReq>({
            query: (body) => ({
                url: `/api/folder/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Folder'],
        }),
        createFileInFolder: builder.mutation<any, createFileRq>({
            query: (body) => ({
                url: `/api/file/upload/project`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Folder'],
        }),
        addToken: builder.mutation<any, tokenCreate>({
            query: (body) => ({
                url: `/api/dao/token/create`,
                method: 'POST',
                body,
            }),
        }),
        taskUpdate: builder.mutation<any, taskUpdateReq>({
            query: (body) => ({
                url: `/api/task/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task'],
        }),
        deleteProject: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/project/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Project'],
        }),
        bulkTaskPositionUpdate: builder.mutation<any, bulkTaskPositionUpdateRequest>({
            query: (body) => ({
                url: `/api/task/update/column/bulk`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task'],
        }),
        bulkSubTaskPositionUpdate: builder.mutation<any, bulkSubTaskPositionUpdateRequest>({
            query: (body) => ({
                url: `/api/subtask/update/column/bulk`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task', 'SubTask'],
        }),
        bulkResponsePositionUpdate: builder.mutation<any, bulkResponsePositionUpdateRequest>({
            query: (body) => ({
                url: `/api/taskformresponse/update/column/bulk`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task', 'Project'],
        }),
        getPRs: builder.mutation<
            { message: string; data?: any },
            { dao_id: string; github_repos: string[] }
        >({
            query: (body) => ({
                url: `/api/plugin/githubapp/fetchpullrequests`,
                method: 'POST',
                body,
            }),
        }),
        updateProject: builder.mutation<{ message: string; data?: any }, updateProjectReq>({
            query: (body) => ({
                headers: { projectid: body.project.project_id },
                url: `/api/project/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Project', 'Task'],
        }),
        createTask: builder.mutation<createTaskResponse, createTaskRequest>({
            query: (body) => ({
                url: `/api/task/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Project', 'Task'],
        }),
        updateProjectAccess: builder.mutation<any, updateProjectAccessRequest>({
            query: (body) => ({
                url: `/api/projectaccess/update/access`,
                method: 'POST',
                body,
            }),
        }),
        updateColumns: builder.mutation<any, updateColumnsRequest>({
            query: (body) => ({
                url: `/api/task/update/column`,
                method: 'POST',
                body,
            }),
            // invalidatesTags: ['Task'],
        }),
        updateInvestmentColumns: builder.mutation<any, updateInvestmentColumnsRequest>({
            query: (body) => ({
                url: `/api/taskformresponse/update/column`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task', 'Project'],
        }),
        updateColumnHeads: builder.mutation<any, updateColumnHeadsRequest>({
            query: (body) => ({
                url: `/api/project/update/columns`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task', 'Project'],
        }),
        updatePinned: builder.mutation<any, updatePinnedRequest>({
            query: (body) => ({
                url: `/api/project/update/pinned`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Project'],
        }),
        updateRow: builder.mutation<any, updatePositionRequest>({
            query: (body) => ({
                url: `/api/task/update/position`,
                method: 'POST',
                body,
            }),
            // invalidatesTags: ['Task'],
        }),
        updateInvestmentRow: builder.mutation<any, updateInvestmentPositionRequest>({
            query: (body) => ({
                url: `/api/taskformresponse/update/position`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task'],
        }),
        importNotion: builder.mutation<any, importNotionRequest>({
            query: (body) => ({
                url: `/api/plugin/notion/importdatabase`,
                method: 'POST',
                body,
            }),
        }),
        addComments: builder.mutation<void, addCommentRequest>({
            query: (body) => ({
                url: `/api/comment/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task', 'Project'],
        }),
        addColumn: builder.mutation<void, addColumnRequest>({
            query: (body) => ({
                url: `/api/project/update/columns`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task', 'Project'],
        }),
        getNotionDatabase: builder.mutation<getNotionDatabaseResponse, { member_id: string }>({
            query: (body) => ({
                url: `/api/plugin/notion/getalldatabase`,
                method: 'POST',
                body,
            }),
        }),
        getNotionProperties: builder.mutation<
            IGetNotionProperties,
            { member_id: string; database_id: string }
        >({
            query: (body) => ({
                url: `/api/plugin/notion/getdatabaseproperties`,
                method: 'POST',
                body,
            }),
        }),
        getTaskById: builder.query<any, string>({
            query: (id) => `/api/task/${id}`,
            providesTags: ['Task', 'SubTask'],
        }),
        getSubTasksByProjectId: builder.query<getSubTasksByProjectIdResponse, string>({
            query: (id) => `/api/subtask/allsubtask/${id}`,
            providesTags: ['SubTask'],
        }),
        createSubTask: builder.mutation<any, createSubTaskRequest>({
            query: (body) => ({
                url: `/api/subtask/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task', 'SubTask'],
        }),
        updateSubTask: builder.mutation<any, updateSubTaskRequest>({
            query: (body) => ({
                url: `/api/subtask/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task', 'SubTask'],
        }),
        updateSubTaskColumn: builder.mutation<any, updateSubTaskColumnRequest>({
            query: (body) => ({
                url: `/api/subtask/update/column`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['SubTask', 'Task'],
        }),
        updateSubTaskRow: builder.mutation<any, updateSubTaskRowRequest>({
            query: (body) => ({
                url: `/api/subtask/update/position`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['SubTask'],
        }),
        createPayout: builder.mutation<any, { payout: IPayoutRequest }>({
            query: (body) => ({
                url: `/api/payout/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task', 'SubTask', 'Payout'],
        }),
        updatePayout: builder.mutation<any, { payout: IPayoutRequest }>({
            query: (body) => ({
                url: `/api/payout/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task', 'SubTask', 'Payout'],
        }),
        CompleteProjectPayout: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/payout/complete/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['Task', 'SubTask', 'Payout'],
        }),
        DeletePayout: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/payout/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Task', 'SubTask', 'Payout'],
        }),
        getPayoutById: builder.query<any, string>({
            query: (id) => `/api/payout/get/${id}`,
            providesTags: ['Task', 'SubTask', 'Payout'],
        }),
        DeleteTask: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/task/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Task'],
        }),
        DeleteSubTask: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/subtask/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Task', 'SubTask'],
        }),
        createBulkPayout: builder.mutation<any, { payouts: IPayoutRequest[] }>({
            query: (body) => ({
                url: `/api/payout/createbulk`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task', 'SubTask', 'Payout'],
        }),
    }),
});

export const {
    useGetProjectByIdQuery,
    useLazyGetProjectByIdQuery,
    useLazyGetMonthlyProgressByDaoIdQuery,
    useCreateTaskMutation,
    useGetTasksByProjectIdQuery,
    useLazyGetTasksByProjectIdQuery,
    useAddCommentsMutation,
    useGetNotionDatabaseMutation,
    useGetNotionPropertiesMutation,
    useLazyGetDepartmentByDaoIdQuery,
    useImportNotionMutation,
    useGetProjectByLinkIdQuery,
    useAddColumnMutation,
    useUpdateColumnsMutation,
    useUpdateInvestmentColumnsMutation,
    useUpdateColumnHeadsMutation,
    useUpdateRowMutation,
    useUpdateInvestmentRowMutation,
    useLazyGetPersonalTasksQuery,
    useGetPersonalTasksQuery,
    useGetAssignedTaskQuery,
    useLazyGetAssignedTaskQuery,
    useLazyGetReposQuery,
    useLazyCheckGithubReposQuery,
    useLazyGetProjectAccessQuery,
    useUpdateProjectAccessMutation,
    useUpdateProjectMutation,
    useGetPRsMutation,
    useTaskUpdateMutation,
    useBulkTaskPositionUpdateMutation,
    useBulkSubTaskPositionUpdateMutation,
    useBulkResponsePositionUpdateMutation,
    useUpdatePinnedMutation,
    useDeleteProjectMutation,
    useLazyGetCurrencyForAddressQuery,
    useAddTokenMutation,
    useLazyGetTokensQuery,
    useLazyGetFolderByFIdQuery,
    useLazyGetFoldersByPIDQuery,
    useDeleteFolderMutation,
    useCreateFolderMutation,
    useCreateFileInFolderMutation,
    useDeleteFileinFolderMutation,
    useGetTaskByIdQuery,
    useGetSubTasksByProjectIdQuery,
    useCreateSubTaskMutation,
    useUpdateSubTaskColumnMutation,
    useUpdateSubTaskRowMutation,
    useCreatePayoutMutation,
    useUpdatePayoutMutation,
    useCompleteProjectPayoutMutation,
    useUpdateSubTaskMutation,
    useDeletePayoutMutation,
    useDeleteTaskMutation,
    useDeleteSubTaskMutation,
    useCreateBulkPayoutMutation,
} = projectApi;
