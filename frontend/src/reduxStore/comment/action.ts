import { createAsyncThunk } from '@reduxjs/toolkit';
import { serverApi } from '../../resources/server-api';
import { ACTION_TYPE } from '../types';

export const fetchComment = createAsyncThunk(ACTION_TYPE.FETCH_COMMENT, async (query: any, thunkAPI) => {
    const response = await serverApi.fetchComment(query);
    return response;
});
