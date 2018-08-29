import { userConsts } from '../constants'
import { userService } from '../services'
import { alertActionCreators } from '.'
import { history } from '../helpers/history'
import * as auth from '../helpers/auth'
import { User } from '../models'
import { Dispatch } from 'react-redux'
import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'

import { consigneeService } from '../services'
import { Consignee } from '../models'

export type Action = {
  type: string
  user?: User
  error?: string
  id?: string
  licensePath?: string
  consigneeId?: string
  consignee?: Consignee
}
function getById(id: string) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request())

    userService.getById(id).then(
      (user: User) => {
        dispatch(success(user))
      },
      (error: any) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }
  function request() {
    return { type: userConsts.GET_REQUEST }
  }
  function success(user: User) {
    return { type: userConsts.GET_SUCCESS, user }
  }
  function failure(error: string) {
    return { type: userConsts.GET_FAILURE, error }
  }
}
function update(user: User) {
  return (dispatch: (action: Action) => void) => {
    dispatch(request(user))

    userService.update(user).then(
      (user: User) => {
        dispatch(success(user))
        dispatch(alertActionCreators.success('Submit user succeed'))
      },
      (error: any) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }

  function request(user: User) {
    return { type: userConsts.UPDATE_REQUEST }
  }
  function success(user: User) {
    return { type: userConsts.UPDATE_SUCCESS, user }
  }
  function failure(error: string) {
    return { type: userConsts.UPDATE_FAILURE, error }
  }
}

type Thunk = ThunkAction<void, RootState, void>

// prefixed function name with underscore because new is a reserved word in
const newConsignee: ActionCreator<Thunk> = (consignee: Consignee) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())
    consigneeService.new(consignee).then(
      (result: Consignee) => {
        dispatch(success(result))
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }
  function request(): Action {
    return { type: userConsts.CREATE_CONSIGNEE_REQUEST }
  }
  function success(result: Consignee): Action {
    return { type: userConsts.CREATE_CONSIGNEE_SUCCESS, consignee: result }
  }
  function failure(error: string): Action {
    return { type: userConsts.CREATE_CONSIGNEE_FAILURE, error }
  }
}

const editConsignee: ActionCreator<Thunk> = (
  consignee: Consignee,
  id: string
) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())

    consigneeService.edit(consignee, id).then(
      (result: Consignee) => {
        dispatch(success(result))
      },
      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }
  function request(): Action {
    return { type: userConsts.EDIT_CONSIGNEE_REQUEST }
  }
  function success(result: Consignee): Action {
    return { type: userConsts.EDIT_CONSIGNEE_SUCCESS, consignee: result }
  }
  function failure(error: string): Action {
    return { type: userConsts.EDIT_CONSIGNEE_FAILURE, error }
  }
}

const deleteConsignee: ActionCreator<Thunk> = (consigneeId: string) => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())

    consigneeService.delete(consigneeId).then(
      () => {
        dispatch(success())
        dispatch(alertActionCreators.success('delete consignee successful'))
      },

      (error: string) => {
        dispatch(failure(error))
        dispatch(alertActionCreators.error(error))
      }
    )
  }
  function request(): Action {
    return { type: userConsts.DELETE_CONSIGNEE_REQUEST }
  }
  function success(): Action {
    return { type: userConsts.DELETE_CONSIGNEE_SUCCESS, consigneeId }
  }
  function failure(error: string): Action {
    return { type: userConsts.DELETE_CONSIGNEE_FAILURE, error }
  }
}

export const actionCreators = {
  getById,
  update,
  newConsignee,
  editConsignee,
  deleteConsignee
}
