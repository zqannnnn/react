import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './helpers/store'
import App from './app'
import { I18nextProvider } from 'react-i18next'
import i18n from './helpers/i18n'

let locale = (navigator.languages && navigator.languages[0])
                || navigator.language
                || navigator.userLanguage
                || 'en'
if (locale.indexOf('en') === 0 ) locale = 'en'
if (locale.indexOf('zh') === 0 ) locale = 'zh'

ReactDOM.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </Provider>,
  document.getElementById('main')
)
