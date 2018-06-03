import { alertConsts } from '../constants'
import { AlertAction } from '../actions'
export type State = {
  type?: 'success' | 'error' | 'warning' | 'info'
  message?: string
}
export function alert(state = {}, action: AlertAction): State {
  switch (action.type) {
    case alertConsts.SUCCESS:
      return {
        type: 'success',
        message: action.message
      }
    case alertConsts.ERROR:
      return {
        type: 'error',
        message: action.message
      }
    case alertConsts.WARNING:
      return {
        type: 'warning',
        message: action.message
      }
    case alertConsts.CLEAR:
      return {}
    default:
      return state
  }
}
