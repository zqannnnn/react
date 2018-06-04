import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import {
  transactionActionCreators,
  orderActionCreators,
  adminActionCreators
} from '../actions'
import {
  RootState,
  TransactionState,
  OrderState,
  AdminState
} from '../reducers'
import { AuthInfo } from '../actions'
import { List } from '../components'
import { Row, Col } from 'antd'
import i18n from 'i18next'

interface AdminProps {
  dispatch: Dispatch<RootState>
  transaction: TransactionState
  order: OrderState
  admin: AdminState
}

class AdminPage extends React.Component<AdminProps> {
  constructor(props: AdminProps) {
    super(props)
  }
  componentDidMount() {
    this.props.dispatch(
      transactionActionCreators.getAll({ selectType: 'finished' })
    )
    this.props.dispatch(orderActionCreators.getAll({ selectType: 'finished' }))
    this.props.dispatch(adminActionCreators.listUnconfirmedCompanies())
  }
  render() {
    const { transaction, order, admin } = this.props
    return (
      <div className="page">
        <div className="banner">
          <div className="banner-bg" />
          <div className="title">{i18n.t('Admin Page')}</div>
        </div>
        <Row>
          <Col
            xs={{ span: 22, offset: 1 }}
            sm={{ span: 20, offset: 2 }}
            md={{ span: 18, offset: 3 }}
            lg={{ span: 16, offset: 4 }}
          >
            <div className="list-container ">
              {transaction.items && (
                <List items={transaction.items} title="Finished Transactions" />
              )}
            </div>
            <div className="list-container">
              {order.items && (
                <List items={order.items} title="Finished Orders" />
              )}
            </div>
            <div className="list-container">
              {admin.unconfirmedCompanies && (
                <List
                  items={admin.unconfirmedCompanies}
                  title="Unconfirmed Companies"
                />
              )}
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { transaction, order, admin } = state
  return { transaction, order, admin }
}

const connectedHomePage = connect(mapStateToProps)(AdminPage)
export { connectedHomePage as AdminPage }
