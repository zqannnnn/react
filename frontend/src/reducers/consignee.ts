import { consigneeConsts } from '../constants'
import { consigneeAction } from '../actions'
import { Consignee } from '../models'
export type State = {
  processing?: boolean
  error?: string
  data?: Consignee
}
export function consignee(state: State = {}, action: consigneeAction): State {
  switch (action.type) {
    case consigneeConsts.CONSIGNEE_REQUEST:
      return { processing: true }
    case consigneeConsts.CONSIGNEE_SUCCESS:
      return { data: action.data }
    case consigneeConsts.CONSIGNEE_FAILURE:
      return { error: action.error }
    default:
      return state
  }
}
