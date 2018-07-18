import { authHeader } from '../helpers/auth'
import { Consignee } from '../models'
import { ListOptions } from '../models'
export const consigneeService = {
  new: _new
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

function handleResponse(response: Response) {
  if (!response.ok) {
    return response.json().then(result => Promise.reject(result.error))
  }

  return response.json()
}
