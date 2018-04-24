import {offerConsts} from '../constants';
import {offerService} from '../services';
import {alertActionCreators} from '.';
import {history} from '../helpers/history';
import * as auth from '../helpers/auth';
import {Offer} from '../models'
import {Dispatch} from 'react-redux'
import {ActionCreator} from 'redux'
import {ThunkAction} from 'redux-thunk'
import {RootState} from '../reducers'

export type Action = {
    type: string;
    error?: string;
    id?:string;
    offers?: Array < Offer >;
    data?: Offer;
    imagePath?:string;
}
type Thunk = ThunkAction < void, RootState, void >;

// prefixed function name with underscore because new is a reserved word in
const _new : ActionCreator < ThunkAction < void, RootState, void >> = (offer : Offer) =>{
    return ((dispatch : Dispatch < RootState >) : void => {
        dispatch(request());

        offerService
            .new(offer)
            .then((offer : Offer) => {
                dispatch(success());
                dispatch(alertActionCreators.success('Create offer successful'));
            }, (error : string) => {
                dispatch(failure(error));
                dispatch(alertActionCreators.error(error));
            });
    })
    function request() : Action {
        return {type: offerConsts.CREATE_REQUEST}
    }
    function success() : Action {
        return {type: offerConsts.CREATE_SUCCESS}
    }
    function failure(error : string) : Action {
        return {type: offerConsts.CREATE_FAILURE, error}
    }
}
const edit : ActionCreator < ThunkAction < void, RootState, void >> = (offer : Offer, offerId:string) =>{
    return ((dispatch : Dispatch < RootState >) : void => {
        dispatch(request());

        offerService
            .edit(offer,offerId)
            .then(() => {
                dispatch(success());
                dispatch(alertActionCreators.success('Edit offer successful'));
            }, (error : string) => {
                dispatch(failure(error));
                dispatch(alertActionCreators.error(error));
            });
    })
    function request() : Action {
        return {type: offerConsts.EDIT_REQUEST}
    }
    function success() : Action {
        return {type: offerConsts.EDIT_SUCCESS}
    }
    function failure(error : string) : Action {
        return {type: offerConsts.EDIT_FAILURE, error}
    }
}
function getById(id : string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request());

        offerService
            .getById(id)
            .then((offer:Offer) => dispatch(success(offer)), (error:string) => dispatch(failure(error)));
    };

    function request() {
        return {type: offerConsts.GET_REQUEST}
    }
    function success(offer : Offer) {
        return {type: offerConsts.GET_SUCCESS, data: offer}
    }
    function failure(error : string) {
        return {type: offerConsts.GET_FAILURE, error}
    }
}
function cancell(id : string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request(id));

        offerService
            .cancell(id)
            .then(() => dispatch(success(id)), (error:string) => dispatch(failure(error,id)));
    };

    function request(id:string) {
        return {type: offerConsts.CANCELL_REQUEST,id}
    }
    function success(id:string) {
        return {type: offerConsts.CANCELL_SUCCESS,id}
    }
    function failure(error : string,id:string) {
        return {type: offerConsts.CANCELL_FAILURE, error,id}
    }
}
function finish(id : string) {
    return (dispatch : (action : Action) => void) => {
        dispatch(request(id));

        offerService
            .finish(id)
            .then(() => dispatch(success(id)), (error:string) => dispatch(failure(error,id)));
    };

    function request(id:string) {
        return {type: offerConsts.FINISH_REQUEST,id}
    }
    function success(id:string) {
        return {type: offerConsts.FINISH_SUCCESS,id}
    }
    function failure(error : string,id:string) {
        return {type: offerConsts.FINISH_FAILURE, error,id}
    }
}
const getAll : ActionCreator < ThunkAction < void,RootState,void >> = (option:{selectType:string}) => {
    return ((dispatch : Dispatch < RootState >) : void => {
        dispatch(request());
        offerService
            .getAll(option)
            .then((offers : Array < Offer >) => dispatch(success(offers)), (error : string) => dispatch(failure(error)));
    });

    function request() : Action {
        return {type: offerConsts.GETALL_REQUEST}
    }
    function success(offers : Array < Offer >) : Action {
        return {type: offerConsts.GETALL_SUCCESS, offers}
    }
    function failure(error : string) : Action {
        return {type: offerConsts.GETALL_FAILURE, error}
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