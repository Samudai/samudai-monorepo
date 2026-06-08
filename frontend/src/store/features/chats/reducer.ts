import * as PushAPI from '@pushprotocol/restapi';
import { PayloadAction } from '@reduxjs/toolkit';
import { ChatSliceState } from './state';

const reducers = {
    changeChatKey: (state: ChatSliceState, { payload }: PayloadAction<{ chatKey: string }>) => {
        state.chatPGPKey = payload.chatKey;
    },
    changeChatUser: (
        state: ChatSliceState,
        { payload }: PayloadAction<{ chatUser: PushAPI.IUser }>
    ) => {
        state.chatUser = payload.chatUser;
    },
    setChats: (state: ChatSliceState, { payload }: PayloadAction<{ chats: PushAPI.IFeeds[] }>) => {
        state.chats = payload.chats;
    },
};

export default reducers;
