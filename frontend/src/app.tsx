import * as React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import i18n from 'i18next'

import { history } from './helpers/history'
import { alertActionCreators, authActionCreators } from './actions'
import { PrivateRoute, AdminRoute, NavBar, Lightbox } from './components'
import {
  LoginPage,
  RegisterPage,
  LostPassPage,
  ResetPassPage
} from './pages/auth'
import {
  EditPage as TransactionEditPage,
  ViewPage as TransactionViewPage
} from './pages/transaction'
import { ProfilePage, CompanyConfirmPage } from './pages/user'
import { AdminPage, HomePage, ListPage } from './pages'
import { RootState, LightboxState, AuthState, AlertState } from './reducers'
import { Layout, Alert } from 'antd'
import './app.css'
interface AppProps {
  dispatch: (action: any) => void
  alert: AlertState
  lightbox: LightboxState
  auth: AuthState
}
class App extends React.Component<AppProps, any> {
  constructor(props: AppProps) {
    super(props)

    const { dispatch, auth } = this.props
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(alertActionCreators.clear())
    })
    if (auth.loggedIn) dispatch(authActionCreators.refresh())
  }
  render() {
    /*
    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    };
    */

    const { alert, lightbox } = this.props
    return (
      <Layout>
        <Router history={history}>
          <div>
            <Layout.Header>
              <NavBar mobileBreakPoint={1030} placement="bottomLeft" />
            </Layout.Header>
            {lightbox.showing && <Lightbox />}
            <Layout.Content>
              {alert.message && (
                <Alert message={alert.message} type={alert.type} />
              )}
              <Switch>
                <Route exact path="/" component={HomePage} />
                <PrivateRoute path="/reset/pass" component={ResetPassPage} />
                
                
                <PrivateRoute
                  path="/transactions/my"
                  component={() => (
                    <ListPage selectType="mine" listType="transaction" />
                  )}
                />
                <PrivateRoute
                  path="/transactions"
                  component={() => (
                    <ListPage selectType="all" listType="transaction" />
                  )}
                />
                <PrivateRoute
                  path="/transaction/new"
                  component={TransactionEditPage}
                />
                <PrivateRoute
                  path="/transaction/edit/:id"
                  component={TransactionEditPage}
                />
                <PrivateRoute
                  path="/transaction/:id"
                  component={TransactionViewPage}
                />
                <PrivateRoute path="/profile" component={ProfilePage} />
                <AdminRoute path="/admin" component={AdminPage} />
                <AdminRoute
                  path="/company/confirm/:id"
                  component={CompanyConfirmPage}
                />
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/lost/pass" component={LostPassPage} />
              </Switch>
            </Layout.Content>
          </div>
        </Router>
        <Layout.Footer style={{ textAlign: 'center' }}>
          {i18n.t('Beef Trade Platform ©2018 Created by FusionICO')}
        </Layout.Footer>
      </Layout>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { alert, lightbox, auth } = state
  return { alert, lightbox, auth: auth }
}

export default connect(mapStateToProps)(App)
