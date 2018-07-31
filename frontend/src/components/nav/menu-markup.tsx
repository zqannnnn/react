import * as React from 'react'
import { Link } from 'react-router-dom'
import { AuthState } from '../../reducers'
import { Menu, Dropdown, Icon, Layout } from 'antd'
import i18n from 'i18next'
const { Item, SubMenu } = Menu
interface MenuMarkupProps {
  auth: AuthState
  mobileVersion?: boolean
  menuClassName?: string
  activeLinkKey?: string
  onLinkClick?: () => void
  logout: () => void
}
interface ItemOptions {
  to: string
  id: string
  defaultMessage: string
  onClick?: () => void
}

class MenuMarkup extends React.Component<MenuMarkupProps> {
  public static defaultProps: Partial<MenuMarkupProps> = {
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
  subMenu = [
    this.renderItem({
      to: '/transactions/my',
      id: 'navbar.myTransactions',
      defaultMessage: 'My Transactions'
    }),
    this.renderItem({
      to: '/profile',
      id: 'navbar.myProfile',
      defaultMessage: 'My Profile'
    }),
    this.renderItem({
      to: '/inventory',
      id: 'navbar.myInventory',
      defaultMessage: 'My inventory'
    }),
    this.renderItem({
      to: '/login',
      id: 'navbar.logout',
      defaultMessage: 'Logout',
      onClick: this.props.logout
    })
  ]
  render() {
    let { auth, mobileVersion, menuClassName, activeLinkKey } = this.props
    const { loggedIn, authInfo } = auth
    let menu: JSX.Element
    if (loggedIn) {
      if (mobileVersion == false) {
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
              theme={'dark'}
              mode={'horizontal'}
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

              <Dropdown
                overlay={<Menu>{this.subMenu}</Menu>}
                trigger={['click']}
              >
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
            <Menu
              theme={'dark'}
              mode={'inline'}
              selectedKeys={[activeLinkKey || '/']}
            >
              {this.renderItem({
                to: '/',
                id: 'navbar.Home',
                defaultMessage: 'Home'
              })}

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
              <SubMenu title={<span>Personal center</span>}>
                {this.subMenu}
              </SubMenu>
            </Menu>
          </>
        )
      }
    } else {
      if (mobileVersion == false) {
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
              theme={'dark'}
              mode={'horizontal'}
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
      } else {
        menu = (
          <>
            <Menu theme={'dark'} mode={'vertical'}>
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
    }
    return menu
  }
}
export { MenuMarkup }
