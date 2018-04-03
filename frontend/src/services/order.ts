import {authHeader} from '../helpers/auth';
import { Order } from '../models/order'
export const orderService = {
    new:_new,
    edit,
    getById,
    getAll,
    cancell
};
function _new(order:Order) {
    const requestOptions = {
        method: 'POST',
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    };
    return fetch('/order/new', requestOptions).then(handleResponse);
}
function edit(order:Order,orderId:string) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    };
    return fetch('/order/'+orderId, requestOptions).then(handleResponse);
}
function getById(id:string) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch('/order/' + id, requestOptions).then(handleResponse);
}
function cancell(id:string) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch('/order/' + id, requestOptions).then(handleResponse);
}
function getAll(option:{onlyMine:boolean}) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    if(option.onlyMine)
        return fetch('/order/list/my', requestOptions).then(handleResponse);
    else
        return fetch('/order/list/all', requestOptions).then(handleResponse);
}

function handleResponse(response:Response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}