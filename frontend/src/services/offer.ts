import {authHeader} from '../helpers/auth';
import { Offer } from '../models'
export const offerService = {
    new:_new,
    edit,
    getById,
    getAll,
    cancell,
    finish,
    uploadImage
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
function getAll(option:{onlyMine:boolean}) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    if(option.onlyMine)
        return fetch('/offer/list/my', requestOptions).then(handleResponse);
    else
        return fetch('/offer/list/all', requestOptions).then(handleResponse);
}
function uploadImage(file:File) {
    const formData = new FormData();
    formData.append('image',file)
    const requestOptions = {
        method: 'POST',
        headers: {
            ...authHeader()
        },
        body: formData
    };
    return fetch('/upload/image', requestOptions).then(handleResponse);
}
function handleResponse(response:Response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}