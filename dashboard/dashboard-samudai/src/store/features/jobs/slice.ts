import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Task, Opportunity } from '@samudai_xyz/gateway-consumer-types';
import { RootState } from 'store/store';
import { fetchProjects } from './async';

// Temp slice

type UpdateItemType = {
    project_id: string;
    task: Task;
};

export interface JobsSliceState {
    data: Opportunity[];
    isLoading: boolean;
    dao: string;
}

const initialState: JobsSliceState = {
    data: [],
    isLoading: false,
    dao: '',
};

export const jobsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        updateItem: (state: JobsSliceState, { payload }: PayloadAction<UpdateItemType>) => {
            // state.data = state.data.map((project) => {
            //   if (project.project_id === payload.project_id) {
            //     project.tasks = project?.tasks?.map((task) => {
            //       if (task.task_id === payload.task.task_id) {
            //         return payload.task;
            //       }
            //       return task;
            //     });
            //   }
            //   return project;
            // });
        },
        updateInvestmentItem: (
            state: JobsSliceState,
            { payload }: PayloadAction<UpdateItemType>
        ) => {
            // const { project_id, task } = payload;
            // const projectIndex = state.data.findIndex((p) => p.project_id === project_id);
            // if (projectIndex === -1) {
            //   return state;
            // }
            // const taskIndex: any = state?.data?.[projectIndex]?.tasks?.findIndex(
            //   (t) => t.response_id === task.response_id
            // );
            // if (taskIndex === -1) {
            //   return state;
            // }
            // state.data = update(state.data, {
            //   [projectIndex]: {
            //     tasks: {
            //       $splice: [[taskIndex, 1, task]],
            //     },
            //   },
            // });
            // state.data = state.data.map((project) => {
            //   if (project.project_id === payload.project_id) {
            //     project.tasks = project?.tasks?.map((task) => {
            //       if (task.response_id === payload.task.response_id) {
            //         return payload.task;
            //       }
            //       return task;
            //     });
            //   }
            //   return project;
            // });
        },
        updateSelectDao: (state: JobsSliceState, { payload }: PayloadAction<string>) => {
            state.dao = payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProjects.pending, (state) => {
            state.isLoading = true;
            state.data = [];
        });
        // builder.addCase(fetchProjects.fulfilled, (state, action) => {
        //   state.isLoading = false;
        //   state.data = action.payload;
        // });
        builder.addCase(fetchProjects.rejected, (state) => {
            state.isLoading = false;
            state.data = [];
        });
    },
});

export const selectProjectById = (id: string) => (state: RootState) =>
    state.projects.data.find((project) => project.project_id === id);
export const selectProjects = (state: RootState) => state.projects;
export const selectDao = (state: RootState) => state.jobs.dao;
export const { updateItem, updateInvestmentItem, updateSelectDao } = jobsSlice.actions;
export default jobsSlice.reducer;
