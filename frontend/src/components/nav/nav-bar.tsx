import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { authActionCreators, currencyActionCreators } from '../../actions'
import { RootState, CurrencyState, AuthState } from '../../reducers'
import { ItemMarkup, SiderNavs } from './menu-markup'
import { Search } from './search'
import { throttle } from 'lodash'
import { Popover, Layout, Menu } from 'antd'

import './nav-bar.scss'
const { Header, Sider, Content } = Layout
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
  renderMenu() {
    const { auth, mobileBreakPoint } = this.props
    const { viewportWidth } = this.state
    console.log(viewportWidth)
    if (viewportWidth > mobileBreakPoint || !this.props.auth.loggedIn) {
      return (
        <ItemMarkup
          auth={auth}
          handleSelect={this.handleSelect}
          logout={this.logout}
        />
      )
    }
  }
  render() {
    return (
      <Layout.Header>
        <div className="nav-bar">
          {this.renderMenu()}
          <Search />
        </div>
      </Layout.Header>
    )
  }
}
class SiderNav extends React.Component<NavProps> {
  public static defaultProps: Partial<NavProps> = {
    mobileBreakPoint: 0,
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
  renderMenu() {
    const { auth, mobileBreakPoint } = this.props
    const { viewportWidth } = this.state
    if (viewportWidth > mobileBreakPoint || !this.props.auth.loggedIn) {
      return (
        <SiderNavs
          auth={auth}
          handleSelect={this.handleSelect}
          logout={this.logout}
        />
      )
    }
  }

  render() {
    return (
      <Sider breakpoint="sm" collapsedWidth="0">
        <Search />
        <Menu theme="dark" mode="inline">
          {this.renderMenu()}
        </Menu>
      </Sider>
    )
  }
}
function mapStateToProps(state: RootState) {
  const { auth } = state
  return { auth }
}
const connectedReNavBar = connect(mapStateToProps)(ReNavBar)
const connectedReSiderNav = connect(mapStateToProps)(SiderNav)
export { connectedReNavBar as NavBar, connectedReSiderNav as SiderNav }
