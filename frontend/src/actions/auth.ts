import { authConsts, userConsts } from '../constants'
import { authService } from '../services'
import { alertActionCreators } from '.'
import { history } from '../helpers/history'
import * as auth from '../helpers/auth'
import { User } from '../models'
export type AuthInfo = {
  id?: string
  token?: string
  isAdmin?: boolean
  preferredCurrencyCode?: string
  licenseStatus?: number
}
export const actionCreators = {
  login,
  logout,
  setAuth,
  refresh,
  register,
  lostPass,
  resetPass
}
export type Action = {
  type: string
  authInfo?: AuthInfo
  error?: string
}

function register(user: User) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request(user))

    authService.register(user).then(
      (authInfo: AuthInfo) => {
        dispatch(alertActionCreators.success('Create user succeed'))
        dispatch(success(authInfo))
        setTimeout(function() {
          history.replace('/')
        }, 1000)
      },
      (error: any) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }
  function request(user: User) {
    return { type: authConsts.REGISTER_REQUEST, user }
  }
  function success(authInfo: AuthInfo) {
    return { type: authConsts.REGISTER_SUCCESS, authInfo }
  }
  function failure(error: string) {
    return { type: authConsts.REGISTER_FAILURE, error }
  }
}

function login(username: string, password: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request())

    authService.login(username, password).then(
      (authInfo: AuthInfo) => {
        dispatch(success(authInfo))
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function request() {
    return { type: authConsts.LOGIN_REQUEST }
  }
  function success(authInfo: AuthInfo) {
    return { type: authConsts.LOGIN_SUCCESS, authInfo }
  }
  function failure(error: string) {
    return { type: authConsts.LOGIN_FAILURE, error }
  }
}
function refresh() {
  return (dispatch: (action: Action) => void) => {
    authService.refreshAuth().then(
      (authInfo: AuthInfo) => {
        let oldAuth = auth.getAuth()
        authInfo.token = oldAuth.token
        dispatch(success(authInfo))
        dispatch(setAuth(authInfo))
        if (authInfo.licenseStatus === authConsts.LICENSE_STATUS_DENIED) {
          dispatch(
            alertActionCreators.warning(
              'Company information has been denied by admin, please refill it.'
            )
          )
        }
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function success(authInfo: AuthInfo) {
    return { type: authConsts.REFRESH_AUTH_SUCCESS, authInfo }
  }
  function failure(error: string) {
    return { type: authConsts.REFRESH_AUTH_FAILURE, error }
  }
}
function logout() {
  authService.logout()
  return { type: authConsts.LOGOUT }
}

function setAuth(authInfo: AuthInfo) {
  auth.setAuth(authInfo)
  return { type: authConsts.LOGIN_SUCCESS, authInfo }
}

function lostPass(email: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request())

    authService.lostPass(email).then(
      () => {
        dispatch(
          alertActionCreators.success(
            "If there is a corresponding account, then you'll receive an email with a link to change your password."
          )
        )
        dispatch(success())
      },
      error => {
        dispatch(alertActionCreators.error(error))
        dispatch(failure(error))
      }
    )
  }

  function request() {
    return { type: authConsts.LOST_PASS_REQUEST }
  }
  function success() {
    return { type: authConsts.LOST_PASS_SUCCESS }
  }
  function failure(error: string) {
    return { type: authConsts.LOST_PASS_FAILURE, error }
  }
}
function resetPass(pass: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request())

    authService.resetPass(pass).then(
      () => {
        dispatch(alertActionCreators.success('Reset password succeed.'))
        dispatch(success())
      },
      (error: any) => {
        dispatch(alertActionCreators.error(error))
        dispatch(failure(error))
      }
    )
  }

  function request() {
    return { type: authConsts.RESET_PASS_REQUEST }
  }
  function success() {
    return { type: authConsts.RESET_PASS_SUCCESS }
  }
  function failure(error: string) {
    return { type: authConsts.RESET_PASS_FAILURE, error }
  }
}
