import { transactionConsts, adminConsts } from '../constants'
import { transService } from '../services'
import { alertActionCreators } from '.'
import { history } from '../helpers/history'
import * as auth from '../helpers/auth'
import { Transaction } from '../models'
import { Dispatch } from 'react-redux'
import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'
import { ListOptions, Comment } from '../models'

export type Action = {
  type: string
  error?: string
  id?: string
  transactionId?: string
  transactions?: Array<Transaction>
  data?: Transaction
  imagePath?: string
  comment?: Comment
  total?: number
  comments?: Array<Comment>
  replys?: Array<Comment>
}

type Thunk = ThunkAction<void, RootState, void>

// prefixed function name with underscore because new is a reserved word in
const _new: ActionCreator<Thunk> = (transaction: Transaction) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())

    transService.new(transaction).then(
      () => {
        dispatch(success())
        dispatch(alertActionCreators.success('Create transaction successful'))
        setTimeout(function() {
          history.replace('/transactions/my')
        }, 1000)
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }
  function request(): Action {
    return { type: transactionConsts.CREATE_REQUEST }
  }
  function success(): Action {
    return { type: transactionConsts.CREATE_SUCCESS }
  }
  function failure(error: string): Action {
    return { type: transactionConsts.CREATE_FAILURE, error }
  }
}

const newOrder: ActionCreator<Thunk> = (transaction: Transaction) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())

    transService.newOrder(transaction).then(
      () => {
        dispatch(success())
        dispatch(alertActionCreators.success('Create order successful'))
        setTimeout(function() {
          history.replace('/transactions/my')
        }, 1000)
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }
  function request(): Action {
    return { type: transactionConsts.CREATE_ORDER_REQUEST }
  }
  function success(): Action {
    return { type: transactionConsts.CREATE_ORDER_SUCCESS }
  }
  function failure(error: string): Action {
    return { type: transactionConsts.CREATE_ORDER_FAILURE, error }
  }
}

