import {adminConsts} from '../constants';
import {AdminAction} from '../actions'
import {User} from '../models'
export type State = {
  loading?: boolean;
  unconfirmedCompanies?: User[];
  confirmingCompany?: User;
  error?: string;
};
export function admin(state : State = {}, action : AdminAction) : State {
  switch(action.type) {
    case adminConsts.UNCONFIRMED_COMPANIES_REQUSET:
      return {loading: true};
    case adminConsts.UNCONFIRMED_COMPANIES_SUCCESS:
      return {
        ...state,
        loading: false,
        unconfirmedCompanies: action.unconfirmedCompanies
      };
    case adminConsts.UNCONFIRMED_COMPANIES_FAILURE:
      return {error: action.error, loading: false};
    case adminConsts.GET_CONFIRMING_COMPANY_REQUSET:
      return {
        ...state,
        loading: true
      };
    case adminConsts.GET_CONFIRMING_COMPANY_SUCCESS:
      return {
        ...state,
        loading: false,
        confirmingCompany: action.confirmingCompany
      };
    case adminConsts.GET_CONFIRMING_COMPANY_FAILURE:
      return {error: action.error, loading: false};
    default:
      return state
  }
}