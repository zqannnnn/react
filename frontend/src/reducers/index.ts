import { combineReducers } from 'redux';

import {auth, State as AuthState} from './auth';
import {user,State as UserState} from './user';
import {alert, State as AlertState}  from './alert';
import {order, State as OrderState}  from './order';
import {offer, State as OfferState}  from './offer';
import {category, State as CategoryState}  from './category';
import {currency, State as CurrencyState}  from './currency';
export const rootReducer = combineReducers({
  auth,
  user,
  alert,
  order,
  offer,
  category,
  currency
});

export type RootState = {
  auth: AuthState;
  user: UserState;
  alert:AlertState;
  order:OrderState;
  offer:OfferState;
  category:CategoryState;
  currency:CurrencyState;
}

export {AuthState,UserState,AlertState,OrderState,OfferState,CategoryState,CurrencyState}