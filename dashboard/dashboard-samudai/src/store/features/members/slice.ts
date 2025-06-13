import { RootState } from 'store/store';
import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import reducers from './reducers';

export const memberSlice = createSlice({
    name: 'members',
    initialState,
    reducers,
});

export const membersDetail = (state: RootState) => state.members.membersDetail;
export const connectedMembersDetail = (state: RootState) => state.members.connectedMembersDetail;
export const { addMember, addMembers, addConnectedMembers } = memberSlice.actions;
export default memberSlice.reducer;
