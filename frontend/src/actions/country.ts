import { countryConsts } from '../constants'
import { countryService } from '../services'
import { Country } from '../models'
import { Dispatch } from 'react-redux'
import { ActionCreator } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'

export type Action = {
  type: string
  error?: string
  countries?: Array<Country>
}
type Thunk = ThunkAction<void, RootState, void>

const getAll: ActionCreator<Thunk> = () => {
  return (dispatch: Dispatch<RootState>): void => {
    dispatch(request())
    countryService
      .getAll()
      .then(
        (countries: Array<Country>) => dispatch(success(countries)),
        (error: string) => dispatch(failure(error))
      )
  }

  function request(): Action {
    return { type: countryConsts.GET_REQUEST }
  }
  function success(countries: Array<Country>): Action {
    return { type: countryConsts.GET_SUCCESS, countries }
  }
  function failure(error: string): Action {
    return { type: countryConsts.GET_FAILURE, error }
  }
}
export const actionCreators = {
  getAll
}