const edit: ActionCreator<Thunk> = (
  transaction: Transaction,
  transactionId: string
) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())

    transService.edit(transaction, transactionId).then(
      () => {
        dispatch(success())
        dispatch(alertActionCreators.success('Edit transaction successful'))
        setTimeout(function() {
          history.replace('/')
        }, 1000)
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }
  function request(): Action {
    return { type: transactionConsts.EDIT_REQUEST }
  }
  function success(): Action {
    return { type: transactionConsts.EDIT_SUCCESS }
  }
  function failure(error: string): Action {
    return { type: transactionConsts.EDIT_FAILURE, error }
  }
}
function getById(id: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request())

    transService.getById(id).then(
      (transaction: Transaction) => dispatch(success(transaction)),
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function request() {
    return { type: transactionConsts.GET_REQUEST }
  }
  function success(transaction: Transaction) {
    if (transaction.goods && transaction.goods.images) {
      let images = transaction.goods.images.filter(
        image => image.type === transactionConsts.IMAGE_TYPE_MEDIE
      )

      let certificates = transaction.goods.images.filter(
        image => image.type === transactionConsts.IMAGE_TYPE_CERTIFICATE
      )
      transaction.goods.images = images
      transaction.goods.certificates = certificates
    }
    return { type: transactionConsts.GET_SUCCESS, data: transaction }
  }
  function failure(error: string) {
    return { type: transactionConsts.GET_FAILURE, error }
  }
}
function cancel(id: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request(id))

    return transService.cancel(id).then(
      () => {
        dispatch(success(id))
        dispatch(alertActionCreators.success('Cancel transaction successful'))
      },
      (error: string) => {
        dispatch(failure(error, id))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function request(id: string) {
    return { type: transactionConsts.CANCEL_REQUEST, id }
  }
  function success(id: string) {
    return { type: transactionConsts.CANCEL_SUCCESS, id }
  }
  function failure(error: string, id: string) {
    return { type: transactionConsts.CANCEL_FAILURE, error, id }
  }
}
function reactivate(transaction: Transaction) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request(transaction.id))
    return transService.reactivate(transaction).then(
      () => {
        dispatch(success(transaction.id))
        dispatch(
          alertActionCreators.success('Reactivate transaction successful')
        )
      },
      (error: string) => {
        dispatch(failure(error, transaction.id))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function request(id: any) {
    return { type: transactionConsts.REACTIVATE_REQUEST, id }
  }
  function success(id: any) {
    return { type: transactionConsts.REACTIVATE_SUCCESS, id }
  }
  function failure(error: string, id: any) {
    return { type: transactionConsts.REACTIVATE_FAILURE, error, id }
  }
}

function buy(id: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request(id))

    transService.buy(id).then(
      () => {
        dispatch(success(id))
        dispatch(alertActionCreators.success('buy Successful'))
      },
      (error: string) => {
        dispatch(failure(error, id))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function request(id: string) {
    return { type: transactionConsts.BUY_REQUEST, id }
  }
  function success(id: string) {
    return { type: transactionConsts.BUY_SUCCESS, id }
  }
  function failure(error: string, id: string) {
    return { type: transactionConsts.BUY_FAILURE, error, id }
  }
}

const getAll: ActionCreator<Thunk> = (option: ListOptions) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())
    transService.getAll(option).then(
      (result: { transactions: Array<Transaction>; total: number }) =>
        dispatch(success(result.transactions, result.total)),
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function request(): Action {
    return { type: transactionConsts.GETALL_REQUEST }
  }
  function success(transactions: Array<Transaction>, total: number): Action {
    transactions.forEach(transaction => {
      transaction.itemType = 'Transaction'
      if (transaction.goods && transaction.goods.images) {
        let images = transaction.goods.images.filter(
          image => image.type === transactionConsts.IMAGE_TYPE_MEDIE
        )
        let certificates = transaction.goods.images.filter(
          image => image.type === transactionConsts.IMAGE_TYPE_CERTIFICATE
        )
        transaction.goods.certificates = certificates
        transaction.goods.images = images
      }
    })

    return { type: transactionConsts.GETALL_SUCCESS, transactions, total }
  }
  function failure(error: string): Action {
    return { type: transactionConsts.GETALL_FAILURE, error }
  }
}

const createComment: ActionCreator<Thunk> = (
  comment: Comment,
  options?: ListOptions
) => {
  return (dispatch: Dispatch<RootState>): void => {
    comment.transactionId && dispatch(request(comment.transactionId))

    transService
      .createComment(comment, options)
      .then(
        (result: { comments: Array<Comment>; total: number }) =>
          comment.transactionId &&
          dispatch(
            success(comment.transactionId, result.comments, result.total)
          ),
        (error: string) =>
          comment.transactionId &&
          dispatch(failure(comment.transactionId, error))
      )
  }
  function request(id: string): Action {
    return {
      type: transactionConsts.COMMENT_CREATE_REQUEST,
      id
    }
  }
  function success(
    id: string,
    comments: Array<Comment>,
    total: number
  ): Action {
    return {
      type: transactionConsts.COMMENT_CREATE_SUCCESS,
      comments,
      total,
      id
    }
  }
  function failure(id: string, error: string): Action {
    return {
      type: transactionConsts.COMMENT_CREATE_FAILURE,
      error,
      id
    }
  }
}

const createReply: ActionCreator<Thunk> = (comment: Comment) => {
  return (dispatch: Dispatch<RootState>): void => {
    comment.transactionId && dispatch(request(comment.transactionId))

    transService
      .createReply(comment)
      .then(
        (result: Comment) =>
          comment.transactionId &&
          dispatch(success(comment.transactionId, result)),
        (error: string) =>
          comment.transactionId &&
          dispatch(failure(comment.transactionId, error))
      )
  }
  function request(transactionId: string): Action {
    return {
      type: transactionConsts.REPLY_CREATE_REQUEST,
      transactionId
    }
  }
  function success(transactionId: string, result: Comment): Action {
    return {
      type: transactionConsts.REPLY_CREATE_SUCCESS,
      comment: result,
      transactionId
    }
  }
  function failure(transactionId: string, error: string): Action {
    return {
      type: transactionConsts.REPLY_CREATE_FAILURE,
      error,
      transactionId
    }
  }
}

const listComment: ActionCreator<Thunk> = (
  id: string,
  option?: ListOptions
) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())
    transService
      .listComment(id, option)
      .then(
        (result: { comments: Array<Comment>; total: number }) =>
          dispatch(success(result.comments, result.total, id)),
        (error: string) => dispatch(failure(error))
      )
  }

  function request(): Action {
    return { type: transactionConsts.COMMENT_LIST_REQUEST, id }
  }
  function success(
    comments: Array<Comment>,
    total: number,
    id: string
  ): Action {
    return { type: transactionConsts.COMMENT_LIST_SUCCESS, comments, total, id }
  }
  function failure(error: string): Action {
    return { type: transactionConsts.COMMENT_LIST_FAILURE, error }
  }
}

const listReplys: ActionCreator<Thunk> = (
  id: string,
  transactionId: string,
  option?: ListOptions
) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())
    transService
      .listReplys(id, transactionId, option)
      .then(
        (result: {
          replys: Array<Comment>
          total: number
          transactionId: string
        }) => dispatch(success(result.replys, result.total, transactionId)),
        (error: string) => dispatch(failure(error))
      )
  }

  function request(): Action {
    return { type: transactionConsts.REPLY_LIST_REQUEST, transactionId }
  }
  function success(replys: Array<Comment>, total: number, id: string): Action {
    return {
      type: transactionConsts.REPLY_LIST_SUCCESS,
      replys,
      total,
      id,
      transactionId
    }
  }
  function failure(error: string): Action {
    return { type: transactionConsts.REPLY_LIST_FAILURE, error }
  }
}

export const actionCreators = {
  new: _new,
  newOrder,
  edit,
  getAll,
  getById,
  cancel,
  reactivate,
  buy,
  createComment,
  createReply,
  listComment,
  listReplys
}
