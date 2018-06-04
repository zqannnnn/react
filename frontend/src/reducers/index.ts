import { combineReducers } from 'redux'

import { auth, State as AuthState } from './auth'
import { user, State as UserState } from './user'
import { alert, State as AlertState } from './alert'
import { order, State as OrderState } from './order'
import { transaction, State as TransactionState } from './transaction'
import { category, State as CategoryState } from './category'
import { currency, State as CurrencyState } from './currency'
import { upload, State as UploadState } from './upload'
import { lightbox, State as LightboxState } from './lightbox'
import { admin, State as AdminState } from './admin'
export const rootReducer = combineReducers({
  auth,
  user,
  alert,
  order,
  transaction,
  category,
  currency,
  upload,
  lightbox,
  admin
})

export type RootState = {
  auth: AuthState
  user: UserState
  alert: AlertState
  order: OrderState
  transaction: TransactionState
  category: CategoryState
  currency: CurrencyState
  upload: UploadState
  lightbox: LightboxState
  admin: AdminState
}

export {
  AuthState,
  UserState,
  AlertState,
  OrderState,
  TransactionState,
  CategoryState,
  CurrencyState,
  UploadState,
  LightboxState,
  AdminState
}
