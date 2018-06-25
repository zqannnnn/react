import { goodsConsts } from '../constants'
import { goodsAction } from '../actions'
import { Goods } from '../models'
export type State = {
  processing?: boolean
  finishing?: boolean
  finishError?: string
  loading?: boolean
  error?: string
  goodsData?: Goods
  items?: Array<Goods>
  total?: number
}
export function goods(state: State = {}, action: goodsAction): State {
  switch (action.type) {
    case goodsConsts.CREATE_REQUEST:
      return { processing: true }
    case goodsConsts.CREATE_SUCCESS:
      return {}
    case goodsConsts.CREATE_FAILURE:
      return { error: action.error }
    case goodsConsts.EDIT_REQUEST:
      return { processing: true }
    case goodsConsts.EDIT_SUCCESS:
      return {}
    case goodsConsts.EDIT_FAILURE:
      return { error: action.error }
    case goodsConsts.GET_REQUEST:
      return { loading: true }
    case goodsConsts.GET_SUCCESS:
      return { goodsData: action.data }
    case goodsConsts.GET_FAILURE:
      return { error: action.error }
    case goodsConsts.GETALL_REQUEST:
      return { loading: true }
    case goodsConsts.GETALL_SUCCESS:
      return { items: action.goods, total: action.total }
    case goodsConsts.GETALL_FAILURE:
      return { error: action.error }
    default:
      return state
  }
}
