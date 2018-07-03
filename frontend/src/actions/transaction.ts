import { transactionConsts } from '../constants'
import { transService } from '../services'
import { alertActionCreators } from '.'
import { history } from '../helpers/history'
import * as auth from '../helpers/auth'
import { Transaction } from '../models'
import { Dispatch } from 'react-redux'
import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'
import { ListOptions } from '../models'

export type Action = {
  type: string
  error?: string
  id?: string
  transactions?: Array<Transaction>
  data?: Transaction
  imagePath?: string
  comment?: string
  total?: number
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

    transService
      .getById(id)
      .then(
        (transaction: Transaction) => dispatch(success(transaction)),
        (error: string) => dispatch(failure(error))
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

    return transService
      .cancel(id)
      .then(
        () => dispatch(success(id)),
        (error: string) => dispatch(failure(error, id))
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
    return transService
      .reactivate(transaction)
      .then(
        () => dispatch(success(transaction.id)),
        (error: string) => dispatch(failure(error, transaction.id))
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
function finish(id: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request(id))

    transService
      .finish(id)
      .then(
        () => dispatch(success(id)),
        (error: string) => dispatch(failure(error, id))
      )
  }

  function request(id: string) {
    return { type: transactionConsts.FINISH_REQUEST, id }
  }
  function success(id: string) {
    return { type: transactionConsts.FINISH_SUCCESS, id }
  }
  function failure(error: string, id: string) {
    return { type: transactionConsts.FINISH_FAILURE, error, id }
  }
}
const getAll: ActionCreator<Thunk> = (option: ListOptions) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())
    transService
      .getAll(option)
      .then(
        (result: { transactions: Array<Transaction>; total: number }) =>
          dispatch(success(result.transactions, result.total)),
        (error: string) => dispatch(failure(error))
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
function addComment(id: string, comment: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request(id))

    transService.addComment(id, comment).then(
      () => dispatch(success(id, comment)),
      (error: string) => {
        dispatch(failure(id, error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function request(id: string) {
    return { type: transactionConsts.COMMENT_REQUEST, id }
  }
  function success(id: string, comment: string) {
    return { type: transactionConsts.COMMENT_SUCCESS, id, comment }
  }
  function failure(id: string, error: string) {
    return { type: transactionConsts.COMMENT_FAILURE, error, id }
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
  finish,
  addComment
}
