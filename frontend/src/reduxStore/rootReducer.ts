import { combineReducers } from '@reduxjs/toolkit';
import { socketEmitSigInJoinReducer } from './signin-join/sliceReducer';

const rootReducer =  (state:any, action:any) => {
    return combineReducers({
        socketEmitSigInJoinReducer,
    })(state, action);
  };

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
