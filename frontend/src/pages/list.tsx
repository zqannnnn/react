import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators } from '../actions'
import { RootState, TransactionState } from '../reducers'
import { AuthInfo } from '../actions'
import { List as ListC } from '../components'
import { Checkbox, Row, Col } from 'antd'
import { transactionConsts } from '../constants'
import i18n from 'i18next'
import { Filter } from '../components'
interface ListProps {
  dispatch: Dispatch<RootState>
  transaction: TransactionState
  type: string
}
class List extends React.Component<ListProps> {
  constructor(props: ListProps) {
    super(props)
  }
  onChange = (values: string[]) => {
    let options: { buy?: boolean; sell?: boolean } = {}
    values.forEach((value: string) => {
      if (value == transactionConsts.TYPE_BUY)
        options = { ...options, buy: true }
      else if (value == transactionConsts.TYPE_SELL)
        options = { ...options, sell: true }
    })
    this.props.dispatch(
      transactionActionCreators.getAll({
        type: this.props.type,
        ...options
      })
    )
  }
  componentDidMount() {
    this.props.dispatch(
      transactionActionCreators.getAll({ type: this.props.type })
    )
  }
  render() {
    const { transaction, type } = this.props
    return (
      <Row className="page">
        <div className="banner">
          <div className="banner-bg" />
          <div className="title">
            {type === 'mine' ? 'My ' : 'All '}
            Transaction
          </div>
        </div>
        {transaction.error && (
          <span className="text-danger">
            {i18n.t('ERROR: ')}
            {transaction.error}
          </span>
        )}
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 20, offset: 2 }}
          md={{ span: 18, offset: 3 }}
          lg={{ span: 16, offset: 4 }}
        >
          <Filter />
          {transaction.items && <ListC items={transaction.items} />}
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
export { connectedList as ListPage }
