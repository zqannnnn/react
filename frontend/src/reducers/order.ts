import {orderConsts} from '../constants';
import {OrderAction} from '../actions'
import {Order} from '../models'
export type State = {
  editing?:boolean;
  cancelling?:boolean;
  cancellError?:string;
  loading?:boolean;
  error?:string;
  orderData?:Order;
  items?:Array<Order>;
};
export function order(state:State ={} , action:OrderAction):State {
  switch (action.type) {
    case orderConsts.CREATE_REQUEST:
      return { editing: true };
    case orderConsts.CREATE_SUCCESS:
      return {};
    case orderConsts.CREATE_FAILURE:
      return {error : action.error};
    case orderConsts.EDIT_REQUEST:
      return { editing:true };
    case orderConsts.EDIT_SUCCESS:
      return {};
    case orderConsts.EDIT_FAILURE:
      return {error : action.error};
    case orderConsts.CANCELL_REQUEST:
      if (state.items) 
          return {
            ...state,
            items: state
              .items
              .map(item => item.id === action.id
                ? {
                  ...item,
                  cancelling: true
                }
                : item)
          };
    case orderConsts.CANCELL_SUCCESS:
      if (state.items) 
        return {
          ...state,
          items: state
            .items
            .filter(item => item.id !== action.id)
        };
    case orderConsts.CANCELL_FAILURE:
      if (state.items) 
        return {
          ...state,
          items: state
            .items
            .map(item => item.id === action.id
              ? {
                ...item,
                cancelling: false,
                cancellError:action.error
              }
              : item)
        };
      case orderConsts.FINISH_REQUEST:
        if (state.items) 
            return {
              ...state,
              items: state
                .items
                .map(item => item.id === action.id
                  ? {
                    ...item,
                    finishing: true
                  }
                  : item)
            };
      case orderConsts.FINISH_SUCCESS:
        if (state.items) 
          return {
            ...state,
            items: state
              .items
              .filter(item => item.id !== action.id)
          };
      case orderConsts.FINISH_FAILURE:
        if (state.items) 
          return {
            ...state,
            items: state
              .items
              .map(item => item.id === action.id
                ? {
                  ...item,
                  finishing: false,
                  finishError:action.error
                }
                : item)
          };
    case orderConsts.GET_REQUEST:
      return {loading: true};
    case orderConsts.GET_SUCCESS:
      return {orderData: action.data};
    case orderConsts.GET_FAILURE:
      return {error: action.error};
    case orderConsts.GETALL_REQUEST:
      return {loading: true};
    case orderConsts.GETALL_SUCCESS:
      return {items: action.orders};
    case orderConsts.GETALL_FAILURE:
      return {error: action.error};
    default:
      return state
  }
}