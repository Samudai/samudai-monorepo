import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import reducers from './reducers';
import initialState from './state';

export const popupSlice = createSlice({
    name: 'popups',
    initialState,
    reducers,
});

export const selectPopups = (state: RootState) => state.popups;
export const selectPopupsActive = (state: RootState) => state.popups.active;

export const { incrementPopup, decrementPopup, taskAddToggle, editProfileToggle } =
    popupSlice.actions;

export default popupSlice.reducer;
