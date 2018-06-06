import { authConsts } from '../constants'
import { getAuth } from '../helpers/auth'
import { AuthInfo, AuthAction } from '../actions'
import { User } from '../models'
let authInfo = getAuth()
const initialState = authInfo ? { loggedIn: true, authInfo } : {}
export type State = {
  loggedIn?: boolean
  processing?: boolean
  authInfo?: AuthInfo
}

export function auth(state: State = initialState, action: AuthAction): State {
  switch (action.type) {
    case authConsts.LOGIN_REQUEST:
      return {
        processing: true,
        authInfo: action.authInfo
      }
    case authConsts.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        authInfo: action.authInfo
      }
    case authConsts.LOGIN_FAILURE:
      return {}
    case authConsts.REGISTER_REQUEST:
      return {
        processing: true,
        authInfo: action.authInfo
      }
    case authConsts.REGISTER_SUCCESS:
      return {
        loggedIn: true,
        authInfo: action.authInfo
      }
    case authConsts.REGISTER_FAILURE:
      return {}
    case authConsts.REFRESH_AUTH_SUCCESS:
      return {
        ...state,
        authInfo: action.authInfo
      }
    case authConsts.REFRESH_AUTH_FAILURE:
      return { ...state }
    case authConsts.LOGOUT:
      return {}
    default:
      return state
  }
}
