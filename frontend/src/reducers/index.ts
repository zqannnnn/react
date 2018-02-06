import { combineReducers } from 'redux';

import {auth, State as AuthState} from './auth';
import {user,State as UserState} from './user';
import {alert, State as AlertState}  from './alert';
import {order, State as OrderState}  from './order';
import {offer, State as OfferState}  from './offer';
import {category, State as CategoryState}  from './category';
export const rootReducer = combineReducers({
  auth,
  user,
  alert,
  order,
  offer,
  category
});

export type RootState = {
  auth: AuthState;
  user: UserState;
  alert:AlertState;
  order:OrderState;
  offer:OfferState;
  category:CategoryState;
}

export {AuthState,UserState,AlertState,OrderState,OfferState,CategoryState}