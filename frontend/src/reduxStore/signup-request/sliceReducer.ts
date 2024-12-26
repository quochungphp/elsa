/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { RootState } from '../rootReducer';
import { RequestState, RequestStatus } from '../types';
import { UserResponseDto } from '../../domain';
import { postSignUp } from './action';

export interface UserSignUpState extends RequestState {
    data: UserResponseDto;
}

export const initialState: UserSignUpState = {
    request: RequestStatus.idle,
    loading: false,
    data: <UserResponseDto>{},
};

export const userSignUpSlice = createSlice({
    name: 'userSignUp',
    initialState,
    reducers: {},
    extraReducers: (builder: any) => {
        builder.addCase(postSignUp.pending, (state: any) => {
            state.request = RequestStatus.requesting;
            state.loading = true;
        });
        builder.addCase(postSignUp.fulfilled, (state: any, { response }: any) => {
            state.request = RequestStatus.success;
            state.loading = false;
            state.data =  {
                response,
                status : "success"
            };
        });
        builder.addCase(postSignUp.rejected, (state: any) => {
            state.request = RequestStatus.failed;
            state.loading = false;
        });
    },
});

export const userSignUpReducer = userSignUpSlice.reducer;
export const userSignUpSelector = (state: RootState) => state.userSignUpReducer;
