import userConstants from '../constants/user';
import {userService} from '../services/user';
import {actionCreators as alertActions} from './alert';
import {history} from '../helpers/history';
import * as auth from '../helpers/auth';
export type AuthInfo = {
    id:string;
    token:string;
    isAdmin?:boolean
}
export const actionCreators = {
    login,
    logout,
    setAuth,
};
export type Action = {
    type: string;
    authInfo?:AuthInfo;
    error?:string;
}
function login(username:string, password:string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request());

        userService
            .login(username, password)
            .then((authInfo:AuthInfo) => {
                dispatch(success(authInfo));
            }, (error:string) => {
                dispatch(failure(error));
                dispatch(alertActions.error(error));
            });
    };

    function request() {
        return {type: userConstants.LOGIN_REQUEST}
    }
    function success(authInfo : AuthInfo) {
        return {type: userConstants.LOGIN_SUCCESS, authInfo}
    }
    function failure(error : string) {
        return {type: userConstants.LOGIN_FAILURE, error}
    }
}

function logout() {
    userService.logout();
    return {type: userConstants.LOGOUT};
}



function setAuth(authInfo : AuthInfo) {
    auth.setAuth(authInfo)
    return {type: userConstants.LOGIN_SUCCESS, authInfo}

}