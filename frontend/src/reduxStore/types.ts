export interface RequestState {
    request: RequestStatus;
    loading: boolean;
}

export enum RequestStatus {
    idle = 'idle',
    requesting = 'requesting',
    failed = 'failed',
    success = 'success',
}

export enum ACTION_TYPE {
    POST_SIGNIN_PASSWORD = 'POST_SIGNIN_PASSWORD',
    SOCKET_SIGNIN_JOIN = 'SOCKET_SIGNIN_JOIN',
    POST_LOGOUT_PASSWORD = 'POST_LOGOUT_PASSWORD',
    POST_SIGN_UP = 'POST_SIGN_UP',
    FETCH_COMMENT = 'FETCH_COMMENT',
}
