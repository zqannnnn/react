import * as React from 'react'
import {
  NavLink,
  Link,
  withRouter,
  RouteComponentProps
} from 'react-router-dom'
import { CurrencyState, AuthState } from '../../reducers'
import throttle from 'lodash.throttle'
import { Menu, Select } from 'antd'
import i18n from 'i18next'

const { Item } = Menu
interface MenuMarkupProps {
  auth: AuthState
  currency: CurrencyState
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

class MenuMarkup extends React.Component<MenuMarkupProps> {
  public static defaultProps: Partial<MenuMarkupProps> = {
    mobileVersion: false,
    menuClassName: 'mobile-navigation'
  }
  renderItem = (ReducedItem: ItemOptions) => {
    const onLinkClick = this.props.onLinkClick
    return (
      <Item key={ReducedItem.to} onClick={this.props.onLinkClick}>
        <Link to={ReducedItem.to} onClick={ReducedItem.onClick}>
          {i18n.t(ReducedItem.defaultMessage)}
        </Link>
      </Item>
    )
  }
  render() {
    let {
      auth,
      currency,
      mobileVersion,
      menuClassName,
      activeLinkKey
    } = this.props
    const { loggedIn, authInfo } = auth
    let menu: JSX.Element
    if (loggedIn) {
      menu = (
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
          <Item>
            <Link to="/">{i18n.t('Home')}</Link>
          </Item>
          {this.renderItem({
            to: '/orders/my',
            id: 'navbar.myOrders',
            defaultMessage: 'My Orders'
          })}
          {this.renderItem({
            to: '/offers/my',
            id: 'navbar.myOffers',
            defaultMessage: 'My Offers'
          })}
          {this.renderItem({
            to: '/order/new',
            id: 'navbar.addOrder',
            defaultMessage: 'Add Order'
          })}
          {this.renderItem({
            to: '/offer/new',
            id: 'navbar.addOffer',
            defaultMessage: 'Add Offer'
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

          <Select
            value={currency.currentCurrency}
            onChange={this.props.handleSelect}
          >
            {currency.items
              ? currency.items.map((item, index) => (
                  <Select.Option key={index} value={item.code}>
                    {item.code}({item.description})
                  </Select.Option>
                ))
              : ''}
          </Select>
        </Menu>
      )
    } else {
      menu = (
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
      )
    }
    return menu
  }
}
export { MenuMarkup }
