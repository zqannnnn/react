import { authHeader } from '../helpers/auth'
import { Transaction } from '../models'
import { ListOptions } from '../models'
export const transService = {
  new: _new,
  edit,
  getById,
  getAll,
  cancell,
  finish,
  addComment
}
function _new(transaction: Transaction) {
  const requestOptions = {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  }
  return fetch('/transaction/new', requestOptions).then(handleResponse)
}
function edit(transaction: Transaction, transactionId: string) {
  const requestOptions = {
    method: 'PUT',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  }
  return fetch('/transaction/' + transactionId, requestOptions).then(
    handleResponse
  )
}
function getById(id: string) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch('/transaction/' + id, requestOptions).then(handleResponse)
}
function cancell(id: string) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch('/transaction/' + id, requestOptions).then(handleResponse)
}
function finish(id: string) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch('/transaction/finish/' + id, requestOptions).then(handleResponse)
}
function addComment(id: string, comment: string) {
  const requestOptions = {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ comment })
  }

  return fetch('/transaction/comment/' + id, requestOptions).then(
    handleResponse
  )
}
function renderQuery(options: ListOptions) {
  let query: string = ''
  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      const element = options[key]
      query += `${key}=${element}&`
    }
  }
  return query
}
function getAll(options: ListOptions) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  let query = renderQuery(options)
  return fetch('/transaction/list?' + query, requestOptions).then(
    handleResponse
  )
}

function handleResponse(response: Response) {
  if (!response.ok) {
    return response.json().then(result => Promise.reject(result.error))
  }

  return response.json()
}
