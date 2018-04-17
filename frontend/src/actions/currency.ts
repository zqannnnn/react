import {currencyConsts} from '../constants';
import {currencyService} from '../services';
import {history} from '../helpers/history';
import * as auth from '../helpers/auth';
import {Currency} from '../models'
import {Dispatch} from 'react-redux'
import {ActionCreator} from 'redux'
import {ThunkAction} from 'redux-thunk'
import {RootState} from '../reducers'

export type Action = {
    type: string;
    error?: string;
    currencys?:Array < Currency >
}
type Thunk = ThunkAction<void, RootState, void>;

const getAll: ActionCreator<ThunkAction<void, RootState, void>> = () => {
    return ((dispatch: Dispatch<RootState>): void => {
        dispatch(request());
        currencyService
            .getAll()
            .then((currencys:Array < Currency >) => dispatch(success(currencys)), (error:string) => dispatch(failure(error)));
    });

    function request() : Action {
        return {type: currencyConsts.GET_REQUEST}
    }
    function success(currencys : Array < Currency >) : Action {
        return {type: currencyConsts.GET_SUCCESS, currencys}
    }
    function failure(error : string) : Action {
        return {type: currencyConsts.GET_FAILURE, error}
    }
}
export const actionCreators = {
    getAll
};