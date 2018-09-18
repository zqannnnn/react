import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { AuthState, RootState } from '../../reducers'
import { authActionCreators } from '../../actions'
import { Menu, Dropdown, Icon, Layout, Button } from 'antd'
import i18n from 'i18next'
import './nav.scss'
const { Item, SubMenu } = Menu
const { Sider } = Layout
interface NavProps {
  dispatch: Dispatch<RootState>
  auth: AuthState
}
class Nav extends React.Component<NavProps> {
  logout = () => {
    this.props.dispatch(authActionCreators.logout())
  }

  render() {
    const { loggedIn, authInfo } = this.props.auth
    if (loggedIn && authInfo) {
      return (
        <div className="nav">
          <div className="body">
            <div className="logo">LOGO</div>
            <div className="user-group">
              <div className="avatar" />
              <div className="name">{authInfo.name}</div>
              <Dropdown
                overlay={
                  <Menu>
                    <Item>
                      <Link to="/profile">{i18n.t('My Profile')}</Link>
                    </Item>
                    <Item>
                      <Link to="/inventory">{i18n.t('My Inventory')}</Link>
                    </Item>
                    <Item>
                      <Link to="/order/new">{i18n.t('Add Order')}</Link>
                    </Item>
                    <Item>
                      <Link to="/chats ">{i18n.t('My Chats')}</Link>
                    </Item>
                    {authInfo.isAdmin && (
                      <Item>
                        <Link to="/admin">{i18n.t('Admin')}</Link>
                      </Item>
                    )}
                    <Item>
                      <Link to="/login" onClick={this.logout}>
                        {i18n.t(' Logout ')}
                      </Link>
                    </Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <Icon className="icon-down" type="down" />
              </Dropdown>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="nav">
          <div className="body">
            <div className="logo">LOGO</div>
            <div className="user-group">
              <Link to="/login">
                <Button size="small" className="login-btn">
                  {i18n.t('Sign in')}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="small" className="register-btn">
                  {i18n.t('Register')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )
    }
  }
}
function mapStateToProps(state: RootState) {
  const { auth } = state
  return { auth }
}
const connectedReNav = connect(mapStateToProps)(Nav)
export { connectedReNav as Nav }
