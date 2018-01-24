import userConstants from '../constants/user';
import {UserEntity as User} from '../models/user'
import {Action} from '../actions/user'
export type State = {
  updating?: boolean;
  submiting?: boolean;
  loading?: boolean;
  userData?: User;
  error?: string;
};
export function user(state = {}, action : Action) : State {
  switch(action.type) {
    case userConstants.UPDATE_REQUEST:
      return {updating: true};
    case userConstants.UPDATE_SUCCESS:
      return {userData: action.user};
    case userConstants.UPDATE_FAILURE:
      return {error: action.error};
    case userConstants.GET_REQUEST:
      return {loading: true};
    case userConstants.GET_SUCCESS:
      return {userData: action.user};
    case userConstants.GET_FAILURE:
      return {error: action.error};
    case userConstants.LOST_PASS_REQUEST:
      return {submiting: true};
    case userConstants.LOST_PASS_SUCCESS:
      return {submiting: false};
    case userConstants.LOST_PASS_FAILURE:
      return {error: action.error};
    case userConstants.RESET_PASS_REQUEST:
      return {submiting: true};
    case userConstants.RESET_PASS_SUCCESS:
      return {};
    case userConstants.RESET_PASS_FAILURE:
      return {error: action.error};
    default:
      return state
  }
}