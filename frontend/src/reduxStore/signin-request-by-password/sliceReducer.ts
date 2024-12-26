/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';
import { RequestState, RequestStatus } from '../types';
import { UserResponseDto } from '../../domain';
import { postSignInByPassword } from './action';
import { ACCESS_TOKEN } from '../../utils/constants';

export interface SignInByPasswordState extends RequestState {
    data: UserResponseDto;
    isAuth: boolean;
}

export const initialState: SignInByPasswordState = {
    request: RequestStatus.idle,
    loading: false,
    data: <UserResponseDto>{},
    isAuth: false,
};

export const signInByPasswordSlice = createSlice({
    name: 'signInByPassword',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuth = false;
        },
    },
    extraReducers: (builder: any) => {
        builder.addCase(postSignInByPassword.pending, (state: any) => {
            state.request = RequestStatus.requesting;
            state.loading = true;
        });
        builder.addCase(postSignInByPassword.fulfilled, (state: any, { payload }: any) => {
            state.request = RequestStatus.success;
            state.loading = false;
            state.data = payload;
            if (payload.status && payload.status === 'success') {
                state.isAuth = true;
            } else {
                state.isAuth = false;
            }
        });
        builder.addCase(postSignInByPassword.rejected, (state: any) => {
            state.request = RequestStatus.failed;
            state.loading = false;
        });
    },
});

export const signInByPasswordReducer = signInByPasswordSlice.reducer;
export const signInByPasswordSelector = (state: RootState) => state.signInByPasswordReducer;

export const { logout } = signInByPasswordSlice.actions;
