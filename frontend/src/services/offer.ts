import {authHeader} from '../helpers/auth';
import { Offer } from '../models'
export const offerService = {
    new:_new,
    edit,
    getById,
    getAll,
    cancell,
    finish,
    addComment
};
function _new(offer:Offer) {
    const requestOptions = {
        method: 'POST',
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(offer)
    };
    return fetch('/offer/new', requestOptions).then(handleResponse);
}
function edit(offer:Offer,offerId:string) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(offer)
    };
    return fetch('/offer/'+offerId, requestOptions).then(handleResponse);
}
function getById(id:string) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch('/offer/' + id, requestOptions).then(handleResponse);
}
function cancell(id:string) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch('/offer/' + id, requestOptions).then(handleResponse);
}
function finish(id:string) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch('/offer/finish/' + id, requestOptions).then(handleResponse);
}
function addComment(id:string, comment:string) {
    const requestOptions = {
        method: 'POST',
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({comment})
    };

    return fetch('/offer/comment/' + id, requestOptions).then(handleResponse);
}
function getAll(option:{selectType:string}) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch('/offer/list?selectType='+option.selectType, requestOptions).then(handleResponse);
}

function handleResponse(response:Response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}