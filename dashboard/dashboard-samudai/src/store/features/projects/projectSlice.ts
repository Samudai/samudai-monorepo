import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Project } from '@samudai_xyz/gateway-consumer-types';
import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import { RootState } from 'store/store';
import { initialState, ProjectSliceState } from './state';
import { IPayoutRequest } from 'store/services/projects/model';

export const projectSlice = createSlice({
    name: 'projectSlice',
    initialState,
    reducers: {
        addSingleProject: (state: ProjectSliceState, action: PayloadAction<Project>) => {
            state.projects.unshift(action.payload);
        },
        addProjects: (state: ProjectSliceState, action: PayloadAction<ProjectResponse[]>) => {
            state.projects = [...action.payload];
        },
        updatePinnedProject: (
            state: ProjectSliceState,
            { payload }: PayloadAction<{ pinned: boolean; project_id: string }>
        ) => {
            const objIndex = state.projects.findIndex(
                (obj) => obj.project_id === payload.project_id
            );
            state.projects[objIndex].pinned = payload.pinned;
        },
        updateProject: (state: ProjectSliceState, { payload }: PayloadAction<ProjectResponse>) => {
            const objIndex = state.projects.findIndex(
                (obj) => obj.project_id === payload.project_id
            );
            state.projects[objIndex] = payload;
        },
        updatePayoutList: (
            state: ProjectSliceState,
            { payload }: PayloadAction<IPayoutRequest[]>
        ) => {
            state.payouts = payload;
        },
        updateProjectDaoId: (state: ProjectSliceState, { payload }: PayloadAction<string>) => {
            state.projectDaoId = payload;
        },
    },
});

export const projectsList = (state: RootState) => state.projectsSlice.projects;
export const payoutsList = (state: RootState) => state.projectsSlice.payouts;
export const projectDaoId = (state: RootState) => state.projectsSlice.projectDaoId;

export const {
    addSingleProject,
    addProjects,
    updatePinnedProject,
    updateProject,
    updatePayoutList,
    updateProjectDaoId,
} = projectSlice.actions;

export default projectSlice.reducer;
