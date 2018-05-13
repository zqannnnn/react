import {offerConsts} from '../constants';
import {OfferAction} from '../actions'
import {Offer} from '../models'
export type State = {
  editing?:boolean;
  cancelling?:boolean;
  cancellError?:string;
  finishing?:boolean;
  finishError?:string;
  loading?:boolean;
  error?:string;
  offerData?:Offer;
  items?:Array<Offer>;
};
export function offer(state:State ={} , action:OfferAction):State {
  switch (action.type) {
    case offerConsts.CREATE_REQUEST:
      return { editing: true };
    case offerConsts.CREATE_SUCCESS:
      return {};
    case offerConsts.CREATE_FAILURE:
      return {error : action.error};
    case offerConsts.EDIT_REQUEST:
      return { editing:true };
    case offerConsts.EDIT_SUCCESS:
      return {};
    case offerConsts.EDIT_FAILURE:
      return {error : action.error};
    case offerConsts.CANCELL_REQUEST:
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
    case offerConsts.CANCELL_SUCCESS:
      if (state.items) 
        return {
          ...state,
          items: state
            .items
            .filter(item => item.id !== action.id)
        };
    case offerConsts.CANCELL_FAILURE:
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
    case offerConsts.FINISH_REQUEST:
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
    case offerConsts.FINISH_SUCCESS:
      if (state.items) 
        return {
          ...state,
          items: state
            .items
            .map(item => item.id === action.id
              ? {
                ...item,
                status:offerConsts.OFFER_STATUS_FINISHED
              }
              : item)
        };
          
    case offerConsts.FINISH_FAILURE:
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
      case offerConsts.COMMENT_REQUEST:
        if (state.items) 
            return {
              ...state,
              items: state
                .items
                .map(item => item.id === action.id
                  ? {
                    ...item,
                    processing: true
                  }
                  : item)
            };
      case offerConsts.COMMENT_SUCCESS:
        if (state.items) 
          return {
            ...state,
            items: state
              .items
              .map(item => item.id === action.id
                ? {
                  ...item,
                  comment:action.comment
                }
                : item)
          };
            
      case offerConsts.COMMENT_FAILURE:
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
    case offerConsts.GET_REQUEST:
      return {loading: true};
    case offerConsts.GET_SUCCESS:
      return {offerData: action.data};
    case offerConsts.GET_FAILURE:
      return {error: action.error};
    case offerConsts.GETALL_REQUEST:
      return {loading: true};
    case offerConsts.GETALL_SUCCESS:
      return {items: action.offers};
    case offerConsts.GETALL_FAILURE:
      return {error: action.error};
    default:
      return state
  }
}