import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store/store';
import reducers from './reducer';
import { initialState } from './state';

export const chatSlice = createSlice({
    name: 'chats',
    initialState,
    reducers,
});

export const selectChatKey = (state: RootState) => state.chatReducer.chatPGPKey;
export const selectChatUser = (state: RootState) => state.chatReducer.chatUser;
export const selectChats = (state: RootState) => state.chatReducer.chats;
export const { changeChatKey, changeChatUser, setChats } = chatSlice.actions;

export default chatSlice.reducer;
