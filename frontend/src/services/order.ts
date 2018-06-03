import { authHeader } from '../helpers/auth'
import { Order } from '../models/order'
export const orderService = {
  new: _new,
  edit,
  getById,
  getAll,
  cancell,
  finish,
  addComment
}
function _new(order: Order) {
  const requestOptions = {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  }
  return fetch('/order/new', requestOptions).then(handleResponse)
}
function edit(order: Order, orderId: string) {
  const requestOptions = {
    method: 'PUT',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  }
  return fetch('/order/' + orderId, requestOptions).then(handleResponse)
}
function getById(id: string) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch('/order/' + id, requestOptions).then(handleResponse)
}
function cancell(id: string) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch('/order/' + id, requestOptions).then(handleResponse)
}
function finish(id: string) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return fetch('/order/finish/' + id, requestOptions).then(handleResponse)
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

  return fetch('/order/comment/' + id, requestOptions).then(handleResponse)
}
function getAll(option: { selectType: string }) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch(
    '/order/list?selectType=' + option.selectType,
    requestOptions
  ).then(handleResponse)
}

function handleResponse(response: Response) {
  if (!response.ok) {
    return response.json().then(result => Promise.reject(result.error))
  }

  return response.json()
}
