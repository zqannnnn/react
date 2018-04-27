import {orderConsts} from '../constants';
import {orderService} from '../services';
import {alertActionCreators} from '.';
import {history} from '../helpers/history';
import * as auth from '../helpers/auth';
import {Order} from '../models'
import {Dispatch} from 'react-redux'
import {ActionCreator} from 'redux'
import {ThunkAction} from 'redux-thunk'
import {RootState} from '../reducers'

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
                dispatch(alertActionCreators.success('Create order successful'));
            }, (error : string) => {
                dispatch(failure(error));
                dispatch(alertActionCreators.error(error));
            });
    })
    function request() : Action {
        return {type: orderConsts.CREATE_REQUEST}
    }
    function success() : Action {
        return {type: orderConsts.CREATE_SUCCESS}
    }
    function failure(error : string) : Action {
        return {type: orderConsts.CREATE_FAILURE, error}
    }
}
const edit : ActionCreator < ThunkAction < void, RootState, void >> = (order : Order, orderId:string) =>{
    return ((dispatch : Dispatch < RootState >) : void => {
        dispatch(request());

        orderService
            .edit(order,orderId)
            .then(() => {
                dispatch(success());
                dispatch(alertActionCreators.success('Edit order successful'));
            }, (error : string) => {
                dispatch(failure(error));
                dispatch(alertActionCreators.error(error));
            });
    })
    function request() : Action {
        return {type: orderConsts.EDIT_REQUEST}
    }
    function success() : Action {
        return {type: orderConsts.EDIT_SUCCESS}
    }
    function failure(error : string) : Action {
        return {type: orderConsts.EDIT_FAILURE, error}
    }
}
function getById(id : string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request());

        orderService
            .getById(id)
            .then((order:any) => dispatch(success(order)), (error:any) => dispatch(failure(error)));
    };

    function request() {
        return {type: orderConsts.GET_REQUEST}
    }
    function success(order : Order) {
        return {type: orderConsts.GET_SUCCESS, data: order}
    }
    function failure(error : string) {
        return {type: orderConsts.GET_FAILURE, error}
    }
}
function cancell(id : string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request(id));

        orderService
            .cancell(id)
            .then(() => dispatch(success(id)), (error:any) => dispatch(failure(error,id)));
    };
    function request(id:string) {
        return {type: orderConsts.CANCELL_REQUEST,id}
    }
    function success(id:string) {
        return {type: orderConsts.CANCELL_SUCCESS,id}
    }
    function failure(error : string,id:string) {
        return {type: orderConsts.CANCELL_FAILURE, error,id}
    }
}
function finish(id : string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request(id));

        orderService
            .finish(id)
            .then(() => dispatch(success(id)), (error:string) => dispatch(failure(error,id)));
    };

    function request(id:string) {
        return {type: orderConsts.FINISH_REQUEST,id}
    }
    function success(id:string) {
        return {type: orderConsts.FINISH_SUCCESS,id}
    }
    function failure(error : string,id:string) {
        return {type: orderConsts.FINISH_FAILURE, error,id}
    }
}
const getAll : ActionCreator < ThunkAction < void,RootState,void >> = (option:{selectType:string}) => {
    return ((dispatch : Dispatch < RootState >) : void => {
        dispatch(request());
        orderService
            .getAll(option)
            .then((orders : Array < Order >) => dispatch(success(orders)), (error : string) => dispatch(failure(error)));
    });

    function request() : Action {
        return {type: orderConsts.GETALL_REQUEST}
    }
    function success(orders : Array < Order >) : Action {
        orders.forEach(order=>order.itemType="Order")
        return {type: orderConsts.GETALL_SUCCESS, orders}
    }
    function failure(error : string) : Action {
        return {type: orderConsts.GETALL_FAILURE, error}
    }
}
export const actionCreators = {
    new: _new,
    edit,
    getAll,
    getById,
    cancell,
    finish
};