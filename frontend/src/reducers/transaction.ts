import { transactionConsts } from '../constants'
import { TransactionAction } from '../actions'
import { Transaction, Comment } from '../models'
export type State = {
  processing?: boolean
  loading?: boolean
  error?: string
  transData?: Transaction
  items?: Array<Transaction>
  rowComments?: Array<Comment>
  total?: number
}
const commentReduce = (comments: Comment[]): Comment[] => {
  let firstLevel = comments.filter(comment => !comment.replyTo)
  let restComments = comments.filter(comment => comment.replyTo)
  if (restComments.length === 0) {
    return comments
  } else {
    restComments.forEach(comment => {
      firstLevel.forEach(firstComment => {
        if (comment.rootId === firstComment.id) {
          if (firstComment.replys) firstComment.replys.push(comment)
          else firstComment.replys = [comment]
        }
      })
    })
    return firstLevel
  }
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
    case transactionConsts.CREATE_ORDER_REQUEST:
      return { processing: true }
    case transactionConsts.CREATE_ORDER_SUCCESS:
      return {}
    case transactionConsts.CREATE_ORDER_FAILURE:
      return { error: action.error }
    case transactionConsts.EDIT_REQUEST:
      return { processing: true }
    case transactionConsts.EDIT_SUCCESS:
      return {}
    case transactionConsts.EDIT_FAILURE:
      return { error: action.error }
    case transactionConsts.CANCEL_REQUEST:
      if (state.items) {
        let items = state.items.filter(item => item.id !== action.id)
        let item = state.items.filter(item => item.id === action.id)[0]
        item.status = transactionConsts.STATUS_CANCELLED
        items.push(item)
        return {
          ...state,
          items: items
        }
      }
    case transactionConsts.CANCEL_SUCCESS:
      return state
    case transactionConsts.CANCEL_FAILURE:
      if (state.items) {
        let items = state.items.filter(item => item.id !== action.id)
        let item = state.items.filter(item => item.id === action.id)[0]
        item.status = transactionConsts.STATUS_CREATED
        items.push(item)
        return {
          ...state,
          items: items
        }
      }
    case transactionConsts.REACTIVATE_REQUEST:
      if (state.items) {
        let items = state.items.filter(item => item.id !== action.id)
        let item = state.items.filter(item => item.id === action.id)[0]
        item.status = transactionConsts.STATUS_CREATED
        items.push(item)
        return {
          ...state,
          items: items
        }
      }
    case transactionConsts.REACTIVATE_SUCCESS:
      return state
    case transactionConsts.REACTIVATE_FAILURE:
      if (state.items) {
        let items = state.items.filter(item => item.id !== action.id)
        let item = state.items.filter(item => item.id === action.id)[0]
        item.status = transactionConsts.STATUS_CANCELLED
        items.push(item)
        return {
          ...state,
          items: items
        }
      }
    case transactionConsts.BUY_REQUEST:
      if (state.items)
        return {
          ...state,
          processing: true
        }
    case transactionConsts.BUY_SUCCESS:
      if (state.items)
        return {
          ...state,
          processing: false,
          items: state.items.map(
            item =>
              item.id === action.id
                ? {
                    ...item,
                    status: transactionConsts.STATUS_TAKING
                  }
                : item
          )
        }
    case transactionConsts.BUY_FAILURE:
      if (state.items)
        return {
          ...state,
          processing: false,
          error: action.error
        }
    case transactionConsts.COMMENT_CREATE_REQUEST:
      return {
        ...state,
        processing: true
      }
    case transactionConsts.COMMENT_CREATE_SUCCESS:
      if (state.items && action.comments) {
        let comments = commentReduce(action.comments)
        let items = state.items.filter(item => item.id !== action.id)
        let item = state.items.filter(item => item.id === action.id)[0]
        item.comments = comments
        item.totalComment = action.total
        items.push(item)
        return {
          ...state,
          rowComments: action.comments,
          items: state.items.map(
            item =>
              item.id === action.id
                ? {
                    ...item,
                    items
                  }
                : item
          )
        }
      }

    case transactionConsts.COMMENT_CREATE_FAILURE:
      return {
        ...state,
        error: action.error
      }
    case transactionConsts.COMMENT_LIST_REQUEST:
      if (state.items && action.id) {
        let items = state.items.filter(item => item.id !== action.id)
        let item = state.items.filter(item => item.id === action.id)[0]
        item.commentLoading = true
        items.push(item)
        return {
          ...state,
          items: state.items.map(
            item =>
              item.id === action.id
                ? {
                    ...item,
                    items
                  }
                : item
          )
        }
      }
    case transactionConsts.COMMENT_LIST_SUCCESS:
      if (state.items && action.comments) {
        let comments = commentReduce(action.comments)
        let items = state.items.filter(item => item.id !== action.id)
        let item = state.items.filter(item => item.id === action.id)[0]
        item.comments = comments
        item.totalComment = action.total
        item.commentLoading = false
        items.push(item)
        return {
          ...state,
          rowComments: action.comments,
          items: state.items.map(
            item =>
              item.id === action.id
                ? {
                    ...item,
                    items
                  }
                : item
          )
        }
      }
    case transactionConsts.COMMENT_LIST_FAILURE:
      if (state.items && action.id) {
        let items = state.items.filter(item => item.id !== action.id)
        let item = state.items.filter(item => item.id === action.id)[0]
        item.commentLoading = false
        items.push(item)
        return {
          ...state,
          items: state.items.map(
            item =>
              item.id === action.id
                ? {
                    ...item,
                    items
                  }
                : item
          )
        }
      }
    case transactionConsts.GET_REQUEST:
      return { ...state, loading: true }
    case transactionConsts.GET_SUCCESS:
      return { ...state, transData: action.data }
    case transactionConsts.GET_FAILURE:
      return { ...state, error: action.error }
    case transactionConsts.GETALL_REQUEST:
      return { ...state, loading: true }
    case transactionConsts.GETALL_SUCCESS:
      return { ...state, items: action.transactions, total: action.total }
    case transactionConsts.GETALL_FAILURE:
      return { ...state, error: action.error }
    default:
      return state
  }
}
