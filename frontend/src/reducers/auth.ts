import {userConsts} from '../constants';
import {getAuth} from '../helpers/auth';
import {AuthInfo,AuthAction} from '../actions';
import {User} from '../models' 
let authInfo = getAuth();
const initialState = authInfo ? { loggedIn: true, authInfo } : {};
export type State = {
  loggedIn?:boolean;
  processing?:boolean;
  authInfo?:AuthInfo;
};

export function auth(state :State = initialState, action :AuthAction):State {
  switch (action.type) {
    case userConsts.LOGIN_REQUEST:
      return {
        processing: true,
        authInfo: action.authInfo
      };
    case userConsts.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        authInfo: action.authInfo
      };
    case userConsts.LOGIN_FAILURE:
      return {};
    case userConsts.REGISTER_REQUEST:
      return {
        processing: true,
        authInfo: action.authInfo
      };
    case userConsts.REGISTER_SUCCESS:
      return {
        loggedIn: true,
        authInfo: action.authInfo
      };
    case userConsts.REGISTER_FAILURE:
      return {};
    case userConsts.REFRESH_AUTH_SUCCESS:
      return {
        ...state,
        authInfo: action.authInfo
      };
    case userConsts.REFRESH_AUTH_FAILURE:
      return {...state};
    case userConsts.LOGOUT:
      return {};
    default:
      return state
  }
}