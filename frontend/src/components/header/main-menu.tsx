import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Search } from './search'
import { Menu, Dropdown, Icon, Layout, Button } from 'antd'
import i18n from 'i18next'
import './main-menu.scss'

class MainMenu extends React.Component {
  render() {
    return (
      <div className="main-menu">
        <div className="body">
          <div className="items-wr">
            <div className="item">
              <Link to="/">{i18n.t('HOME')}</Link>
            </div>
            <div className="item">
              <Link to="/transactions">{i18n.t('ALL TRANSACTIONS')}</Link>
            </div>
            <div className="item">
              <Link to="/transactions/my">{i18n.t('MY TRANSACTIONS')}</Link>
            </div>
          </div>
          <div className="search-wr">
            <Search />
          </div>
        </div>
      </div>
    )
  }
}

export { MainMenu }
