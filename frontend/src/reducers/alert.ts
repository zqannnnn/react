import alertConstants from '../constants/alert';
import {Action} from '../actions/alert'
export type State = {
  type?: string;
  message?: string;
};
export function alert(state = {}, action : Action):State {
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        type: 'alert-success',
        message: action.message
      };
    case alertConstants.ERROR:
      return {
        type: 'alert-danger',
        message: action.message
      };
    case alertConstants.CLEAR:
      return {};
    default:
      return state
  }
}
