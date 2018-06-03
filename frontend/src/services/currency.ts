export const currencyService = {
  getAll
}
function getAll() {
  const requestOptions = {
    method: 'GET'
  }
  return fetch('/currency/list', requestOptions).then(handleResponse)
}

function handleResponse(response: Response) {
  if (!response.ok) {
    return response.json().then(result => Promise.reject(result.error))
  }

  return response.json()
}
