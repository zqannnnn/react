import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators } from '../actions'
import { RootState, TransactionState } from '../reducers'
import { List as ListC } from '../components'
import { Row, Col, Pagination } from 'antd'
import { transactionConsts } from '../constants'
import i18n from 'i18next'
import { Filter } from '../components'
import { ListOptions } from '../models'

interface ListProps {
  dispatch: Dispatch<RootState>
  transaction: TransactionState
  type: string
}
interface ListState {
  options: ListOptions
}
class List extends React.Component<ListProps, ListState> {
  constructor(props: ListProps) {
    super(props)
    this.state = {
      options: {
        type: 'mine',
        page: 1,
        pageSize: transactionConsts.LIST_PAGE_SIZE
      }
    }
  }

  onPageChange = (current: number, defaultPageSize: number) => {
    const options = this.state.options
    options.page = current
    options.pageSize = defaultPageSize
    this.setState({ options })
    this.props.dispatch(
      transactionActionCreators.getAll({
        type: this.props.type,
        ...options
      })
    )
    window.scrollTo(0, 0)
  }
  onOptionsChange = (newOptions: ListOptions) => {
    const oldOptions = this.state.options
    const options = { ...oldOptions, ...newOptions }
    this.setState({ options })
    this.props.dispatch(transactionActionCreators.getAll(options))
  }
  componentDidMount() {
    this.props.dispatch(transactionActionCreators.getAll(this.state.options))
  }
  render() {
    const { transaction } = this.props
    return (
      <Row className="page">
        <div className="banner">
          <div className="banner-bg" />
          <div className="title">{i18n.t('My Transaction')}</div>
        </div>
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 20, offset: 2 }}
          md={{ span: 18, offset: 3 }}
          lg={{ span: 16, offset: 4 }}
        >
          <Filter
            initOptions={this.state.options}
            onOptionsChange={this.onOptionsChange}
          />
          {transaction.items && <ListC items={transaction.items} />}
          <Pagination
            defaultCurrent={1}
            defaultPageSize={9}
            hideOnSinglePage={true}
            total={transaction.total}
            onChange={this.onPageChange}
          />
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { transaction } = state
  return { transaction }
}

const connectedList = connect(mapStateToProps)(List)
export { connectedList as MyListPage }
