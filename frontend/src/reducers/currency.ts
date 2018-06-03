import { currencyConsts } from '../constants'
import { CurrencyAction } from '../actions'
import { Currency } from '../models'
export type State = {
  loading?: boolean
  error?: string
  items?: Array<Currency>
  currentCurrency?: string
}
export function currency(
  state = { currentCurrency: 'CNY' },
  action: CurrencyAction
): State {
  switch (action.type) {
    case currencyConsts.GET_REQUEST:
      return {
        ...state,
        loading: true
      }
    case currencyConsts.GET_SUCCESS:
      return { ...state, items: action.currencys }
    case currencyConsts.GET_FAILURE:
      return { error: action.error }
    case currencyConsts.UPDATE_CURRENCY_STATE:
      return { ...state, currentCurrency: action.currencyState }
    default:
      return state
  }
}
