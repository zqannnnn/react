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
export const actionCreators = {
  getById,
  update
}
export type Action = {
  type: string
  user?: User
  error?: string
  id?: string
  licensePath?: string
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
