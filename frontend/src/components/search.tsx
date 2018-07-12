import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RootState, TransactionState } from '../reducers'
import { transactionActionCreators } from '../actions'
import { Input } from 'antd'
import { history } from '../helpers/history'
const Searchfor = Input.Search

interface ItemProps {
  dispatch: Dispatch<RootState>
}

class Search extends React.Component<ItemProps> {
  constructor(props: ItemProps) {
    super(props)
  }

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

const connectedList = connect()(Search)
export { connectedList as Search }
