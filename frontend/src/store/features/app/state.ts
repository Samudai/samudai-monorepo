import Themes from 'root/data/Themes';

export interface AppSliceState {
    theme: Themes;
    sidebarActive: boolean;
    menuActive: boolean;
    extendedSidebarActive: boolean;
}

export const initialState: AppSliceState = {
    theme: Themes.DARK,
    sidebarActive: true,
    menuActive: false,
    extendedSidebarActive: false,
};
