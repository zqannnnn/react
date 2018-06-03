import { categoryConsts } from '../constants'
import { CategoryAction } from '../actions'
import { Category } from '../models'
export type State = {
  loading?: boolean
  error?: string
  items?: Array<Category>
}
export function category(state = {}, action: CategoryAction): State {
  switch (action.type) {
    case categoryConsts.GET_REQUEST:
      return { loading: true }
    case categoryConsts.GET_SUCCESS:
      return { items: action.categorys }
    case categoryConsts.GET_FAILURE:
      return { error: action.error }
    default:
      return state
  }
}
