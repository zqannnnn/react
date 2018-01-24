import userConstants from '../constants/user';
import {getAuth} from '../helpers/auth';
import {AuthInfo,Action} from '../actions/auth';
import {UserEntity as User} from '../models/user' 
let authInfo = getAuth();
const initialState = authInfo ? { loggedIn: true, authInfo } : {};
export type State = {
  loggedIn?:boolean;
  loggingIn?:boolean;
  authInfo?:AuthInfo;
};

export function auth(state :State = initialState, action :Action):State {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        authInfo: action.authInfo
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        authInfo: action.authInfo
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {};
    default:
      return state
  }
}