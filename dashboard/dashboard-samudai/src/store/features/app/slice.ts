import { RootState } from 'store/store';
import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import reducers from './reducers';

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers,
});

export const selectApp = (state: RootState) => state.app;
export const selectMenu = (state: RootState) => state.app.menuActive;
export const { changeTheme, toggleSidebar, toggleExtendedSidebar, toggleMenu } = appSlice.actions;
export default appSlice.reducer;
