import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators, orderActionCreators } from '../actions'
import { RootState, TransactionState, OrderState } from '../reducers'
import { AuthInfo } from '../actions'
import { List as ListC } from '../components'
import { Row, Col } from 'antd'
interface HomeProps {
  dispatch: Dispatch<RootState>
  transaction: TransactionState
  order: OrderState
  authInfo: AuthInfo
}

class HomePage extends React.Component<HomeProps> {
  constructor(props: HomeProps) {
    super(props)
  }
  componentDidMount() {
    this.props.dispatch(transactionActionCreators.getAll({ selectType: 'all' }))
    this.props.dispatch(orderActionCreators.getAll({ selectType: 'all' }))
  }
  render() {
    const { authInfo, transaction, order } = this.props
    return (
      <div className="page">
        <div className="banner">
          <div className="banner-bg" />
          <div className="title">All Transaction</div>
        </div>
        <Row>
          <Col
            xs={{ span: 22, offset: 1 }}
            sm={{ span: 20, offset: 2 }}
            md={{ span: 18, offset: 3 }}
            lg={{ span: 16, offset: 4 }}
          >
            <div className="list-container">
              <div className="header">
                <div className="title">Home</div>
                <div className="subtitle">
                  <div className="des">People looking for sell</div>
                  <Link className="link" to={'/transactions'}>
                    👁 view all transactions
                  </Link>
                </div>
              </div>
              {transaction.items && <ListC items={transaction.items} />}
            </div>
            <div className="list-container">
              <div className="header">
                <div className="title">New Orders</div>
                <div className="subtitle">
                  <div className="des">People looking for buy</div>
                  <Link className="link" to={'/orders'}>
                    👁 view all orders
                  </Link>
                </div>
              </div>
              {order.items && <ListC items={order.items} />}
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { auth, transaction, order } = state
  return { authInfo: auth.authInfo, transaction, order }
}

const connectedHomePage = connect(mapStateToProps)(HomePage)
export { connectedHomePage as HomePage }
