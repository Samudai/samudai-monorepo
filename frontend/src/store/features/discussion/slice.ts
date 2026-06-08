import { RootState } from 'store/store';
import { createSlice } from '@reduxjs/toolkit';
import initialState from './state';
import reducers from './reducers';

export const discussionSlice = createSlice({
    name: 'app',
    initialState,
    reducers,
});

export const discussions = (state: RootState) => state.discussion.discussions;
export const bookmarkCount = (state: RootState) => state.discussion.bookmarkCount;
export const bookmarkedDiscussions = (state: RootState) => state.discussion.bookmarkedDiscussions;
export const comments = (state: RootState) => state.discussion.comments;
export const tags = (state: RootState) => state.discussion.tags;
export const optIn = (state: RootState) => state.discussion.optIn;
export const {
    updateBookmarkCount,
    updateBookmarkedDiscussions,
    updateComments,
    updateTags,
    updateDiscussions,
    changeOptIn,
} = discussionSlice.actions;
export default discussionSlice.reducer;
