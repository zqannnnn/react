import { adminConsts } from '../constants'
import { userService, transService ,goodsService} from '../services'
import { alertActionCreators } from '.'
import { history } from '../helpers/history'
import * as auth from '../helpers/auth'
import { User, Transaction, ListOptions,Goods} from '../models'
import { Dispatch } from 'react-redux'
import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'

export type Action = {
  type: string
  error?: string
  unconfirmedCompanies?: User[]
  confirmingCompany?: User
  transactions?: Array<Transaction>
  UnconfirmedGoods?:Goods[]
  confirmingGoods?:Goods
  total?: number
  id?: string
}
type Thunk = ThunkAction<void, RootState, void>

function confirm(id: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request())

    userService.confirm(id).then(
      () => {
        dispatch(success())
        dispatch(alertActionCreators.success('Operation succeed'))
        setTimeout(function() {
          history.replace('/admin')
        }, 1000)
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function request() {
    return { type: adminConsts.CONFIRM_COMPANY_REQUEST }
  }
  function success() {
    return { type: adminConsts.CONFIRM_COMPANY_SUCCESS }
  }
  function failure(error: string) {
    return { type: adminConsts.CONFIRM_COMPANY_FAILURE, error }
  }
}
function goodsConfirm(id: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request())

    goodsService.confirm(id).then(
      () => {
        dispatch(success())
        dispatch(alertActionCreators.success('Operation succeed'))
        setTimeout(function() {
          history.replace('/admin')
        }, 1000)
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function request() {
    return { type: adminConsts.CONFIRM_GOODS_REQUEST }
  }
  function success() {
    return { type: adminConsts.CONFIRM_GOODS_SUCCESS }
  }
  function failure(error: string) {
    return { type: adminConsts.CONFIRM_GOODS_FAILURE, error }
  }
}
function goodsDisconfirm(id: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request())

    goodsService.disconfirm(id).then(
      () => {
        dispatch(success())
        dispatch(alertActionCreators.success('Operation succeed'))
        setTimeout(function() {
          history.replace('/admin')
        }, 1000)
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function request() {
    return { type: adminConsts.DISCONFIRM_GOODS_REQUEST }
  }
  function success() {
    return { type: adminConsts.DISCONFIRM_GOODS_SUCCESS }
  }
  function failure(error: string) {
    return { type: adminConsts.DISCONFIRM_GOODS_FAILURE, error }
  }
}
function finish(id: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request(id))

    transService.finish(id).then(
      () => {
        dispatch(success(id))
        dispatch(alertActionCreators.success('Finish transaction Successful'))
      },
      (error: string) => {
        dispatch(failure(error, id))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function request(id: string) {
    return { type: adminConsts.FINISH_REQUEST, id }
  }
  function success(id: string) {
    return { type: adminConsts.FINISH_SUCCESS, id }
  }
  function failure(error: string, id: string) {
    return { type: adminConsts.FINISH_FAILURE, error, id }
  }
}
function disconfirm(id: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request())

    userService.disconfirm(id).then(
      () => {
        dispatch(success())
        dispatch(alertActionCreators.success('Operation succeed'))
        setTimeout(function() {
          history.replace('/admin')
        }, 1000)
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function request() {
    return { type: adminConsts.DISCONFIRM_COMPANY_REQUEST }
  }
  function success() {
    return { type: adminConsts.DISCONFIRM_COMPANY_SUCCESS }
  }
  function failure(error: string) {
    return { type: adminConsts.DISCONFIRM_COMPANY_FAILURE, error }
  }
}
const listUnconfirmedCompanies: ActionCreator<
  ThunkAction<void, RootState, void>
> = () => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())
    userService
      .listUnconfirmedCompanies()
      .then(
        (users: Array<User>) => dispatch(success(users)),
        (error: string) => dispatch(failure(error))
      )
  }

  function request(): Action {
    return { type: adminConsts.GET_UNCONFIRMED_COMPANIES_REQUEST }
  }
  function success(unconfirmedCompanies: User[]): Action {
    unconfirmedCompanies.forEach(company => (company.itemType = 'Company'))
    return {
      type: adminConsts.GET_UNCONFIRMED_COMPANIES_SUCCESS,
      unconfirmedCompanies
    }
  }
  function failure(error: string): Action {
    return { type: adminConsts.GET_UNCONFIRMED_COMPANIES_FAILURE, error }
  }
}
const listUnconfirmedGoods: ActionCreator<
  ThunkAction<void, RootState, void>
> = () => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())
    goodsService
      .listUnconfirmedProof()
      .then(
        (Goods: Array<Goods>) => dispatch(success(Goods)),
        (error: string) => dispatch(failure(error))
      )
  }

  function request(): Action {
    return { type: adminConsts.GET_UNVERIFIED_GOODS_REQUEST }
  }
  function success(UnconfirmedGoods: User[]): Action {
    UnconfirmedGoods.forEach(Goods => (Goods.itemType = 'Goods'))
    return {
      type:adminConsts.GET_UNVERIFIED_GOODS_SUCCESS,
      UnconfirmedGoods
    }
  }
  function failure(error: string): Action {
    return { type: adminConsts.GET_UNVERIFIED_GOODS_FAILURE, error }
  }
}
const getConfirmingCompany: ActionCreator<
  ThunkAction<void, RootState, void>
