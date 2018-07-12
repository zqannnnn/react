import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { authActionCreators, currencyActionCreators } from '../../actions'
import { RootState, CurrencyState, AuthState } from '../../reducers'
import { MenuMarkup } from './menu-markup'
import { Search } from './search'
import { throttle } from 'lodash'
import { Popover, Layout } from 'antd'
import './nav-bar.css'

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
    if (viewportWidth > mobileBreakPoint || !this.props.auth.loggedIn) {
      return (
        <MenuMarkup
          auth={auth}
          handleSelect={this.handleSelect}
          logout={this.logout}
        />
      )
    }
    return (
      <Popover
        content={
          <MenuMarkup
            auth={auth}
            handleSelect={this.handleSelect}
            logout={this.logout}
            onLinkClick={() => this.handleMenuVisibility(false)}
            activeLinkKey={location.hash.substring(1)}
            mobileVersion={true}
            menuClassName="desktop-navigation"
          />
        }
        trigger="click"
        placement={this.props.placement}
        visible={this.state.menuVisible}
        onVisibleChange={this.handleMenuVisibility}
        overlayClassName="nav-pop"
      >
        <div className="menu">
          <div className="icon" />
        </div>
      </Popover>
    )
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
function mapStateToProps(state: RootState) {
  const { auth } = state
  return { auth }
}

const connectedReNavBar = connect(mapStateToProps)(ReNavBar)
export { connectedReNavBar as NavBar }
