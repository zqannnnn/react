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

type Thunk = ThunkAction<void, RootState, void>

const getAll: ActionCreator<Thunk> = () => {
    console.log('getAll')
  return (dispatch: Dispatch<RootState>): void => {
    //dispatch(request())
    /*
    transService.getAll(option).then(
      (result: { transactions: Array<Transaction>; total: number }) =>
        //dispatch(success(result.transactions, result.total)),
      (error: string) => {
        //dispatch(failure(error))
        //dispatch(alertActionCreators.error(error))
      }
    )
    */
  }

/*
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
*/  
}

export const actionCreators = {
  getAll,
}
