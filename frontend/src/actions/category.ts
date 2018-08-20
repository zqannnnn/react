import { categoryConsts } from '../constants'
import { categoryService } from '../services'
import { history } from '../helpers/history'
import * as auth from '../helpers/auth'
import { Category } from '../models'
import { Dispatch } from 'react-redux'
import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'

export type Action = {
  type: string
  error?: string
  categories?: Array<Category>
}
type Thunk = ThunkAction<void, RootState, void>

const getAll: ActionCreator<ThunkAction<void, RootState, void>> = () => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())
    categoryService
      .getAll()
      .then(
        (categories: Array<Category>) => dispatch(success(categories)),
        (error: string) => dispatch(failure(error))
      )
  }

  function request(): Action {
    return { type: categoryConsts.GET_REQUEST }
  }
  function success(categories: Array<Category>): Action {
    return { type: categoryConsts.GET_SUCCESS, categories }
  }
  function failure(error: string): Action {
    return { type: categoryConsts.GET_FAILURE, error }
  }
}
export const actionCreators = {
  getAll
}
