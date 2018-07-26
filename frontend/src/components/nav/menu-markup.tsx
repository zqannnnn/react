import * as React from 'react'
import { Link } from 'react-router-dom'
import { AuthState } from '../../reducers'
import { Menu, Dropdown, Icon, Button, Layout } from 'antd'
import i18n from 'i18next'
const { Item } = Menu
interface MenuMarkupProps {
  auth: AuthState
  mobileVersion?: boolean
  menuClassName?: string
  activeLinkKey?: string
  onLinkClick?: () => void
  logout: () => void
  handleSelect: (value: string) => void
}

interface ItemOptions {
  to: string
  id: string
  defaultMessage: string
  onClick?: () => void
}

class SiderNavs extends React.Component<MenuMarkupProps> {
  public static defaultProps: Partial<MenuMarkupProps> = {
    mobileVersion: false,
    menuClassName: 'mobile-navigation'
  }
  renderItem = (ReducedItem: ItemOptions) => {
    const onLinkClick = this.props.onLinkClick
    return (
      <Menu.Item key={ReducedItem.to} onClick={onLinkClick}>
        <Link to={ReducedItem.to} onClick={ReducedItem.onClick}>
          {i18n.t(ReducedItem.defaultMessage)}
        </Link>
      </Menu.Item>
    )
  }
  render() {
    let { auth, mobileVersion } = this.props
    const { loggedIn, authInfo } = auth
    let menu: JSX.Element
    if (loggedIn) {
      menu = (
        <>
          <Menu
            theme={mobileVersion ? 'light' : 'dark'}
            selectable={mobileVersion}
          >
            {this.renderItem({
              to: '/',
              id: 'navbar.Home',
              defaultMessage: 'Home'
            })}

            {this.renderItem({
              to: '/transactions/my',
              id: 'navbar.myTransactions',
              defaultMessage: 'My Transactions'
            })}

            {this.renderItem({
              to: '/inventory',
              id: 'navbar.myInventory',
              defaultMessage: 'My inventory'
            })}

            {this.renderItem({
              to: '/order/new',
              id: 'navbar.allOrder',
              defaultMessage: 'Add Order'
            })}

            {this.renderItem({
              to: '/profile',
              id: 'navbar.myProfile',
              defaultMessage: 'My Profile'
            })}
            {authInfo &&
              authInfo.isAdmin &&
              this.renderItem({
                to: '/admin',
                id: 'navbar.adminList',
                defaultMessage: 'Admin'
              })}

            {this.renderItem({
              to: '/login',
              id: 'navbar.logout',
              defaultMessage: 'Logout',
              onClick: this.props.logout
            })}
          </Menu>
        </>
      )
    } else {
      menu = (
        <>
          <Menu
            theme={mobileVersion ? 'light' : 'dark'}
            selectable={mobileVersion}
          >
            {this.renderItem({
              to: '/',
              id: 'navbar.Home',
              defaultMessage: 'Home'
            })}

            {this.renderItem({
              to: '/login',
              id: 'navbar.login',
              defaultMessage: 'Login'
            })}
            {this.renderItem({
              to: '/register',
              id: 'navbar.signup',
              defaultMessage: 'Sign Up'
            })}
          </Menu>
        </>
      )
    }
    return menu
  }
}
class ItemMarkup extends React.Component<MenuMarkupProps> {
  public static defaultProps: Partial<MenuMarkupProps> = {
    mobileVersion: false,
    menuClassName: 'mobile-navigation'
  }
  renderItem = (ReducedItem: ItemOptions) => {
    const onLinkClick = this.props.onLinkClick
    return (
      <Item key={ReducedItem.to} onClick={onLinkClick}>
        <Link to={ReducedItem.to} onClick={ReducedItem.onClick}>
          {i18n.t(ReducedItem.defaultMessage)}
        </Link>
      </Item>
    )
  }
  subMenu = (
    <Menu>
      {this.renderItem({
        to: '/transactions/my',
        id: 'navbar.myTransactions',
        defaultMessage: 'My Transactions'
      })}

      {this.renderItem({
        to: '/profile',
        id: 'navbar.myProfile',
        defaultMessage: 'My Profile'
      })}

      {this.renderItem({
        to: '/inventory',
        id: 'navbar.myInventory',
        defaultMessage: 'My inventory'
      })}

      {this.renderItem({
        to: '/login',
        id: 'navbar.logout',
        defaultMessage: 'Logout',
        onClick: this.props.logout
      })}
    </Menu>
  )
  render() {
    let { auth, mobileVersion, menuClassName, activeLinkKey } = this.props
    const { loggedIn, authInfo } = auth
    let menu: JSX.Element
    if (loggedIn) {
      menu = (
        <>
          <div
            className={
              'home ' + (this.props.activeLinkKey === '/' ? 'active' : '')
            }
            onClick={this.props.onLinkClick}
          >
            <Link to="/">{i18n.t('Home')}</Link>
          </div>
          <Menu
            theme={mobileVersion ? 'light' : 'dark'}
            mode={mobileVersion ? 'vertical' : 'horizontal'}
            style={
              mobileVersion
                ? { borderRight: 'none' }
                : { lineHeight: '64px', float: 'right', borderBottom: 'none' }
            }
            className={menuClassName}
            selectedKeys={[activeLinkKey || '/']}
            selectable={mobileVersion}
          >
            {this.renderItem({
              to: '/order/new',
              id: 'navbar.allOrder',
              defaultMessage: 'Add Order'
            })}

            {authInfo &&
              authInfo.isAdmin &&
              this.renderItem({
                to: '/admin',
                id: 'navbar.adminList',
                defaultMessage: 'Admin'
              })}

            <Dropdown overlay={this.subMenu} trigger={['click']}>
              <a className="ant-menu-item" href="#">
                Personal center<Icon type="down" />
              </a>
            </Dropdown>
          </Menu>
        </>
      )
    } else {
      menu = (
        <>
          <div className="home">
            <Link to="/">{i18n.t('Home')}</Link>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px', float: 'right' }}
            selectable={false}
          >
            {this.renderItem({
              to: '/login',
              id: 'navbar.login',
              defaultMessage: 'Login'
            })}
            {this.renderItem({
              to: '/register',
              id: 'navbar.signup',
              defaultMessage: 'Sign Up'
            })}
          </Menu>
        </>
      )
    }
    return menu
  }
}

export { ItemMarkup, SiderNavs }
