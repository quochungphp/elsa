import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer, { RootState } from './rootReducer';
import { loadState, saveState } from './localState';

const unauthorizedMiddleware = (store: any) => (next: any) => (action: any) => {
    // TODO: Logout
    return next(action);
};
// load local stage and map into redux store
const store = configureStore({
    reducer: rootReducer,
    preloadedState: loadState(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger, unauthorizedMiddleware),
});
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
