import orderConstants from '../constants/order';
import {Action} from '../actions/order'
import {Order} from '../models/order'
export type State = {
  editing?:boolean;
  cancelling?:boolean;
  cancellError?:string;
  loading?:boolean;
  error?:string;
  orderData?:Order;
  items?:Array<Order>;
};
export function order(state:State ={} , action:Action):State {
  switch (action.type) {
    case orderConstants.CREATE_REQUEST:
      return { editing: true };
    case orderConstants.CREATE_SUCCESS:
      return {};
    case orderConstants.CREATE_FAILURE:
      return {error : action.error};
    case orderConstants.EDIT_REQUEST:
      return { editing:true };
    case orderConstants.EDIT_SUCCESS:
      return {};
    case orderConstants.EDIT_FAILURE:
      return {error : action.error};
    case orderConstants.CANCELL_REQUEST:
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
    case orderConstants.CANCELL_SUCCESS:
      if (state.items) 
        return {
          ...state,
          items: state
            .items
            .map(item => item.id === action.id
              ? {
                ...item,
                cancelling: false,
                status:orderConstants.ORDER_STATUS_CANCELLED
              }
              : item)
        };
    case orderConstants.CANCELL_FAILURE:
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
    case orderConstants.GET_REQUEST:
      return {loading: true};
    case orderConstants.GET_SUCCESS:
      return {orderData: action.data};
    case orderConstants.GET_FAILURE:
      return {error: action.error};
    case orderConstants.GETALL_REQUEST:
      return {loading: true};
    case orderConstants.GETALL_SUCCESS:
      return {items: action.orders};
    case orderConstants.GETALL_FAILURE:
      return {error: action.error};
    default:
      return state
  }
}