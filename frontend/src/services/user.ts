import { authHeader } from '../helpers/auth'
import { User } from '../models/user'
export const userService = {
  getById,
  update,
  delete: _delete,
  listUnconfirmedCompanies,
  confirm,
  disconfirm
}
function confirm(id: string) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch('/user/confirm/' + id, requestOptions).then(handleResponse)
}

function disconfirm(id: string) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch('/user/denie/' + id, requestOptions).then(handleResponse)
}

function listUnconfirmedCompanies() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch('/user/unconfirmed/list', requestOptions).then(handleResponse)
}

function getById(id: string) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch('/user/' + id, requestOptions).then(handleResponse)
}

function update(user: User) {
  const requestOptions = {
    method: 'PUT',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  }

  return fetch('/user/' + user.id, requestOptions).then(handleResponse)
}

// prefixed function name with underscore because delete is a reserved word in
// javascript
function _delete(id: string) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch('/user/' + id, requestOptions).then(handleResponse)
}
function handleResponse(response: Response) {
  if (!response.ok) {
    return response.json().then(result => Promise.reject(result.error))
  }

  return response.json()
}
