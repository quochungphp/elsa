import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserSignUpPayloadDto } from '../../domain';
import { serverApi } from '../../resources/server-api';
import { ACTION_TYPE } from '../types';

export const postSignUp = createAsyncThunk(ACTION_TYPE.POST_SIGN_UP, async (payload: UserSignUpPayloadDto, thunkAPI) => {
    const response = await serverApi.userSignUp(payload);
    return response;
});
