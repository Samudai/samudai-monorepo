import { PayloadAction } from '@reduxjs/toolkit';
import { DiscussionSliceState } from './state';
import { DiscussionResponse, Message } from '@samudai_xyz/gateway-consumer-types';

const reducers = {
    updateBookmarkCount: (state: DiscussionSliceState, { payload }: PayloadAction<number>) => {
        state.bookmarkCount = payload;
    },
    updateBookmarkedDiscussions: (
        state: DiscussionSliceState,
        { payload }: PayloadAction<string[]>
    ) => {
        state.bookmarkedDiscussions = payload;
    },
    updateComments: (state: DiscussionSliceState, { payload }: PayloadAction<Message[]>) => {
        state.comments = payload;
    },
    updateTags: (state: DiscussionSliceState, { payload }: PayloadAction<string[]>) => {
        state.tags = payload;
    },
    updateDiscussions: (
        state: DiscussionSliceState,
        { payload }: PayloadAction<DiscussionResponse[]>
    ) => {
        state.discussions = payload;
    },
    changeOptIn: (state: DiscussionSliceState, { payload }: PayloadAction<boolean>) => {
        state.optIn = payload;
    },
};

export default reducers;
