import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockup_users as data } from 'root/mockup/users';

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    return data[0];
});
