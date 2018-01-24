import categoryConstants from '../constants/category';
import {categoryService} from '../services/category';
import {actionCreators as alertActions} from './alert';
import {history} from '../helpers/history';
import * as auth from '../helpers/auth';
import {Entity as Category } from '../models/category'
import {Dispatch} from 'react-redux'
import {ActionCreator} from 'redux'
import {ThunkAction} from 'redux-thunk'
import {RootState} from '../reducers/index'

export type Action = {
    type: string;
    error?: string;
    categorys?:Array < Category >
}
type Thunk = ThunkAction<void, RootState, void>;

const getAll: ActionCreator<ThunkAction<void, RootState, void>> = () => {
    return ((dispatch: Dispatch<RootState>): void => {
        dispatch(request());
        categoryService
            .getAll()
            .then((categorys:Array < Category >) => dispatch(success(categorys)), (error:string) => dispatch(failure(error)));
    });

    function request() : Action {
        return {type: categoryConstants.GET_REQUEST}
    }
    function success(categorys : Array < Category >) : Action {
        return {type: categoryConstants.GET_SUCCESS, categorys}
    }
    function failure(error : string) : Action {
        return {type: categoryConstants.GET_FAILURE, error}
    }
}
export const actionCreators = {
    getAll
};