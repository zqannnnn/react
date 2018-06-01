import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { orderActionCreators } from '../../actions'
import { Order } from '../../models'
import { Category, CategoryDetails } from '../../models'
import { RootState } from '../../reducers'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'antd'
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
      <div className="edits-container-wrap">
        <h3 className="header-center">
          <FormattedMessage
            id="pages.orderViewPage"
            defaultMessage="Order View Page"
          />
        </h3>
        {loading ? (
          <Icon type="loading" />
        ) : (
          <div>
            <h3>
              <FormattedMessage id="itemFeilds.title" defaultMessage="Title:" />
            </h3>
            <div>{order.title}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.storage"
                defaultMessage="Storage:"
              />
            </h3>
            <div>{order.storage}</div>
            <h3 className="label">
              <FormattedMessage id="itemFeilds.breed" defaultMessage="Breed:" />
            </h3>
            <div>{order.breed}</div>
            <h3 className="label">
              <FormattedMessage id="itemFeilds.grade" defaultMessage="Grade:" />
            </h3>
            <div>{order.grade}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.marbleScore"
                defaultMessage="MarbleScore:"
              />
            </h3>
            <div>{order.marbleScore}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.slaughterSpec"
                defaultMessage="Slaughter Specification:"
              />
            </h3>
            <div>{order.slaughterSpec}</div>
            <h3>
              <FormattedMessage id="itemFeilds.bone" defaultMessage="Bone:" />
            </h3>
            <div>{order.bone}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.primalCuts"
                defaultMessage="Primal Cuts:"
              />
            </h3>
            <div>{order.primalCuts}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.trimmings"
                defaultMessage="Trimmings:"
              />
            </h3>
            <div>{order.trimmings && order.trimmings + 'CL'}</div>
            <h3>
              <FormattedMessage id="itemFeilds.fed" defaultMessage="Fed:" />
            </h3>
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
            <h3>
              <FormattedMessage id="itemFeilds.price" defaultMessage="Price:" />
            </h3>
            <div>
              <span>{`${order.price} ${order.currencyCode}/KG`}</span>
            </div>
            <h3>
              <FormattedMessage
                id="itemFeilds.quantity"
                defaultMessage="Quantity:"
              />
            </h3>
            <div>{order.quantity && order.quantity + 'KG'}</div>
            <h3>
              <FormattedMessage id="itemFeilds.brand" defaultMessage="Brand:" />
            </h3>
            <div>{order.brand}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.factoryNum"
                defaultMessage="Factory Number:"
              />
            </h3>
            <div>{order.factoryNum}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.deliveryTerm"
                defaultMessage="Delivery Term:"
              />
            </h3>
            <div>{order.deliveryTerm}</div>
            <h3>
              <FormattedMessage
                id="itemFeilds.placeOfOrigin"
                defaultMessage="Place Of Origin:"
              />
            </h3>
            <div>{order.placeOfOrigin}</div>
          </div>
        )}
      </div>
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
