import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators, orderActionCreators } from '../actions'
import { RootState, TransactionState, OrderState } from '../reducers'
import { AuthInfo } from '../actions'
import { List as ListC } from '../components'
import { Row, Col } from 'antd'
interface ListProps {
  dispatch: Dispatch<RootState>
  transaction: TransactionState
  order: OrderState
  selectType: string
  listType: string
}
class List extends React.Component<ListProps> {
  constructor(props: ListProps) {
    super(props)
  }
  componentDidMount() {
    if (this.props.listType === 'transaction')
      this.props.dispatch(
        transactionActionCreators.getAll({ selectType: this.props.selectType })
      )
    else
      this.props.dispatch(
        orderActionCreators.getAll({ selectType: this.props.selectType })
      )
  }
  render() {
    const { transaction, order, listType, selectType } = this.props
    return (
      <Row className="page">
        <div className="banner">
          <div className="banner-bg" />
          <div className="title">
            {selectType === 'mine' ? 'My ' : 'All '}
            {listType === 'transaction' ? 'Transaction' : 'Order'}
          </div>
        </div>
        {transaction.error && (
          <span className="text-danger">ERROR: {transaction.error}</span>
        )}
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 20, offset: 2 }}
          md={{ span: 18, offset: 3 }}
          lg={{ span: 16, offset: 4 }}
        >
          {listType === 'transaction'
            ? transaction.items && <ListC items={transaction.items} />
            : order.items && <ListC items={order.items} />}
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { transaction, order } = state
  return { transaction, order }
}

const connectedList = connect(mapStateToProps)(List)
export { connectedList as ListPage }
