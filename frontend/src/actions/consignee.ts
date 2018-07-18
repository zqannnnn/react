import { consigneeConsts } from '../constants'
import { consigneeService } from '../services'
import { alertActionCreators } from '.'
import { history } from '../helpers/history'
import { Consignee } from '../models'
import { Dispatch } from 'react-redux'
import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'
import { ListOptions } from '../models'
import { consignee } from '../reducers/consignee'

export type Action = {
  type: string
  error?: string
  consignees?: Array<Consignee>
  data?: Consignee
}

type Thunk = ThunkAction<void, RootState, void>

// prefixed function name with underscore because new is a reserved word in
const _new: ActionCreator<Thunk> = (consignee: Consignee) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())
    consigneeService.new(consignee).then(
      () => {
        dispatch(success(consignee))
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }
  function request(): Action {
    return { type: consigneeConsts.CONSIGNEE_REQUEST }
  }
  // function success(): Action {
  //   return { type: consigneeConsts.CONSIGNEE_SUCCESS}
  // }
  function success(consignee: Consignee): Action {
    return { type: consigneeConsts.CONSIGNEE_SUCCESS, data: consignee }
  }
  function failure(error: string): Action {
    return { type: consigneeConsts.CONSIGNEE_FAILURE, error }
  }
}

export const actionCreators = {
  new: _new
}
