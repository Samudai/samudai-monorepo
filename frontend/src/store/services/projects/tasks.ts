import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import store from 'store/store';
import {
    assignTask,
    createSubTaskReq,
    getSubTaskByIdResponse,
    getTaskByTaskIdResponse,
    getTasksFormByProjectIdResponse,
    taskUpdateReq,
    updatePayout,
    updateSubTaskReq,
} from './model';

export const tasksApi = createApi({
    reducerPath: 'tasksApi',
    tagTypes: ['Task', 'Project', 'Subtask'],
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_GATEWAY,
        prepareHeaders: (headers) => {
            const taskid = localStorage.getItem('_taskid') || store.getState().commonReducer.taskid;
            const projectid =
                localStorage.getItem('_projectid') || store.getState().commonReducer.projectid;
            headers.set('authorization', `Bearer ${localStorage.getItem('jwt')}`);
            headers.set('daoId', store.getState().commonReducer.activeDao);
            headers.set('projectid', projectid);
            headers.set('taskid', taskid);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // getProjectAccess: builder.query<getAccessResponse, string>({
        //   query: (id) => `/api/projectaccess/get/${id}`,
        // }),

        getTaskDetails: builder.query<getTaskByTaskIdResponse, string>({
            query: (id) => `/api/task/${id}`,
            providesTags: ['Task'],
        }),
        getTaskForForm: builder.query<getTasksFormByProjectIdResponse, string>({
            query: (id) => `/api/taskformresponse/get/project/${id}`,

            // providesTags: ['Task'],
        }),
        updateTask: builder.mutation<any, taskUpdateReq>({
            query: (body) => ({
                url: `/api/task/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task'],
        }),
        updatePayout: builder.mutation<any, updatePayout>({
            query: (body) => ({
                url: `/api/task/update/payout`,
                method: 'POST',
                body,
            }),
        }),
        createSubTask: builder.mutation<any, createSubTaskReq>({
            query: (body) => ({
                url: `/api/subtask/create`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task', 'Subtask'],
        }),
        updateSubTask: builder.mutation<any, updateSubTaskReq>({
            query: (body) => ({
                url: `/api/subtask/update/status`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task', 'Subtask'],
        }),
        assignTask: builder.mutation<any, assignTask>({
            query: (body) => ({
                url: `/api/task/assign`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task', 'Subtask'],
        }),
        deleteSubTask: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/subtask/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Task', 'Subtask'],
        }),
        deleteTask: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/task/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Task', 'Subtask'],
        }),
        getSubTaskDetails: builder.query<getSubTaskByIdResponse, string>({
            query: (id) => `/api/subtask/${id}`,
            // providesTags: ['Task'],
        }),
    }),
});

export const {
    useCreateSubTaskMutation,
    useGetTaskDetailsQuery,
    useLazyGetTaskDetailsQuery,
    useUpdateSubTaskMutation,
    useDeleteSubTaskMutation,
    useAssignTaskMutation,
    useGetTaskForFormQuery,
    useLazyGetTaskForFormQuery,
    useDeleteTaskMutation,
    useUpdatePayoutMutation,
    useLazyGetSubTaskDetailsQuery,
    useUpdateTaskMutation,
} = tasksApi;
