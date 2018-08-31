import { createStore, applyMiddleware, Store } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { rootReducer, RootState } from '../reducers'

const loggerMiddleware = createLogger()
export const configureStore = function(initialState?: RootState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunkMiddleware, loggerMiddleware)
  )
}
