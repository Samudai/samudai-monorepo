import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import reducers from './reducers';
import initialState from './state';

export const daoSlice = createSlice({
    name: 'dao',
    initialState,
    reducers,
});

// Selectors
export const selectDao = (state: RootState) => state.dao;
export const selectDaoViews = (state: RootState) => state.dao.views;
export const selectActiveViewId = (state: RootState) => state.dao.activeViewId;
export const selectDaoViewActive = (state: RootState) =>
    state.dao.views.find((view) => view.id === state.dao.activeViewId)!;

// Actions
export const {
    addView, // To add a new view to an empty array of views
    appendView, // To add to an existing array of views
    addViews, // To append an array of views
    updateView,
    removeView,
    changeActiveView,
    toggleActiveView,
    toggleActiveWidget,
    togglePrivateView,
    updateLayoutView,
} = daoSlice.actions;

export default daoSlice.reducer;
