import {currencyConsts} from '../constants';
import {CurrencyAction} from '../actions'
import {Currency} from '../models'
export type State = {
  loading?:boolean;
  error?:string;
  items?:Array<Currency>;
};
export function currency(state ={} , action:CurrencyAction):State {
  switch (action.type) {
    case currencyConsts.GET_REQUEST:
      return { loading: true };
    case currencyConsts.GET_SUCCESS:
      return {items:action.currencys};
    case currencyConsts.GET_FAILURE:
      return {error : action.error};
    default:
      return state
  }
}