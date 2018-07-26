import * as React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import i18n from 'i18next'
import { throttle } from 'lodash'
import { history } from './helpers/history'
import {
  alertActionCreators,
  authActionCreators,
  currencyActionCreators
} from './actions'
import {
  PrivateRoute,
  AdminRoute,
  NavBar,
  Lightbox,
  SiderNav
} from './components'
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
interface NavProps {
  dispatch: Dispatch<RootState>
  auth: AuthState
  mobileBreakPoint: number
  applyViewportChange?: number
  placement: 'bottom' | 'bottomLeft' | 'top'
}

class ReNavBar extends React.Component<NavProps> {
  public static defaultProps: Partial<NavProps> = {
    mobileBreakPoint: 575,
    applyViewportChange: 250,
    placement: 'bottom'
  }

  state = {
    viewportWidth: 0,
    menuVisible: false
  }

  logout = () => {
    this.props.dispatch(authActionCreators.logout())
  }

  handleSelect = (value: string) => {
    this.props.dispatch(currencyActionCreators.upCurrencystatus(value))
  }

  componentDidMount() {
    this.props.dispatch(currencyActionCreators.getAll())
    this.saveViewportDimensions()
    window.addEventListener('resize', this.saveViewportDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.saveViewportDimensions)
  }

  saveViewportDimensions = throttle(() => {
    this.setState({
      viewportWidth: window.innerWidth
    })
  }, this.props.applyViewportChange)

  handleMenuVisibility = (menuVisible: boolean) => {
    this.setState({ menuVisible })
  }
  render() {
    const { auth, mobileBreakPoint } = this.props
    const { viewportWidth } = this.state
    console.log(viewportWidth, mobileBreakPoint)
    if (viewportWidth > mobileBreakPoint) {
      return <NavBar mobileBreakPoint={800} placement="bottomLeft" />
    }
    return <SiderNav mobileBreakPoint={0} placement="bottomLeft" />
  }
}

function mapStateToProps(state: RootState) {
  const { auth } = state
  return { auth: auth }
}
export default connect(mapStateToProps)(ReNavBar)
