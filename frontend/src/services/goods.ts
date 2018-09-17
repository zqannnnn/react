import { authHeader } from '../helpers/auth'
import { Goods } from '../models'
import { ListOptions } from '../models'
export const goodsService = {
  new: _new,
  edit,
  getById,
  getAll,
  listUnconfirmedProof,
  confirm,
  disconfirm
}
function _new(goods: Goods) {
  const requestOptions = {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(goods)
  }
  return fetch('/goods/new', requestOptions).then(handleResponse)
}
function confirm(id: string) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch('/goods/confirm/' + id, requestOptions).then(handleResponse)
}

function disconfirm(id: string) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch('/goods/denie/' + id, requestOptions).then(handleResponse)
}
function edit(goods: Goods, goodsactionId: string) {
  const requestOptions = {
    method: 'PUT',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(goods)
  }
  return fetch('/goods/' + goodsactionId, requestOptions).then(handleResponse)
}
function getById(id: string) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch('/goods/' + id, requestOptions).then(handleResponse)
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
  return fetch('/goods/list?' + query, requestOptions).then(handleResponse)
}

function handleResponse(response: Response) {
  if (!response.ok) {
    return response.json().then(result => Promise.reject(result.error))
  }

  return response.json()
}
function listUnconfirmedProof() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch('/goods/unconfirmed/list', requestOptions).then(handleResponse)
}