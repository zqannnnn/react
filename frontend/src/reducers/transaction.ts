import { transactionConsts } from '../constants'
import { TransactionAction } from '../actions'
import { Transaction, Comment } from '../models'
import { cloneDeep } from 'lodash'
export type State = {
  processing?: boolean
  loading?: boolean
  error?: string
  transData?: Transaction
  items?: Array<Transaction>
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
      } else {
        return state
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
      } else {
        return state
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
      } else {
        return state
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
      } else {
        return state
      }
    case transactionConsts.BUY_REQUEST:
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
      else return state
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
        item.rowComments = action.comments
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
      } else {
        return state
      }

    case transactionConsts.REPLY_CREATE_REQUEST:
      if (state.items) {
        let items = state.items.map(item => {
          if (item.id === action.transactionId) {
            if (item.comments) {
              item.commentLoading = true
            }
          }
          return item
        })
        return {
          ...state,
          processing: true,
          items
        }
      } else {
        return state
      }
    case transactionConsts.REPLY_CREATE_SUCCESS:
      if (state.items && action.comments) {
        let item = state.items.filter(
          item => item.id === action.transactionId
        )[0]
        if (item.rowComments) {
          let firstLevelReply = item.rowComments.filter(comment => comment.replyTo)
          let Multistage = action.comments.filter(comment => comment.replyTo && comment.rootId !== comment.replyTo)
          Multistage.forEach(replys => {
            firstLevelReply.forEach(firstLevel => {
              replys.userReplyTo = firstLevel.user
            })
          })
          
          let items = state.items.map(item => {
            if (item.id === action.transactionId) {
              if (item.comments) {
                item.comments.map(comment => {
                  if (
                    action.comments &&
                    comment.id === action.comments[0].rootId
                  ) {
                    comment.replys = action.comments
                    item.rowComments = action.comments
                  }
                  return comment
                })
                item.commentLoading = false
              }
            }
            return item
          })
          return {
            ...state,
            processing: false,
            items
          }
        }
      } else {
        return {
          ...state,
          processing: false
        }
      }
    case transactionConsts.REPLY_CREATE_FAILURE:
      return {
        ...state,
        error: action.error,
        processing: false
      }

    case transactionConsts.COMMENT_LIST_REQUEST:
      if (state.items) {
        return {
          ...state,
          items: state.items.map(item => {
            if (item.id === action.id) {
              item.commentLoading = true
            }
            return item
          })
        }
      } else {
        return state
      }
    case transactionConsts.COMMENT_LIST_SUCCESS:
      if (state.items && action.comments) {
        let comments = commentReduce(action.comments)
        let items = state.items.filter(item => item.id !== action.id)
        let item = state.items.filter(item => item.id === action.id)[0]
        item.comments = comments
        item.totalComment = action.total
        item.commentLoading = false
        item.rowComments = action.comments
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
      } else {
        return state
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
      } else {
        return state
      }

    case transactionConsts.REPLY_LIST_REQUEST:
      if (state.items && action.transactionId) {
        return {
          ...state,
          items: state.items.map(item => {
            if (item.id === action.transactionId) {
              item.commentLoading = true
            }
            return item
          })
        }
      } else {
        return state
      }
    case transactionConsts.REPLY_LIST_SUCCESS:
      if (state.items && action.replys) {
        let items = state.items.filter(item => item.id !== action.transactionId)
        let item = state.items.filter(
          item => item.id === action.transactionId
        )[0]
        if (item.rowComments) {
          let rowComments = item.rowComments.filter(comment => !comment.replyTo)
          let replies = action.replys.filter(comment => comment.replyTo)
          replies.forEach(comment => {
            rowComments.forEach(firstComment => {
              comment.userReplyTo = firstComment.user
            })
          })
          let merge = item.rowComments.concat(action.replys)
          let clone = cloneDeep(merge)
          let comments = commentReduce(merge)
          item.comments = comments
          item.commentLoading = false
          items.push(item)
          return {
            ...state,
            items: state.items.map(
              item =>
                item.id === action.id
                  ? {
                      ...item,
                      rowComments: clone,
                      items
                    }
                  : item
            )
          }
        }
      }
    case transactionConsts.REPLY_LIST_FAILURE:
      if (state.items && action.transactionId)
        return {
          ...state,
          items: state.items.map(item => {
            if (item.id === action.id) {
              item.commentLoading = false
            }
            return item
          })
        }
      else return state

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
