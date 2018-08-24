import { authHeader } from '../helpers/auth'
import { setAuth, removeAuth } from '../helpers/auth'
import { User } from '../models/user'
import { AuthInfo } from '../actions/auth'

export const authService = {
  login,
  logout,
  register,
  lostPass,
  resetPass,
  refreshAuth
}

function refreshAuth() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  return fetch('/user/refresh/auth', requestOptions).then(handleResponse)
}

function login(email: string, password: string) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  }
  return fetch('/login', requestOptions)
    .then(handleResponse)
    .then((result: AuthInfo) => {
      // login successful if there's a jwt token in the response
      if (result) {
        // store user details and jwt token in local storage to keep user logged in
        // between page refreshes
        setAuth(result)
        window.Chat.connect()
        return result
      }
      return {}
    })
}

function logout() {
  // remove user from local storage to log user out
  removeAuth()
  window.Chat.disconnect()
}

function register(user: User) {
  const requestOptions = {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  }

  return fetch('/user/new', requestOptions)
    .then(handleResponse)
    .then((result: AuthInfo) => {
      // login successful if there's a jwt token in the response
      if (result) {
        // store user details and jwt token in local storage to keep user logged in
        // between page refreshes
        setAuth(result)
        window.Chat.connect()
        return result
      }
      return {}
    })
}

function lostPass(email: string) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  }
  return fetch('/pass/lost', requestOptions).then(handleResponse)
}
function resetPass(password: string) {
  const requestOptions = {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password })
  }
  return fetch('/pass/reset', requestOptions).then(handleResponse)
}

function handleResponse(response: Response) {
  if (!response.ok) {
    return response.json().then(result => Promise.reject(result.error))
  }

  return response.json()
}
