import {lightboxConsts} from '../constants';
import {currencyService} from '../services';
import {history} from '../helpers/history';
import * as auth from '../helpers/auth';
import {Currency} from '../models'
import {Dispatch} from 'react-redux'
import {ActionCreator} from 'redux'
import {RootState} from '../reducers'

export type Action = {
    type: string;
    error?: string;
    images:string[];
    currentIdx:number
}

function open(images:string[],currentIdx:number) {
    return {type: lightboxConsts.OPEN, images,currentIdx}
}
function close() {
    return {type: lightboxConsts.CLOSE}
}
function prev() {
    return {type: lightboxConsts.PREV}
}
function next() {
    return {type: lightboxConsts.NEXT}
}
export const actionCreators = {
    open,
    close,
    prev,
    next
};