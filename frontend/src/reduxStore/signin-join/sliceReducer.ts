/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';
import { RequestState, RequestStatus } from '../types';
import { SigninJoin } from '../../domain';
import { socketEmitSigInJoin } from './action';


export interface SignInJoinState extends RequestState {
    data: SigninJoin;
    isJoined: boolean;
}

export const initialState: SignInJoinState = {
    request: RequestStatus.idle,
    loading: false,
    data: <SigninJoin>{},
    isJoined: false,
};

export const socketEmitSigInJoinSlice = createSlice({
    name: 'socketEmitSigInJoin',
    initialState,
    reducers: {
        logout: (state) => {
            state.isJoined = false;
        },
    },
    extraReducers: (builder: any) => {
        builder.addCase(socketEmitSigInJoin.pending, (state: any) => {
            state.request = RequestStatus.requesting;
            state.loading = true;
        });
        builder.addCase(socketEmitSigInJoin.fulfilled, (state: any, { payload }: any) => {
            state.request = RequestStatus.success;
            state.loading = false;
            state.data = payload;
            if (payload.status && payload.status === 'success') {
                state.isJoined = true;
            } else {
                state.isJoined = false;
            }
        });
        builder.addCase(socketEmitSigInJoin.rejected, (state: any) => {
            state.request = RequestStatus.failed;
            state.loading = false;
        });
    },
});

export const socketEmitSigInJoinReducer = socketEmitSigInJoinSlice.reducer;
export const socketEmitSigInJoinSelector = (state: RootState) => state.socketEmitSigInJoinReducer;

export const { logout } = socketEmitSigInJoinSlice.actions;
