import {userConsts} from '../constants';
import {userService} from '../services';
import {alertActionCreators } from '.';
import {history} from '../helpers/history';
import * as auth from '../helpers/auth';
import {User} from '../models'
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
            .then((user:User) => {
                dispatch(success(user));
                dispatch(alertActionCreators.success('Submit user successful'));
            }, (error:any) => {
                dispatch(failure(error));
                dispatch(alertActionCreators.error(error));
            });
    };

    function request(user : User) {
        return {type: userConsts.UPDATE_REQUEST}
    }
    function success(user : User) {
        return {type: userConsts.UPDATE_SUCCESS,user}
    }
    function failure(error : string) {
        return {type: userConsts.UPDATE_FAILURE, error}
    }
}
// prefixed function name with underscore because new is a reserved word in
function _new(user : User) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request(user));

        userService
            .new(user)
            .then((user:User) => {
                dispatch(success());
                dispatch(alertActionCreators.success('Create user successful'));
            }, (error:any) => {
                dispatch(failure(error));
                dispatch(alertActionCreators.error(error));
            });
    };

    function request(user : User) {
        return {type: userConsts.UPDATE_REQUEST, user}
    }
    function success() {
        return {type: userConsts.UPDATE_SUCCESS}
    }
    function failure(error : string) {
        return {type: userConsts.UPDATE_FAILURE, error}
    }
}

function lostPass(email:string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request());

        userService
            .lostPass(email)
            .then(() => {
                dispatch(alertActionCreators.success("If there is a corresponding account, then you'll receive an email with a link to change your password."));
                dispatch(success());
            }, error => {
                dispatch(alertActionCreators.error(error));
                dispatch(failure(error));
            });
    };

    function request() {
        return {type: userConsts.LOST_PASS_REQUEST}
    }
    function success() {
        return {type: userConsts.LOST_PASS_SUCCESS}
    }
    function failure(error : string) {
        return {type: userConsts.LOST_PASS_FAILURE, error}
    }
}
function resetPass(pass:string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request());

        userService
            .resetPass(pass)
            .then(() => {
                dispatch(alertActionCreators.success("Reset password successful."));
                dispatch(success());
            }, (error:any) => {
                dispatch(alertActionCreators.error(error));
                dispatch(failure(error));
            });
    };

    function request() {
        return {type: userConsts.RESET_PASS_REQUEST}
    }
    function success() {
        return {type: userConsts.RESET_PASS_SUCCESS}
    }
    function failure(error : string) {
        return {type: userConsts.RESET_PASS_FAILURE, error}
    }
}