import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthSigninPayloadDto } from '../../domain';
import { serverApi } from '../../resources/server-api';
import { ACTION_TYPE } from '../types';

export const postSignInByPassword = createAsyncThunk(ACTION_TYPE.POST_SIGNIN_PASSWORD, async (payload: AuthSigninPayloadDto, thunkAPI) => {
    const response = await serverApi.authSignIn(payload);
    return response;
});
