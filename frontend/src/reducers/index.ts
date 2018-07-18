import { combineReducers } from 'redux'

import { auth, State as AuthState } from './auth'
import { user, State as UserState } from './user'
import { alert, State as AlertState } from './alert'
import { transaction, State as TransactionState } from './transaction'
import { goods, State as GoodsState } from './goods'
import { consignee, State as ConsigneeState } from './consignee'
import { category, State as CategoryState } from './category'
import { currency, State as CurrencyState } from './currency'
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
  admin,
  consignee
})

export type RootState = {
  auth: AuthState
  user: UserState
  alert: AlertState
  transaction: TransactionState
  goods: GoodsState
  category: CategoryState
  currency: CurrencyState
  lightbox: LightboxState
  admin: AdminState
  consignee: ConsigneeState
}

export {
  AuthState,
  UserState,
  AlertState,
  TransactionState,
  GoodsState,
  CategoryState,
  CurrencyState,
  LightboxState,
  AdminState,
  ConsigneeState
}
