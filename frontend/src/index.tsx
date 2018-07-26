import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { configureStore } from './helpers/store'
import App from './app'
import { I18nextProvider } from 'react-i18next'
import i18n from './helpers/i18n'

const store = configureStore()
ReactDOM.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <App mobileBreakPoint={800} placement="bottomLeft" />
    </I18nextProvider>
  </Provider>,
  document.getElementById('main')
)
