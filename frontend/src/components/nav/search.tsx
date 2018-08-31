import * as React from 'react'
import { Input } from 'antd'
import { history } from '../../helpers/history'
const Searchfor = Input.Search

class Search extends React.Component {
  handleSearch = (keyword: string) => {
    history.replace(`/transactions?keyword=${keyword}`)
  }

  render() {
    return (
      <div className="nav-search">
        <Searchfor
          placeholder="Search"
          onSearch={this.handleSearch}
          enterButton
        />
      </div>
    )
  }
}

export { Search }
