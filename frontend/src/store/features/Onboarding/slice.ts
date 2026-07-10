import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import reducers from './reducer';
import { initialState } from './state';

export const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers,
});

export const selectDiscord = (state: RootState) => state.onboardingReducer.discord;
export const selectSelectedDiscord = (state: RootState) => state.onboardingReducer.selectedDiscord;
export const selectTrialDashboard = (state: RootState) => state.onboardingReducer.trialDashboard;
export const selectGoTo = (state: RootState) => state.onboardingReducer.goTo;
export const selectScrollFeatured = (state: RootState) => state.onboardingReducer.scrollToFeatured;

export const {
    changeDiscordData,
    changeSlectedDiscord,
    changeTrailDashboard,
    changeGoTo,
    changeScrollToFeatured,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
