import { createStore, applyMiddleware, Store,GenericStoreEnhancer } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { rootReducer, RootState } from '../reducers'

let middleware:GenericStoreEnhancer
if (process.env.NODE_ENV === 'development') {
  const loggerMiddleware = createLogger()
  middleware = applyMiddleware(thunkMiddleware, loggerMiddleware)
}else{
  middleware = applyMiddleware(thunkMiddleware)
}

export const configureStore = function(initialState?: RootState) {
  return createStore(
    rootReducer,
    initialState,
    middleware
  )
}
