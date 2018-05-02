import {adminConsts} from '../constants';
import {userService} from '../services';
import {alertActionCreators} from '.';
import {history} from '../helpers/history';
import * as auth from '../helpers/auth';
import {User} from '../models'
import {Dispatch} from 'react-redux'
import {ActionCreator} from 'redux'
import {ThunkAction} from 'redux-thunk'
import {RootState} from '../reducers'

export type Action = {
    type: string;
    error?: string;
    unconfirmedCompanies?: User[];
    confirmingCompany?:User;
}
type Thunk = ThunkAction < void, RootState, void >;

function confirm(id : string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request());

        userService
            .confirm(id)
            .then(() => {
                dispatch(success())
                dispatch(alertActionCreators.success("Operation succeed"));
            }, (error:string) => {
                dispatch(failure(error))
                dispatch(alertActionCreators.error(error));
            }
        );
    };

    function request() {
        return {type: adminConsts.CONFIRM_COMPANY_REQUSET}
    }
    function success() {
        return {type: adminConsts.CONFIRM_COMPANY_SUCCESS}
    }
    function failure(error : string) {
        return {type: adminConsts.CONFIRM_COMPANY_FAILURE, error}
    }
}
function disconfirm(id : string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request());

        userService
            .disconfirm(id)
            .then(() => {dispatch(success())
                dispatch(alertActionCreators.success("Operation succeed"));
            }, (error:string) => {
                dispatch(failure(error))
                dispatch(alertActionCreators.error(error));
            });
    };

    function request() {
        return {type: adminConsts.DISCONFIRM_COMPANY_REQUSET}
    }
    function success() {
        return {type: adminConsts.DISCONFIRM_COMPANY_SUCCESS}
    }
    function failure(error : string) {
        return {type: adminConsts.DISCONFIRM_COMPANY_FAILURE, error}
    }
}
const listUnconfirmedCompanies : ActionCreator < ThunkAction < void,RootState,void >> = () => {
    return ((dispatch : Dispatch < RootState >) : void => {
        dispatch(request());
        userService
            .listUnconfirmedCompanies()
            .then((users : Array < User >) => dispatch(success(users)), (error : string) => dispatch(failure(error)));
    });

    function request() : Action {
        return {type: adminConsts.GET_UNCONFIRMED_COMPANIES_REQUSET}
    }
    function success(unconfirmedCompanies : User []) : Action {
        unconfirmedCompanies.forEach(company=>company.itemType = "Company")
        return {type: adminConsts.GET_UNCONFIRMED_COMPANIES_SUCCESS, unconfirmedCompanies}
    }
    function failure(error : string) : Action {
        return {type: adminConsts.GET_UNCONFIRMED_COMPANIES_FAILURE, error}
    }
}
const getConfirmingConpany : ActionCreator < ThunkAction < void,RootState,void >> = (id:string) => {
    return ((dispatch : Dispatch < RootState >) : void => {
        dispatch(request());
        userService
            .getById(id)
            .then((user : User) => dispatch(success(user)), (error : string) => dispatch(failure(error)));
    });

    function request() : Action {
        return {type: adminConsts.GET_CONFIRMING_COMPANY_REQUSET}
    }
    function success(confirmingCompany : User) : Action {
        return {type: adminConsts.GET_CONFIRMING_COMPANY_SUCCESS, confirmingCompany}
    }
    function failure(error : string) : Action {
        return {type: adminConsts.GET_CONFIRMING_COMPANY_FAILURE, error}
    }
}
export const actionCreators = {
    listUnconfirmedCompanies,
    getConfirmingConpany,
    confirm,
    disconfirm
};