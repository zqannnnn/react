import { combineReducers } from 'redux'

import { auth, State as AuthState } from './auth'
import { user, State as UserState } from './user'
import { alert, State as AlertState } from './alert'
import { transaction, State as TransactionState } from './transaction'
import { goods, State as GoodsState } from './goods'
import { category, State as CategoryState } from './category'
import { currency, State as CurrencyState } from './currency'
import { country, State as CountryState } from './country'
import { lightbox, State as LightboxState } from './lightbox'
import { admin, State as AdminState } from './admin'
export const rootReducer = combineReducers({
  auth,
  user,
  alert,
  transaction,
  goods,
  category,
  currency,
  lightbox,
  country,
  admin
})

export type RootState = {
  auth: AuthState
  user: UserState
  alert: AlertState
  transaction: TransactionState
  goods: GoodsState
  category: CategoryState
  currency: CurrencyState
  country:  CountryState
  lightbox: LightboxState
  admin: AdminState
}

export {
  AuthState,
  UserState,
  AlertState,
  TransactionState,
  GoodsState,
  CategoryState,
  CurrencyState,
  CountryState,
  LightboxState,
  AdminState
}
