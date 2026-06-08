import { PayloadAction } from '@reduxjs/toolkit';
import Themes from 'root/data/Themes';
import { AppSliceState } from './state';

const reducers = {
    changeTheme: (state: AppSliceState, { payload }: PayloadAction<Themes>) => {
        state.theme = payload;
    },
    toggleExtendedSidebar: (
        state: AppSliceState,
        { payload }: PayloadAction<boolean | undefined>
    ) => {
        if (payload !== undefined) {
            state.extendedSidebarActive = payload;
        } else {
            state.extendedSidebarActive = !state.extendedSidebarActive;
        }
    },
    toggleSidebar: (state: AppSliceState, { payload }: PayloadAction<boolean>) => {
        state.sidebarActive = payload;
    },
    toggleMenu: (state: AppSliceState, { payload }: PayloadAction<boolean>) => {
        state.menuActive = payload;
    },
};

export default reducers;
