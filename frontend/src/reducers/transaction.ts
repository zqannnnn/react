import { transactionConsts } from '../constants'
import { TransactionAction } from '../actions'
import { Transaction } from '../models'
export type State = {
  processing?: boolean
  cancellError?: string
  finishing?: boolean
  finishError?: string
  loading?: boolean
  error?: string
  transData?: Transaction
  items?: Array<Transaction>
}
export function transaction(
  state: State = {},
  action: TransactionAction
): State {
  switch (action.type) {
    case transactionConsts.CREATE_REQUEST:
      return { processing: true }
    case transactionConsts.CREATE_SUCCESS:
      return {}
    case transactionConsts.CREATE_FAILURE:
      return { error: action.error }
    case transactionConsts.EDIT_REQUEST:
      return { processing: true }
    case transactionConsts.EDIT_SUCCESS:
      return {}
    case transactionConsts.EDIT_FAILURE:
      return { error: action.error }
    case transactionConsts.CANCELL_REQUEST:
      if (state.items)
        return {
          ...state,
          items: state.items.map(
            item =>
              item.id === action.id
                ? {
                    ...item,
                    cancelling: true
                  }
                : item
          )
        }
    case transactionConsts.CANCELL_SUCCESS:
      if (state.items)
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.id)
        }
    case transactionConsts.CANCELL_FAILURE:
      if (state.items)
        return {
          ...state,
          items: state.items.map(
            item =>
              item.id === action.id
                ? {
                    ...item,
                    cancelling: false,
                    cancellError: action.error
                  }
                : item
          )
        }
    case transactionConsts.FINISH_REQUEST:
      if (state.items)
        return {
          ...state,
          items: state.items.map(
            item =>
              item.id === action.id
                ? {
                    ...item,
                    finishing: true
                  }
                : item
          )
        }
    case transactionConsts.FINISH_SUCCESS:
      if (state.items)
        return {
          ...state,
          items: state.items.map(
            item =>
              item.id === action.id
                ? {
                    ...item,
                    status: transactionConsts.STATUS_FINISHED
                  }
                : item
          )
        }

    case transactionConsts.FINISH_FAILURE:
      if (state.items)
        return {
          ...state,
          items: state.items.map(
            item =>
              item.id === action.id
                ? {
                    ...item,
                    finishing: false,
                    finishError: action.error
                  }
                : item
          )
        }
    case transactionConsts.COMMENT_REQUEST:
      return {
        ...state,
        transData: {
          ...state.transData,
          processing: true
        }
      }
    case transactionConsts.COMMENT_SUCCESS:
      return {
        ...state,
        transData: {
          ...state.transData,
          comment: action.comment
        }
      }

    case transactionConsts.COMMENT_FAILURE:
      return {
        ...state,
        transData: {
          ...state.transData,
          error: action.error
        }
      }
    case transactionConsts.GET_REQUEST:
      return { loading: true }
    case transactionConsts.GET_SUCCESS:
      return { transData: action.data }
    case transactionConsts.GET_FAILURE:
      return { error: action.error }
    case transactionConsts.GETALL_REQUEST:
      return { loading: true }
    case transactionConsts.GETALL_SUCCESS:
      return { items: action.transactions }
    case transactionConsts.GETALL_FAILURE:
      return { error: action.error }
    default:
      return state
  }
}
