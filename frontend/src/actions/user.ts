import userConstants from '../constants/user';
import {userService} from '../services/user';
import {actionCreators as alertActions} from './alert';
import {history} from '../helpers/history';
import * as auth from '../helpers/auth';
import {UserEntity as User} from '../models/user'
export const actionCreators = {
    update,
    new:_new,
    lostPass,
    resetPass
};
export type Action = {
    type: string;
    user?:User;
    error?:string;
    id?:string;
}

function update(user:User,userId:string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request(user));

        userService
            .update(user,userId)
            .then(user => {
                dispatch(success(user));
                dispatch(alertActions.success('Submit user successful'));
            }, error => {
                dispatch(failure(error));
                dispatch(alertActions.error(error));
            });
    };

    function request(user : User) {
        return {type: userConstants.UPDATE_REQUEST}
    }
    function success(user : User) {
        return {type: userConstants.UPDATE_SUCCESS,user}
    }
    function failure(error : string) {
        return {type: userConstants.UPDATE_FAILURE, error}
    }
}
// prefixed function name with underscore because new is a reserved word in
function _new(user : User) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request(user));

        userService
            .new(user)
            .then(user => {
                dispatch(success());
                dispatch(alertActions.success('Create user successful'));
            }, error => {
                dispatch(failure(error));
                dispatch(alertActions.error(error));
            });
    };

    function request(user : User) {
        return {type: userConstants.UPDATE_REQUEST, user}
    }
    function success() {
        return {type: userConstants.UPDATE_SUCCESS}
    }
    function failure(error : string) {
        return {type: userConstants.UPDATE_FAILURE, error}
    }
}

function lostPass(email:string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request());

        userService
            .lostPass(email)
            .then(() => {
                dispatch(alertActions.success("If there is a corresponding account, then you'll receive an email with a link to change your password."));
                dispatch(success());
            }, error => {
                dispatch(alertActions.error(error));
                dispatch(failure(error));
            });
    };

    function request() {
        return {type: userConstants.LOST_PASS_REQUEST}
    }
    function success() {
        return {type: userConstants.LOST_PASS_SUCCESS}
    }
    function failure(error : string) {
        return {type: userConstants.LOST_PASS_FAILURE, error}
    }
}
function resetPass(pass:string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request());

        userService
            .resetPass(pass)
            .then(() => {
                dispatch(alertActions.success("Reset password successful."));
                dispatch(success());
            }, error => {
                dispatch(alertActions.error(error));
                dispatch(failure(error));
            });
    };

    function request() {
        return {type: userConstants.RESET_PASS_REQUEST}
    }
    function success() {
        return {type: userConstants.RESET_PASS_SUCCESS}
    }
    function failure(error : string) {
        return {type: userConstants.RESET_PASS_FAILURE, error}
    }
}