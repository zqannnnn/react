import orderConstants from '../constants/order';
import {orderService} from '../services/order';
import {actionCreators as alertActions} from './alert';
import {history} from '../helpers/history';
import * as auth from '../helpers/auth';
import {Order} from '../models/order'
import {Dispatch} from 'react-redux'
import {ActionCreator} from 'redux'
import {ThunkAction} from 'redux-thunk'
import {RootState} from '../reducers/index'

export type Action = {
    type: string;
    error?: string;
    id?:string;
    orders?: Array < Order >;
    data?: Order;
}
type Thunk = ThunkAction < void, RootState, void >;

// prefixed function name with underscore because new is a reserved word in
const _new : ActionCreator < ThunkAction < void, RootState, void >> = (order : Order) =>{
    return ((dispatch : Dispatch < RootState >) : void => {
        dispatch(request());

        orderService
            .new(order)
            .then((order : Order) => {
                dispatch(success());
                dispatch(alertActions.success('Create order successful'));
            }, (error : string) => {
                dispatch(failure(error));
                dispatch(alertActions.error(error));
            });
    })
    function request() : Action {
        return {type: orderConstants.CREATE_REQUEST}
    }
    function success() : Action {
        return {type: orderConstants.CREATE_SUCCESS}
    }
    function failure(error : string) : Action {
        return {type: orderConstants.CREATE_FAILURE, error}
    }
}
const edit : ActionCreator < ThunkAction < void, RootState, void >> = (order : Order, orderId:string) =>{
    return ((dispatch : Dispatch < RootState >) : void => {
        dispatch(request());

        orderService
            .edit(order,orderId)
            .then(() => {
                dispatch(success());
                dispatch(alertActions.success('Edit order successful'));
            }, (error : string) => {
                dispatch(failure(error));
                dispatch(alertActions.error(error));
            });
    })
    function request() : Action {
        return {type: orderConstants.EDIT_REQUEST}
    }
    function success() : Action {
        return {type: orderConstants.EDIT_SUCCESS}
    }
    function failure(error : string) : Action {
        return {type: orderConstants.EDIT_FAILURE, error}
    }
}
function getById(id : string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request());

        orderService
            .getById(id)
            .then(order => dispatch(success(order)), error => dispatch(failure(error)));
    };

    function request() {
        return {type: orderConstants.GET_REQUEST}
    }
    function success(order : Order) {
        return {type: orderConstants.GET_SUCCESS, data: order}
    }
    function failure(error : string) {
        return {type: orderConstants.GET_FAILURE, error}
    }
}
function cancell(id : string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request(id));

        orderService
            .cancell(id)
            .then(() => dispatch(success(id)), error => dispatch(failure(error,id)));
    };

    function request(id:string) {
        return {type: orderConstants.CANCELL_REQUEST,id}
    }
    function success(id:string) {
        return {type: orderConstants.CANCELL_SUCCESS,id}
    }
    function failure(error : string,id:string) {
        return {type: orderConstants.CANCELL_FAILURE, error,id}
    }
}
const getAll : ActionCreator < ThunkAction < void,RootState,void >> = () => {
    return ((dispatch : Dispatch < RootState >) : void => {
        dispatch(request());
        orderService
            .getAll()
            .then((orders : Array < Order >) => dispatch(success(orders)), (error : string) => dispatch(failure(error)));
    });

    function request() : Action {
        return {type: orderConstants.GETALL_REQUEST}
    }
    function success(orders : Array < Order >) : Action {
        return {type: orderConstants.GETALL_SUCCESS, orders}
    }
    function failure(error : string) : Action {
        return {type: orderConstants.GETALL_FAILURE, error}
    }
}
export const actionCreators = {
    new: _new,
    edit,
    getAll,
    getById,
    cancell
};