/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../rootReducer';
import { initSlide } from '../initSlide';
import { fetchComment } from './action';
import { RequestState, RequestStatus } from '../types';
import { CommentResponseDto } from '../../domain';

export interface CommentState extends RequestState {
    data: CommentResponseDto[];
}

export const initialState: CommentState = {
    request: RequestStatus.idle,
    loading: false,
    data: [],
};
export const fetchCommentSlice = createSlice(initSlide(fetchComment, 'fetchComment', initialState));

export const fetchCommentReducer = fetchCommentSlice.reducer;
export const fetchCommentSelector = (state: RootState) => state.fetchCommentReducer;