> = (id: string) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())
    userService
      .getById(id)
      .then(
        (user: User) => dispatch(success(user)),
        (error: string) => dispatch(failure(error))
      )
  }

  function request(): Action {
    return { type: adminConsts.GET_CONFIRMING_COMPANY_REQUEST }
  }
  function success(confirmingCompany: User): Action {
    return {
      type: adminConsts.GET_CONFIRMING_COMPANY_SUCCESS,
      confirmingCompany
    }
  }
  function failure(error: string): Action {
    return { type: adminConsts.GET_CONFIRMING_COMPANY_FAILURE, error }
  }
}
const getConfirmingGoods:ActionCreator<
ThunkAction<void, RootState, void>
> = (id: string) => {
return (dispatch: Dispatch<RootState>): void => {
  dispatch(request())
  goodsService
    .getById(id)
    .then(
      (goods: Goods) => dispatch(success(goods)),
      (error: string) => dispatch(failure(error))
    )
}

function request(): Action {
  return { type: adminConsts.GET_CONFIRMING_GOODS_REQUEST }
}
function success(confirmingGoods: Goods): Action {
  return {
    type: adminConsts.GET_CONFIRMING_GOODS_SUCCESS,
    confirmingGoods
  }
}
function failure(error: string): Action {
  return { type: adminConsts.GET_CONFIRMING_GOODS_FAILURE, error }
}
}
const getWaitingTransactions: ActionCreator<Thunk> = (option: ListOptions) => {
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
    return { type: adminConsts.GET_WAIT_FINISH_REQUEST }
  }
  function success(transactions: Array<Transaction>, total: number): Action {
    transactions.forEach(transaction => {
      transaction.itemType = 'Transaction'
      if (
        transaction.goods &&
        transaction.makerId &&
        transaction.goods.images
      ) {
        let images = transaction.goods.images.filter(
          image => image.type === adminConsts.IMAGE_TYPE_MEDIE
        )
        let certificates = transaction.goods.images.filter(
          image => image.type === adminConsts.IMAGE_TYPE_CERTIFICATE
        )
        transaction.goods.certificates = certificates
        transaction.goods.images = images
      }
    })

    return { type: adminConsts.GET_WAIT_FINISH_SUCCESS, transactions, total }
  }
  function failure(error: string): Action {
    return { type: adminConsts.GET_WAIT_FINISH_FAILURE, error }
  }
}

const getFinishedTransactions: ActionCreator<Thunk> = (option: ListOptions) => {
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
    return { type: adminConsts.GET_FINISHED_REQUEST }
  }
  function success(transactions: Array<Transaction>, total: number): Action {
    transactions.forEach(transaction => {
      transaction.itemType = 'Transaction'
      if (
        transaction.goods &&
        transaction.makerId &&
        transaction.goods.images
      ) {
        let images = transaction.goods.images.filter(
          image => image.type === adminConsts.IMAGE_TYPE_MEDIE
        )
        let certificates = transaction.goods.images.filter(
          image => image.type === adminConsts.IMAGE_TYPE_CERTIFICATE
        )
        transaction.goods.certificates = certificates
        transaction.goods.images = images
      }
    })

    return { type: adminConsts.GET_FINISHED_SUCCESS, transactions, total }
  }
  function failure(error: string): Action {
    return { type: adminConsts.GET_FINISHED_FAILURE, error }
  }
}

export const actionCreators = {
  listUnconfirmedCompanies,
  getConfirmingCompany,
  getWaitingTransactions,
  getFinishedTransactions,
  listUnconfirmedGoods,
  getConfirmingGoods,
  confirm,
  disconfirm,
  goodsConfirm,
  goodsDisconfirm,
  finish
}
