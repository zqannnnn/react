import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators, currencyActionCreators } from '../actions'
import { RootState, TransactionState } from '../reducers'
import { List as ListC } from '../components'
import { Checkbox, Row, Col, Pagination } from 'antd'
import { transactionConsts } from '../constants'
import i18n from 'i18next'
import { Filter, Selector } from '../components'
import { ListOptions } from '../models'
import { history } from '../helpers/history'
import * as QS from 'query-string'

interface ListProps {
  dispatch: Dispatch<RootState>
  transaction: TransactionState
  type: string
}
interface ListStates {
  searched?: boolean
  options: ListOptions
  reset: boolean
}

class List extends React.Component<ListProps, ListStates> {
  constructor(props: ListProps) {
    super(props)
    this.state = this.defaultState
  }
  defaultState = {
    searched: false,
    options: {
      type: 'all',
      page: 1,
      pageSize: transactionConsts.LIST_PAGE_SIZE
    },
    reset: false
  }
  getTransaction = () => {
    let keywordParams = QS.parse(history.location.search)
    let keyword = keywordParams.keyword
    let options = this.state.options
    if (keyword) {
      options.keyword = keyword
      this.setState({ searched: !this.state.searched, options })
    }
    this.props.dispatch(transactionActionCreators.getAll(options))
  }
  onPageChange = (current: number, defaultPageSize: number) => {
    const options = this.state.options
    options.page = current
    options.pageSize = defaultPageSize
    this.setState({ options, reset: true })
    this.props.dispatch(
      transactionActionCreators.getAll({
        type: this.props.type,
        ...options
      })
    )
  }

  componentWillReceiveProps(nextProps: ListProps) {
    if (this.state.reset) {
      this.setState({
        ...this.defaultState,
        reset: false
      })
    }
  }

  onOptionsChange = (newOptions: ListOptions) => {
    const oldOptions = this.state.options
    const options = { ...oldOptions, ...newOptions }
    this.setState({ options })
    this.props.dispatch(transactionActionCreators.getAll(options))
  }
  componentDidMount() {
    this.getTransaction()
    history.listen((location, action) => {
      this.getTransaction()
    })
    this.props.dispatch(transactionActionCreators.getAll(this.state.options))
    this.props.dispatch(currencyActionCreators.getAll())
  }

  render() {
    const { transaction } = this.props
    // const { options } = this.state;
    return (
      <div className="page">
        <h2 className="header-center">{i18n.t('All transaction')}</h2>
          <Row>
            <Col
              xs={{ span: 20, offset: 2 }}
              sm={{ span: 20, offset: 2 }}
              md={{ span: 4, offset: 2 }}
            >
              {this.state.searched && <div className="edits-input" />}
              <div className="sidebar-container">
                <Filter
                  initOptions={this.state.options}
                  onOptionsChange={this.onOptionsChange}
                />
              </div>
            </Col>
            <Col
              xs={{ span: 20, offset: 2 }}
              sm={{ span: 20, offset: 2 }}
              md={{ span: 16, offset: 0 }}
            >
              <div className="list-container" style={{ marginLeft: 30 }}>
                <div className="selector">
                  <span className="selector-side"></span>
                  <div className="selector-title">{i18n.t('Products Found')}</div>
                  <div>
                    <Selector 
                      initOptions={this.state.options}
                      onOptionsChange={this.onOptionsChange}
                    />
                  </div>
                </div>
                {transaction.total !== 0 ? <>{transaction.items && <ListC items={transaction.items} />}</> : <div className="noData">{i18n.t('No products')}</div>}
                <Pagination
                  defaultCurrent={1}
                  defaultPageSize={9}
                  hideOnSinglePage={true}
                  total={transaction.total}
                  onChange={this.onPageChange}
                  className="pagination"
                />
              </div>
            </Col>
          </Row>
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { transaction } = state
  return { transaction }
}

const connectedList = connect(mapStateToProps)(List)
export { connectedList as AllListPage }
