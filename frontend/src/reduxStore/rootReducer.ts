import { combineReducers } from '@reduxjs/toolkit';
import { userSignUpReducer } from './signup-request/sliceReducer';
import { signInByPasswordReducer } from './signin-request-by-password/sliceReducer';
import { fetchCommentReducer } from './comment/sliceReducer';

const rootReducer =  (state:any, action:any) => {
    return combineReducers({
        signInByPasswordReducer,
        userSignUpReducer,
        fetchCommentReducer,
    })(state, action);
  };

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
