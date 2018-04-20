import {authHeader} from '../helpers/auth';
import {setAuth,removeAuth} from '../helpers/auth'
import {AuthInfo} from '../actions/auth'
import { User } from '../models/user';
export const userService = {
    login,
    logout,
    getById,
    new: _new,
    update,
    delete: _delete,
    lostPass,
    resetPass
};

function login(email:string, password:string) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    };
    return fetch('/login', requestOptions).then((response:Response) => {
        return response.ok
            ? response.json()
            : response
                .json()
                .then(err => Promise.reject(err.error))
    }).then((result: AuthInfo) => {
        // login successful if there's a jwt token in the response
        if (result ) {
            // store user details and jwt token in local storage to keep user logged in
            // between page refreshes
            setAuth(result);
            return result;
        }

        return {};
    });
}

function logout() {
    // remove user from local storage to log user out
    removeAuth();
}

function getById(id:string) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch('/user/' + id, requestOptions).then(handleResponse);
}

function _new(user:User) {
    const requestOptions = {
        method: 'POST',
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    };

    return fetch('/user/new', requestOptions).then(handleResponse);
}

function update(user:User) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    };

    return fetch('/user/' + user.id, requestOptions).then(handleResponse);;
}


// prefixed function name with underscore because delete is a reserved word in
// javascript
function _delete(id:string) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch('/user/' + id, requestOptions).then(handleResponse);;
}
function lostPass(email:string) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
    };
    return fetch('/pass/lost', requestOptions).then((response:Response) => {
        return response.ok
            ? response.json()
            : response
                .json()
                .then(err => Promise.reject(err.error))
    });
}
function resetPass(password:string) {
    const requestOptions = {
        method: 'POST',
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({password})
    };
    return fetch('/pass/reset', requestOptions).then(response => {
        return response.ok
            ? response.json()
            : response
                .json()
                .then(err => Promise.reject(err.error))
    }).then(result => {
        if (result && result.success) {
            return ;
        }

        return {};
    });
}
function handleResponse(response:Response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    }

    return response.json();
}