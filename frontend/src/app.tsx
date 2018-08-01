import * as React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import i18n from 'i18next'
import * as socketIOClient from 'socket.io-client' //1532692062 chat

import { history } from './helpers/history'
import { alertActionCreators, authActionCreators } from './actions'
import { PrivateRoute, AdminRoute, NavBar, Lightbox, Chat } from './components'
import {
  LoginPage,
  RegisterPage,
  LostPassPage,
  ResetPassPage
} from './pages/auth'
import {
  EditPage as TransactionEditPage,
  ViewPage as TransactionViewPage,
  OrderEditPage
} from './pages/transaction'
import {
  EditPage as GoodsEditPage,
  ViewPage as GoodsViewPage
} from './pages/goods'
import { ProfilePage, CompanyConfirmPage, MyInventoryPage } from './pages/user'
import { AdminPage, HomePage, AllListPage, MyListPage } from './pages'
import { RootState, LightboxState, AuthState, AlertState } from './reducers'
import { Layout, Alert, BackTop } from 'antd'
import './app.scss'

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
    //1532692062 chat
    this.state = {
      endpoint: "http://localhost:3000" // this is where we are connecting to with sockets
    }

  }
  
  send = () => {
    //1532692062 chat
    const socket = socketIOClient(this.state.endpoint)
    
    // this emits an event to the socket (your server) with an argument of 'red'
    // you can make the argument any color you would like, or any kind of data you want to send.
    
    socket.emit('change color', 'red') 
    // socket.emit('change color', 'red', 'yellow') | you can have multiple arguments
    
  }
  
  render() {
    const { auth } = this.props
    //1532692062 chat
    // Within the render method, we will be checking for any sockets.
    // We do it in the render method because it is ran very often.
    //const socket = socketIOClient(this.state.endpoint)
    
    // socket.on is another method that checks for incoming events from the server
    // This method is looking for the event 'change color'
    // socket.on takes a callback function for the first argument
    //socket.on('change color', (color: any) => {
      // setting the color of our button
    //  document.body.style.backgroundColor = color
    //})

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
          <NavBar mobileBreakPoint={768} placement="bottomLeft" />
          <Lightbox />
          
            <Layout.Content className="page-wr">
              {alert.message && (
                <Alert message={alert.message} type={alert.type} />
              )}
              <Switch>
                <Route exact path="/" component={HomePage} />
                <PrivateRoute path="/reset/pass" component={ResetPassPage} />
                <PrivateRoute path="/transactions/my" component={MyListPage} />
                <Route path="/transactions" component={AllListPage} />
                <PrivateRoute
                  path="/transaction/new/:goodsId"
                  component={TransactionEditPage}
                />
                <PrivateRoute path="/order/new/" component={OrderEditPage} />
                <PrivateRoute
                  path="/transaction/edit/:id"
                  component={TransactionEditPage}
                />
                <PrivateRoute
                  path="/transaction/:id"
                  component={TransactionViewPage}
                />
                <PrivateRoute path="/goods/new" component={GoodsEditPage} />
                <PrivateRoute
                  path="/goods/edit/:id"
                  component={GoodsEditPage}
                />
                <PrivateRoute path="/goods/:id" component={GoodsViewPage} />
                <PrivateRoute path="/profile" component={ProfilePage} />
                <PrivateRoute path="/user/:id" component={ProfilePage} />
                <PrivateRoute path="/inventory" component={MyInventoryPage} />
                <AdminRoute path="/admin" component={AdminPage} />
                <AdminRoute
                  path="/company/confirm/:id"
                  component={CompanyConfirmPage}
                />
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/lost/pass" component={LostPassPage} />
              </Switch>
              <BackTop>
                <div className="ant-back-top-inner">UP</div>
              </BackTop>
            </Layout.Content>
            </div>
        </Router>
        {/* //1532692062 chat */}
        <Chat auth={auth} />
        <Layout.Footer style={{ textAlign: 'center' }} onClick={() => this.send()}>
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
