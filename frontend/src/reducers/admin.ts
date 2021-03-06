import { adminConsts } from '../constants'
import { AdminAction } from '../actions'
import { User, Transaction,Goods } from '../models'
export type State = {
  loading?: boolean
  processing?: boolean
  unconfirmedCompanies?: User[]
  toFinishTransactions?: Transaction[]
  finishedTransactions?: Transaction[]
  unconfirmedGoods?:Goods[]
  confirmingGoods?:Goods
  confirmingCompany?: User
  error?: string
}
export function admin(state: State = {}, action: AdminAction): State {
  switch (action.type) {
    case adminConsts.GET_UNCONFIRMED_COMPANIES_REQUEST:
      return { loading: true }
    case adminConsts.GET_UNCONFIRMED_COMPANIES_SUCCESS:
      return {
        ...state,
        loading: false,
        unconfirmedCompanies: action.unconfirmedCompanies
      }
    case adminConsts.GET_UNCONFIRMED_COMPANIES_FAILURE:
      return { error: action.error, loading: false }
    
    case adminConsts.GET_UNVERIFIED_GOODS_REQUEST:
      return {loading:true}
    case adminConsts.GET_UNVERIFIED_GOODS_SUCCESS:
      return{
        ...state,
        loading:false,
        unconfirmedGoods:action.UnconfirmedGoods
      }
    case adminConsts.GET_UNVERIFIED_GOODS_FAILURE:
      return{ error:action.error,loading:false }

    case adminConsts.GET_CONFIRMING_GOODS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case adminConsts.GET_CONFIRMING_GOODS_SUCCESS:
    
      return {
        ...state,
        loading: false,
        confirmingGoods: action.confirmingGoods
      }
    case adminConsts.GET_CONFIRMING_GOODS_FAILURE:
      return { error: action.error, loading: false }

    case adminConsts.GET_WAIT_FINISH_REQUEST:
      return {
        ...state,
        loading: true
      }
    case adminConsts.GET_WAIT_FINISH_SUCCESS:
      return {
        ...state,
        loading: false,
        toFinishTransactions: action.transactions
      }
    case adminConsts.GET_WAIT_FINISH_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false
      }

    case adminConsts.GET_FINISHED_REQUEST:
      return {
        ...state,
        loading: true
      }
    case adminConsts.GET_FINISHED_SUCCESS:
      return {
        ...state,
        loading: false,
        finishedTransactions: action.transactions
      }
    case adminConsts.GET_FINISHED_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false
      }

    case adminConsts.GET_CONFIRMING_COMPANY_REQUEST:
      return {
        ...state,
        loading: true
      }
    case adminConsts.GET_CONFIRMING_COMPANY_SUCCESS:
      return {
        ...state,
        loading: false,
        confirmingCompany: action.confirmingCompany
      }
    case adminConsts.GET_CONFIRMING_COMPANY_FAILURE:
      return { error: action.error, loading: false }

    case adminConsts.CONFIRM_GOODS_REQUEST:
      return {
        ...state,
        processing: true
      }
    case adminConsts.CONFIRM_GOODS_SUCCESS:
      return {
        ...state,
        processing: false
      }
    case adminConsts.CONFIRM_GOODS_REQUEST:
      return { error: action.error, processing: false }

    case adminConsts.CONFIRM_COMPANY_REQUEST:
      return {
        ...state,
        processing: true
      }
    case adminConsts.CONFIRM_COMPANY_SUCCESS:
      return {
        ...state,
        processing: false
      }
    case adminConsts.DISCONFIRM_COMPANY_REQUEST:
      return { error: action.error, processing: false }

    case adminConsts.DISCONFIRM_GOODS_REQUEST:
      return { ...state, processing: false }
    case adminConsts.DISCONFIRM_GOODS_SUCCESS:
      return {
        ...state,
        processing: true
      }
    case adminConsts.DISCONFIRM_GOODS_FAILURE:
      return { error: action.error, processing: false }
    
    case adminConsts.CONFIRM_COMPANY_REQUEST:
      return {
        ...state,
        processing: true
      }
    case adminConsts.DISCONFIRM_COMPANY_SUCCESS:
      return {
        ...state,
        processing: true
      }
    case adminConsts.DISCONFIRM_COMPANY_FAILURE:
      return { error: action.error, processing: false }

    case adminConsts.FINISH_REQUEST:
      if (state.toFinishTransactions) {
        return {
          ...state,
          processing: true
        }
      }
    case adminConsts.FINISH_SUCCESS:
      if (state.toFinishTransactions) {
        let items = state.toFinishTransactions.filter(
          item => item.id !== action.id
        )
        let item = state.toFinishTransactions.filter(
          item => item.id === action.id
        )[0]
        item.status = adminConsts.STATUS_FINISHED
        if (state.finishedTransactions) {
          state.finishedTransactions.push(item)
        }
        return {
          ...state,
          processing: false,
          toFinishTransactions: items
        }
      }

    case adminConsts.FINISH_FAILURE:
      return {
        ...state,
        error: action.error,
        processing: false
      }
    default:
      return state
  }
}
