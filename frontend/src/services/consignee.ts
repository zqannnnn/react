import { authHeader } from '../helpers/auth'
import { Consignee } from '../models'
import { ListOptions } from '../models'
export const consigneeService = {
  new: _new,
  edit,
  delete: _delete
}
function _new(consignee: Consignee) {
  const requestOptions = {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(consignee)
  }
  return fetch('/consignee/new', requestOptions).then(handleResponse)
}

function edit(consignee: Consignee, id: string) {
  const requestOptions = {
    method: 'PUT',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(consignee)
  }
  return fetch('/consignee/' + id, requestOptions).then(handleResponse)
}

function _delete(consigneeId: string) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch('/consignee/' + consigneeId, requestOptions).then(handleResponse)
}

function handleResponse(response: Response) {
  if (!response.ok) {
    return response.json().then(result => Promise.reject(result.error))
  }

  return response.json()
}
