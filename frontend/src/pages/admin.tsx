import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import {
  offerActionCreators,
  orderActionCreators,
  adminActionCreators
} from '../actions'
import { RootState, OfferState, OrderState, AdminState } from '../reducers'
import { AuthInfo } from '../actions'
import { List } from '../components'
import { Row, Col } from 'antd'
import i18n from 'i18next'

interface AdminProps {
  dispatch: Dispatch<RootState>
  offer: OfferState
  order: OrderState
  admin: AdminState
}

class AdminPage extends React.Component<AdminProps> {
  constructor(props: AdminProps) {
    super(props)
  }
  componentDidMount() {
    this.props.dispatch(offerActionCreators.getAll({ selectType: 'finished' }))
    this.props.dispatch(orderActionCreators.getAll({ selectType: 'finished' }))
    this.props.dispatch(adminActionCreators.listUnconfirmedCompanies())
  }
  render() {
    const { offer, order, admin } = this.props
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
              {offer.items && (
                <List items={offer.items} title="Finished Offers" />
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
  const { offer, order, admin } = state
  return { offer, order, admin }
}

const connectedHomePage = connect(mapStateToProps)(AdminPage)
export { connectedHomePage as AdminPage }
