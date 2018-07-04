```jsx
const { Provider } = require('react-redux')
const { I18nextProvider } = require( 'react-i18next')
const { Router, Route, Switch } = require('react-router-dom')
const { configureStore } = require('../../helpers/store')
const { history } = require('../../helpers/history')
const i18n = require('../../helpers/i18n')
const initialState = {
  auth:{
    authInfo:{id:'1'}
  }
}
const store = configureStore(initialState)
;<Provider store={store}>
  <I18nextProvider i18n={i18n}>
  <Router history={history}>
    <Item transaction={{title:'test',userId:'1'}} />
  </Router>
  </I18nextProvider>
</Provider>
```