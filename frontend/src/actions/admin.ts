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
}
type Thunk = ThunkAction < void, RootState, void >;

// function finish(id : string) {
//     return (dispatch : (action : Action) => void) => {
//         dispatch(request(id));

//         orderService
//             .finish(id)
//             .then(() => dispatch(success(id)), (error:string) => dispatch(failure(error,id)));
//     };

//     function request(id:string) {
//         return {type: userConsts.FINISH_REQUEST,id}
//     }
//     function success(id:string) {
//         return {type: userConsts.FINISH_SUCCESS,id}
//     }
//     function failure(error : string,id:string) {
//         return {type: userConsts.FINISH_FAILURE, error,id}
//     }
// }
const listUnconfirmedCompanies : ActionCreator < ThunkAction < void,RootState,void >> = () => {
    return ((dispatch : Dispatch < RootState >) : void => {
        dispatch(request());
        userService
            .listUnconfirmedCompanies()
            .then((users : Array < User >) => dispatch(success(users)), (error : string) => dispatch(failure(error)));
    });

    function request() : Action {
        return {type: adminConsts.UNCONFIRMED_COMPANIES_REQUSET}
    }
    function success(unconfirmedCompanies : User []) : Action {
        unconfirmedCompanies.forEach(company=>company.itemType = "Company")
        return {type: adminConsts.UNCONFIRMED_COMPANIES_SUCCESS, unconfirmedCompanies}
    }
    function failure(error : string) : Action {
        return {type: adminConsts.UNCONFIRMED_COMPANIES_FAILURE, error}
    }
}
export const actionCreators = {
    listUnconfirmedCompanies
};