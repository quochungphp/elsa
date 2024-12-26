import { RequestStatus } from './types';

export const initSlide = <T>(action: any, slideName: string, initialState: T) => {
    return {
        name: slideName,
        initialState,
        reducers: {},
        extraReducers: (builder: any) => {
            builder.addCase(action.pending, (state: any) => {
                state.request = RequestStatus.requesting;
                state.loading = true;
            });
            builder.addCase(action.fulfilled, (state: any, { payload }: any) => {
                state.request = RequestStatus.success;
                state.loading = false;
                state.data = payload;
            });
            builder.addCase(action.rejected, (state: any) => {
                state.request = RequestStatus.failed;
                state.loading = false;
            });
        },
    };
};
