import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import { IUser } from 'utils/types/User';
import { fetchUser } from './async';

export type UserSliceState = {
    data: IUser | null;
};

const initialState = {
    data: null,
} as UserSliceState;

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userLogout(state) {
            state.data = null;
        },
        userToggleJobs(state) {
            if (state.data) {
                state.data.open_for_jobs = !state.data.open_for_jobs;
            }
        },
        userTogglePrivate(state) {
            if (state.data) {
                state.data.private = !state.data.private;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, { payload }: PayloadAction<IUser>) => {
            state.data = payload;
        });
        builder.addCase(fetchUser.rejected, (state) => {
            state.data = null;
        });
    },
});

export const selectUser = (state: RootState) => state.user;
export const selectUserData = (state: RootState) => state.user.data;
export const { userLogout, userToggleJobs, userTogglePrivate } = userSlice.actions;

export default userSlice.reducer;
