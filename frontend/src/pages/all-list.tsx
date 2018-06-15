import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators } from '../actions'
import { RootState, TransactionState } from '../reducers'
import { List as ListC } from '../components'
import { Checkbox, Row, Col } from 'antd'
import { transactionConsts } from '../constants'
import i18n from 'i18next'
import { Filter } from '../components'
import { ListOptions } from '../models'
import { history } from '../helpers/history'
import * as QS from 'query-string'

interface ListProps {
  dispatch: Dispatch<RootState>
  transaction: TransactionState
}
interface ListStates {
  searched?: boolean
}

class List extends React.Component<ListProps, ListStates> {
  constructor(props: ListProps) {
    super(props)
    this.state = {
      searched: false
    }
  }
  getTransaction = () => {
    let keywordParams = QS.parse(history.location.search)
    let keyword = keywordParams.keyword
    let options: ListOptions = { type: 'all' }
    if (keyword) {
      options.keyword = keyword
      this.setState({ searched: !this.state.searched })
    }
    this.props.dispatch(transactionActionCreators.getAll(options))
  }
  componentDidMount() {
    this.getTransaction()
    history.listen((location, action) => {
      this.getTransaction()
    })
  }

  render() {
    const { transaction } = this.props
    return (
      <Row className="page">
        {!this.state.searched && (
          <div className="banner">
            <div className="banner-bg" />
            <div className="title">{i18n.t('All Transaction')}</div>
          </div>
        )}
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 20, offset: 2 }}
          md={{ span: 18, offset: 3 }}
          lg={{ span: 16, offset: 4 }}
        >
          {this.state.searched && <div className="edits-input" />}
          <Filter />
          {transaction.items && <ListC items={transaction.items} />}
          {transaction.error && (
            <span className="text-danger subtitle">
              {i18n.t('ERROR: ')}
              {transaction.error}
            </span>
          )}
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
export { connectedList as AllListPage }
