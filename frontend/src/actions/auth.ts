import {userConsts} from '../constants';
import {userService} from '../services/user';
import {alertActionCreators} from '.';
import {history} from '../helpers/history';
import * as auth from '../helpers/auth';
export type AuthInfo = {
    id: string;
    token: string;
    isAdmin?: boolean
}
export const actionCreators = {
    login,
    logout,
    setAuth
};
export type Action = {
    type: string;
    authInfo?: AuthInfo;
    error?: string;
}
function login(username : string, password : string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request());

        userService
            .login(username, password)
            .then((authInfo : AuthInfo) => {
                dispatch(success(authInfo));
            }, (error : string) => {
                dispatch(failure(error));
                dispatch(alertActionCreators.error(error));
            });
    };

    function request() {
        return {type: userConsts.LOGIN_REQUEST}
    }
    function success(authInfo : AuthInfo) {
        return {type: userConsts.LOGIN_SUCCESS, authInfo}
    }
    function failure(error : string) {
        return {type: userConsts.LOGIN_FAILURE, error}
    }
}

function logout() {
    userService.logout();
    return {type: userConsts.LOGOUT};
}

function setAuth(authInfo : AuthInfo) {
    auth.setAuth(authInfo)
    return {type: userConsts.LOGIN_SUCCESS, authInfo}

}