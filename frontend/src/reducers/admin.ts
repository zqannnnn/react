import {adminConsts} from '../constants';
import {AdminAction} from '../actions'
import {User} from '../models'
export type State = {
  loading?:boolean;
  unconfirmedCompanies?:User[];
  error?:string;
};
export function admin(state:State ={} , action:AdminAction):State {
  switch (action.type) {
    case adminConsts.UNCONFIRMED_COMPANIES_REQUSET:
      return { loading: true };
    case adminConsts.UNCONFIRMED_COMPANIES_SUCCESS:
      return {...state,
        loading: false,
        unconfirmedCompanies:action.unconfirmedCompanies
      };
    case adminConsts.UNCONFIRMED_COMPANIES_FAILURE:
      return {error: action.error, loading: false};
    default:
      return state
  }
}