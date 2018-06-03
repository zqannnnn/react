import { AuthInfo } from '../actions'
function authHeader() {
  // return authorization header with jwt token
  let auth = getAuth()

  if (auth && auth.token) {
    return {
      Authorization: 'Bearer ' + auth.token
    }
  }
}
function setAuth(auth: AuthInfo) {
  localStorage.setItem('auth', JSON.stringify(auth))
}
function getAuth() {
  let authInfo = localStorage.getItem('auth')
  if (authInfo) return JSON.parse(authInfo)
  else return null
}
function removeAuth() {
  localStorage.removeItem('auth')
}
export { authHeader, setAuth, getAuth, removeAuth }
