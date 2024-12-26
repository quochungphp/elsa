import { createAsyncThunk } from '@reduxjs/toolkit';
import { serverApi } from '../../resources/server-api';
import { ACTION_TYPE } from '../types';

export const postLogoutPassword = createAsyncThunk(ACTION_TYPE.POST_LOGOUT_PASSWORD, async (thunkAPI) => {
    const response = await serverApi.authLogout();
    return response;
});
