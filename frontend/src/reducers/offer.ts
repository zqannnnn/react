import {offerConsts} from '../constants';
import {OfferAction} from '../actions'
import {Offer} from '../models'
export type State = {
  editing?:boolean;
  cancelling?:boolean;
  cancellError?:string;
  loading?:boolean;
  error?:string;
  offerData?:Offer;
  items?:Array<Offer>;
  uploading?:boolean;
  image?:string;
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
            .map(item => item.id === action.id
              ? {
                ...item,
                cancelling: false,
                status:offerConsts.OFFER_STATUS_CANCELLED
              }
              : item)
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
    case offerConsts.UPLOAD_REQUEST:
      return { uploading: true };
    case offerConsts.UPLOAD_SUCCESS:
      return {...state,
        uploading: false,
        image:action.imagePath
      };
    case offerConsts.UPLOAD_FAILURE:
      return {error : action.error,uploading: false};
    default:
      return state
  }
}