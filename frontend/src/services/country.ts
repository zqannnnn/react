import { authHeader } from '../helpers/auth'
export const countryService = {
  getAll
}
function getAll() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch('/country/list', requestOptions).then(handleResponse)
}

function handleResponse(response: Response) {
  if (!response.ok) {
    return response.json().then(result => Promise.reject(result.error))
  }

  return response.json()
}
