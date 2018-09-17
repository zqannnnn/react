import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators, adminActionCreators } from '../actions'
import { RootState, TransactionState, AdminState } from '../reducers'
import { AuthInfo } from '../actions'
import { List } from '../components'
import { Row, Col } from 'antd'
import i18n from 'i18next'

interface AdminProps {
  dispatch: Dispatch<RootState>
  admin: AdminState
}

class AdminPage extends React.Component<AdminProps> {
  constructor(props: AdminProps) {
    super(props)
  }
  componentDidMount() {
    this.props.dispatch(
      adminActionCreators.getFinishedTransactions({ type: 'finished' })
    )
    this.props.dispatch(adminActionCreators.listUnconfirmedCompanies())
    this.props.dispatch(
      adminActionCreators.getWaitingTransactions({ type: 'waiting' })
    )
    this.props.dispatch(
      adminActionCreators.listUnconfirmedGoods()
    )
  }
  render() {
    const { admin } = this.props
    return (
      <div className="page">
        <h2 className="header-center">{i18n.t('Admin Page')}</h2>
        <Row>
          <Col
            xs={{ span: 22, offset: 1 }}
            sm={{ span: 20, offset: 2 }}
            md={{ span: 18, offset: 3 }}
            lg={{ span: 16, offset: 4 }}
          >
            <div className="list-container ">
              {admin.toFinishTransactions && (
                <List
                  items={admin.toFinishTransactions}
                  title="Waiting Finish"
                />
              )}
            </div>
            <div className="list-container ">
              {admin.finishedTransactions && (
                <List
                  items={admin.finishedTransactions}
                  title="Finished Transactions"
                />
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
            <div className="list-container">
              {admin.unconfirmedGoods && (
                <List
                  items={admin.unconfirmedGoods}
                  title="verificationProof"
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
  const { admin } = state
  return { admin }
}

const connectedHomePage = connect(mapStateToProps)(AdminPage)
export { connectedHomePage as AdminPage }
