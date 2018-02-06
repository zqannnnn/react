import {authHeader} from '../helpers/auth';
export const categoryService = {
    getAll
};
function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch('/category', requestOptions).then(handleResponse);
}

function handleResponse(response:Response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}