import categoryConstants from '../constants/category';
import {Action} from '../actions/category'
import {Entity as Category} from '../models/category'
export type State = {
  loading?:boolean;
  error?:string;
  items?:Array<Category>;
};
export function category(state ={} , action:Action):State {
  switch (action.type) {
    case categoryConstants.GET_REQUEST:
      return { loading: true };
    case categoryConstants.GET_SUCCESS:
      return {items:action.categorys};
    case categoryConstants.GET_FAILURE:
      return {error : action.error};
    default:
      return state
  }
}