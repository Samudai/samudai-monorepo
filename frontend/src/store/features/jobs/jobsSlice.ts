import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Opportunity } from '@samudai_xyz/gateway-consumer-types';
import { RootState } from 'store/store';

const initialState: Opportunity[] = [] as Opportunity[];

export const jobsSlice = createSlice({
    name: 'jobsSlice',
    initialState,
    reducers: {
        addSingleJob: (state, action: PayloadAction<Opportunity>) => {
            state.push(action.payload);
        },
        addJobs: (state, action: PayloadAction<Opportunity[]>) => {
            state.push(...action.payload);
        },
    },
});

export const projectsList = (state: RootState) => state.projects;

export const { addSingleJob, addJobs } = jobsSlice.actions;

export default jobsSlice.reducer;
