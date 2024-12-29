import { combineReducers } from '@reduxjs/toolkit';
import { userSignUpReducer } from './signup-request/sliceReducer';
import { signInByPasswordReducer } from './signin-request-by-password/sliceReducer';
import { socketEmitSigInJoinReducer } from './signin-join/sliceReducer';

const rootReducer =  (state:any, action:any) => {
    return combineReducers({
        signInByPasswordReducer,
        socketEmitSigInJoinReducer,
        userSignUpReducer,
    })(state, action);
  };

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
