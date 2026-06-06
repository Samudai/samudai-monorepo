import { DiscussionResponse, MessageResponse } from '@samudai_xyz/gateway-consumer-types';

export interface DiscussionSliceState {
    bookmarkCount: number;
    bookmarkedDiscussions: string[];
    comments: MessageResponse[];
    tags: string[];
    discussions: DiscussionResponse[];
    optIn: boolean;
}

const initialState: DiscussionSliceState = {
    bookmarkCount: 0,
    bookmarkedDiscussions: [],
    comments: [],
    tags: [],
    discussions: [],
    optIn: false,
};

export default initialState;
