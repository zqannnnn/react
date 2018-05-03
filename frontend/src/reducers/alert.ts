import {alertConsts} from '../constants';
import {AlertAction} from '../actions'
export type State = {
  type?: string;
  message?: string;
};
export function alert(state = {}, action : AlertAction):State {
  switch (action.type) {
    case alertConsts.SUCCESS:
      return {
        type: 'alert-success',
        message: action.message
      };
    case alertConsts.ERROR:
      return {
        type: 'alert-danger',
        message: action.message
      };
    case alertConsts.WARNING:
      return {
        type: 'alert-warning',
        message: action.message
      };
    case alertConsts.CLEAR:
      return {};
    default:
      return state
  }
}
