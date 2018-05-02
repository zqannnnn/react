import {adminConsts} from '../constants';
import {AdminAction} from '../actions'
import {User} from '../models'
export type State = {
  loading?: boolean;
  processing?:boolean;
  unconfirmedCompanies?: User[];
  confirmingCompany?: User;
  error?: string;
};
export function admin(state : State = {}, action : AdminAction) : State {
  switch(action.type) {
    case adminConsts.GET_UNCONFIRMED_COMPANIES_REQUSET:
      return {loading: true};
    case adminConsts.GET_UNCONFIRMED_COMPANIES_SUCCESS:
      return {
        ...state,
        loading: false,
        unconfirmedCompanies: action.unconfirmedCompanies
      };
    case adminConsts.GET_UNCONFIRMED_COMPANIES_FAILURE:
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
    
    case adminConsts.CONFIRM_COMPANY_REQUSET:
      return {
        ...state,
        processing: true
      };
    case adminConsts.CONFIRM_COMPANY_SUCCESS:
      return {
        ...state,
        processing: false
      };
    case adminConsts.DISCONFIRM_COMPANY_REQUSET:
      return {error: action.error, processing: false};
      case adminConsts.CONFIRM_COMPANY_REQUSET:
      return {
        ...state,
        processing: true
      };
    case adminConsts.DISCONFIRM_COMPANY_SUCCESS:
      return {
        ...state,
        processing: true
      };
    case adminConsts.DISCONFIRM_COMPANY_FAILURE:
      return {error: action.error, processing: false};
    default:
      return state
  }
}