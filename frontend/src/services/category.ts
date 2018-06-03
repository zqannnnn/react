import { authHeader } from '../helpers/auth'
export const categoryService = {
  getAll
}
function getAll() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch('/category', requestOptions).then(handleResponse)
}

function handleResponse(response: Response) {
  if (!response.ok) {
    return response.json().then(result => Promise.reject(result.error))
  }

  return response.json()
}
