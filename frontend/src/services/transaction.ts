import { authHeader } from '../helpers/auth'
import { Transaction, ListOptions, Comment } from '../models'
export const transService = {
  new: _new,
  newOrder: newOrder,
  edit,
  getById,
  getAll,
  cancel,
  reactivate,
  finish,
  buy,
  createComment,
  listComment,
  listReplys
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
function newOrder(transaction: Transaction) {
  const requestOptions = {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  }
  return fetch('/transaction/order/new', requestOptions).then(handleResponse)
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
function cancel(id: string) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch('/transaction/' + id, requestOptions).then(handleResponse)
}
function reactivate(transaction: Transaction) {
  const requestOptions = {
    method: 'PUT',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  }
  return fetch('/transaction/' + transaction.id, requestOptions).then(
    handleResponse
  )
}
function finish(id: string) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch('/transaction/finish/' + id, requestOptions).then(handleResponse)
}

function buy(id: string) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch('/transaction/buy/' + id, requestOptions).then(handleResponse)
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

function getwaitting(options: ListOptions) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  let query = renderQuery(options)
  return fetch('/transaction/list?' + query, requestOptions).then(
    handleResponse
  )
}

function createComment(comment: Comment, options?: ListOptions) {
  const requestOptions = {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(comment)
  }
  let query = ''
  if (options) {
    query = renderQuery(options)
  }
  return fetch('/transaction/comment?' + query, requestOptions).then(
    handleResponse
  )
}

function listComment(id: string, options?: ListOptions) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  let query = ''
  if (options) {
    query = renderQuery(options)
  }
  return fetch(
    '/transaction/list/comment?transactionId=' + id + '&' + query,
    requestOptions
  ).then(handleResponse)
}

function listReplys(id: string, transactionId: string, options?: ListOptions) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  let query = ''
  if (options) {
    query = renderQuery(options)
  }
  return fetch(
    '/transaction/list/reply?commentId=' +
      id +
      '&' +
      transactionId +
      '&' +
      query,
    requestOptions
  ).then(handleResponse)
}

function handleResponse(response: Response) {
  if (!response.ok) {
    return response.json().then(result => Promise.reject(result.error))
  }

  return response.json()
}
