import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { orderActionCreators } from '../../actions'
import { Order } from '../../models'
import { Category, CategoryDetails } from '../../models'
import { RootState } from '../../reducers'
import i18n from 'i18next'
import { Icon, Row, Col } from 'antd'
interface OrderProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<RootState>
  order: Order
}
interface OrderState {
  orderId?: string
  loading: boolean
}
class ViewPage extends React.Component<OrderProps, OrderState> {
  constructor(props: OrderProps) {
    super(props)
    this.state = {
      loading: true
    }
  }
  componentDidMount() {
    let orderId = this.props.match.params.id
    orderId &&
      this.setState({
        ...this.state,
        orderId
      })
    orderId && this.props.dispatch(orderActionCreators.getById(orderId))
  }
  componentWillReceiveProps(nextProps: OrderProps) {
    const { order } = nextProps
    if (order) {
      this.setState({ loading: false })
    }
  }
  render() {
    const { order } = this.props
    const { loading } = this.state
    return (
      <Row>
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 16, offset: 4 }}
          md={{ span: 12, offset: 6 }}
          lg={{ span: 10, offset: 7 }}
        >
          <h3 className="header-center">{i18n.t('Order View Page')}</h3>
          {loading ? (
            <Icon type="loading" />
          ) : (
            <div>
              <h3>{i18n.t('Title:')}</h3>
              <div>{order.title}</div>
              <h3>{i18n.t('Storage:')}</h3>
              <div>{order.storage}</div>
              <h3 className="label">{i18n.t('Breed:')}</h3>
              <div>{order.breed}</div>
              <h3 className="label">{i18n.t('Grade:')}</h3>
              <div>{order.grade}</div>
              <h3>{i18n.t('MarbleScore:')}</h3>
              <div>{order.marbleScore}</div>
              <h3>{i18n.t('Slaughter Specification:')}</h3>
              <div>{order.slaughterSpec}</div>
              <h3>{i18n.t('Bone:')}</h3>
              <div>{order.bone}</div>
              <h3>{i18n.t('Primal Cuts:')}</h3>
              <div>{order.primalCuts}</div>
              <h3>{i18n.t('Trimmings:')}</h3>
              <div>{order.trimmings && order.trimmings + 'CL'}</div>
              <h3>{i18n.t('Fed:')}</h3>
              <div>
                {order.fed}
                {order.grainFedDays ? (
                  <span>
                    <br />
                    {order.grainFedDays} Day
                  </span>
                ) : (
                  ''
                )}
              </div>
              <h3>{i18n.t('Price:')}</h3>
              <div>
                <span>
                  {order.price && `${order.price} ${order.currencyCode}/KG`}
                </span>
              </div>
              <h3>{i18n.t('Quantity:')}</h3>
              <div>{order.quantity && order.quantity + 'KG'}</div>
              <h3>{i18n.t('Brand:')}</h3>
              <div>{order.brand}</div>
              <h3>{i18n.t('Factory Number:')}</h3>
              <div>{order.factoryNum}</div>
              <h3>{i18n.t('Delivery Term:')}</h3>
              <div>{order.deliveryTerm}</div>
              <h3>{i18n.t('Place Of Origin:')}</h3>
              <div>{order.placeOfOrigin}</div>
            </div>
          )}
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { order } = state
  const { orderData } = order
  return { order: orderData }
}
const connectedViewPage = connect(mapStateToProps)(ViewPage)
export { connectedViewPage as ViewPage }
