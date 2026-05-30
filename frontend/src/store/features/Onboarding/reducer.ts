import { PayloadAction } from '@reduxjs/toolkit';
import { CommonSliceState, GuildStatus, discordData } from './state';

const reducers = {
    changeDiscordData: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ discord: discordData }>
    ) => {
        state.discord = { ...payload.discord };
    },
    changeSlectedDiscord: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ selectedDiscord: GuildStatus }>
    ) => {
        state.selectedDiscord = { ...payload.selectedDiscord };
    },
    changeTrailDashboard: (
        state: CommonSliceState,
        { payload }: PayloadAction<{ trial_dashboard: boolean }>
    ) => {
        state.trialDashboard = payload.trial_dashboard;
    },
    changeGoTo: (state: CommonSliceState, { payload }: PayloadAction<{ goTo?: number }>) => {
        state.goTo = payload.goTo;
    },
    changeScrollToFeatured: (state: CommonSliceState, { payload }: PayloadAction<boolean>) => {
        state.scrollToFeatured = payload;
    },
};

export default reducers;
