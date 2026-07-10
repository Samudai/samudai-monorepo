import * as PushAPI from '@pushprotocol/restapi';

export interface ChatSliceState {
    chatPGPKey?: string;
    chatUser?: PushAPI.IUser;
    chats?: PushAPI.IFeeds[];
}

export const initialState: ChatSliceState = {
    chatPGPKey: '',
    chatUser: undefined,
    chats: [],
};
