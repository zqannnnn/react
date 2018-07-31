import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { authActionCreators, currencyActionCreators } from '../../actions'
import { RootState, CurrencyState, AuthState } from '../../reducers'
import { MenuMarkup } from './menu-markup'
import { Search } from './search'
import { throttle } from 'lodash'
import { Layout, Menu } from 'antd'
import './nav-bar.scss'
const { Sider } = Layout
interface NavProps {
  dispatch: Dispatch<RootState>
  auth: AuthState
  mobileBreakPoint: number
  applyViewportChange?: number
  placement: 'bottom' | 'bottomLeft' | 'top'
}
class ReNavBar extends React.Component<NavProps> {
  state = {
    isMobile: false,
    collapsed: false
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
  onclick = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
  saveViewportDimensions = throttle(() => {
    const { mobileBreakPoint } = this.props
    this.setState({
      isMobile: window.innerWidth > mobileBreakPoint
    })
  }, this.props.applyViewportChange)
  renderMenu() {
    const { auth } = this.props
    const { isMobile } = this.state
    if (isMobile) {
      return (
        <MenuMarkup
          auth={auth}
          handleSelect={this.handleSelect}
          activeLinkKey={location.hash.substring(1)}
          mobileVersion={false}
          logout={this.logout}
          onLinkClick={this.onclick}
        />
      )
    } else {
      return (
        <MenuMarkup
          auth={auth}
          handleSelect={this.handleSelect}
          logout={this.logout}
          mobileVersion={true}
          onLinkClick={this.onclick}
          activeLinkKey={location.hash.substring(1)}
        />
      )
    }
  }
  render() {
    const { isMobile, collapsed } = this.state
    if (isMobile) {
      return (
        <Layout.Header>
          <div className="nav-bar">
            {this.renderMenu()}
            <Search />
          </div>
        </Layout.Header>
      )
    } else {
      return (
        <Sider
          breakpoint="md"
          collapsedWidth="0"
          collapsed={collapsed}
          onCollapse={() => this.onclick()}
        >
          <Search />
          <Menu theme="dark" mode="inline">
            {this.renderMenu()}
          </Menu>
        </Sider>
      )
    }
  }
}
function mapStateToProps(state: RootState) {
  const { auth } = state
  return { auth }
}
const connectedReNavBar = connect(mapStateToProps)(ReNavBar)
export { connectedReNavBar as NavBar }
