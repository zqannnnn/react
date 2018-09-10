import { authHeader } from '../helpers/auth'
//import { Transaction, ListOptions, Comment } from '../models'
export const chatService = {
    getAll,
}
function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }
    //let query = renderQuery(options)
    return fetch('/chat/users', requestOptions).then(
        handleResponse
    )
}

function handleResponse(response: Response) {
    if (!response.ok) {
        return response.json().then(result => Promise.reject(result.error))
    }

    return response.json()
}
