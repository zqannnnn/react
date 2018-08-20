import { userConsts } from '../constants'
import { User, Consignee } from '../models'
import { UserAction } from '../actions'
export type State = {
  processing?: boolean
  loading?: boolean
  userData?: User
  error?: string
}
export function user(state: State = {}, action: UserAction): State {
  let user = state.userData
  switch (action.type) {
    case userConsts.UPDATE_REQUEST:
      return { ...state, processing: true }
    case userConsts.UPDATE_SUCCESS:
      return { userData: action.user }
    case userConsts.UPDATE_FAILURE:
      return { error: action.error }
    case userConsts.GET_REQUEST:
      return { loading: true }
    case userConsts.GET_SUCCESS:
      return { userData: action.user }
    case userConsts.GET_FAILURE:
      return { error: action.error }
    case userConsts.CREATE_CONSIGNEE_REQUEST:
      return { ...state, processing: true }
    case userConsts.CREATE_CONSIGNEE_SUCCESS:
      if (user && user.consignees && action.consignee) {
        user.consignees.push(action.consignee)
      }
      return { userData: user }
    case userConsts.CREATE_CONSIGNEE_FAILURE:
      return { error: action.error }
    case userConsts.EDIT_CONSIGNEE_REQUEST:
      return { ...state, processing: true }
    case userConsts.EDIT_CONSIGNEE_SUCCESS:
      if (user && user.consignees && action.consignee) {
        return {
          userData: {
            ...user,
            consignees: user.consignees.map(item => {
              if (action.consignee && item.id === action.consignee.id) {
                return action.consignee
              }
              return item
            })
          }
        }
      } else {
        return state
      }

    case userConsts.EDIT_CONSIGNEE_FAILURE:
      return { error: action.error }
    case userConsts.DELETE_CONSIGNEE_REQUEST:
      return { ...state, processing: true }
    case userConsts.DELETE_CONSIGNEE_SUCCESS:
      if (user && user.consignees) {
        return {
          userData: {
            ...user,
            consignees: user.consignees.filter(
              item => item.id !== action.consigneeId
            )
          }
        }
      } else {
        return state
      }
    case userConsts.DELETE_CONSIGNEE_FAILURE:
      return { error: action.error }
    default:
      return state
  }
}
