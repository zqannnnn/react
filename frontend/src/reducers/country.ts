import { countryConsts } from '../constants'
import { CountryAction } from '../actions'
import { Country } from '../models'
export type State = {
  loading?: boolean
  error?: string
  items?: Array<Country>
}
export function country(state = {}, action: CountryAction): State {
  switch (action.type) {
    case countryConsts.GET_REQUEST:
      return {
        ...state,
        loading: true
      }
    case countryConsts.GET_SUCCESS:
      return { ...state, items: action.countries }
    case countryConsts.GET_FAILURE:
      return { ...state, error: action.error }
    default:
      return state
  }
}
