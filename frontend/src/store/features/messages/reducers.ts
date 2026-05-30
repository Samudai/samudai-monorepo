import { PayloadAction } from '@reduxjs/toolkit';
import { IFeedsNew, MessageSliceState, Mode } from './state';
import { GroupChannel } from '@sendbird/chat/groupChannel';

const reducers = {
    setOpenMessagePopup: (state: MessageSliceState, { payload }: PayloadAction<boolean>) => {
        state.openMessagePopup = payload;
    },
    setMode: (state: MessageSliceState, { payload }: PayloadAction<Mode>) => {
        state.mode = payload;
    },
    setActiveChat: (state: MessageSliceState, { payload }: PayloadAction<IFeedsNew>) => {
        state.activeChat = payload;
    },
    setActiveChannel: (state: MessageSliceState, { payload }: PayloadAction<GroupChannel>) => {
        state.activeChannel = payload;
    },
    setReloadChats: (state: MessageSliceState, { payload }: PayloadAction<boolean>) => {
        state.reloadChats = payload;
    },
    setSendBird: (state: MessageSliceState, { payload }: PayloadAction<any>) => {
        state.sendbird = payload;
    },
};

export default reducers;
