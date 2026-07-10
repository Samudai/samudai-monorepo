import { RootState } from 'store/store';
import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import reducers from './reducers';

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers,
});

export const messagePopup = (state: RootState) => state.messages.openMessagePopup;
export const mode = (state: RootState) => state.messages.mode;
export const currActiveChat = (state: RootState) => state.messages.activeChat;
export const currActiveChannel = (state: RootState) => state.messages.activeChannel;
export const reloadChats = (state: RootState) => state.messages.reloadChats;
export const selectSendbird = (state: RootState) => state.messages.sendbird;
export const {
    setOpenMessagePopup,
    setMode,
    setActiveChat,
    setReloadChats,
    setActiveChannel,
    setSendBird,
} = messageSlice.actions;
export default messageSlice.reducer;
