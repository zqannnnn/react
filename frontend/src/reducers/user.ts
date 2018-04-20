import {userConsts} from '../constants';
import {User} from '../models'
import {UserAction} from '../actions'
export type State = {
  processing?: boolean;
  loading?: boolean;
  userData?: User;
  error?: string;
};
export function user(state = {}, action : UserAction) : State {
  switch(action.type) {
    case userConsts.UPDATE_REQUEST:
      return {processing: true};
    case userConsts.UPDATE_SUCCESS:
      return {userData: action.user};
    case userConsts.UPDATE_FAILURE:
      return {error: action.error};
    case userConsts.GET_REQUEST:
      return {loading: true};
    case userConsts.GET_SUCCESS:
      return {userData: action.user};
    case userConsts.GET_FAILURE:
      return {error: action.error};
    default:
      return state
  }
}