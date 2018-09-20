import * as React from 'react'
import { Input } from 'antd'
import { history } from '../../helpers/history'
const Searchfor = Input.Search

class Search extends React.Component {
  handleSearch = (keyword: string) => {
    if (keyword !== '') {
      history.replace(`/transactions?keyword=${keyword}`)
    }
  }

  render() {
    return (
      <Searchfor
        placeholder="Search products here..."
        onSearch={this.handleSearch}
        className="search"
      />
    )
  }
}

export { Search }
