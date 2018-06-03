import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { offerActionCreators, orderActionCreators } from '../actions'
import { RootState, OfferState, OrderState } from '../reducers'
import { AuthInfo } from '../actions'
import { List as ListC } from '../components'
import { Row, Col } from 'antd'
interface ListProps {
  dispatch: Dispatch<RootState>
  offer: OfferState
  order: OrderState
  selectType: string
  listType: string
}
class List extends React.Component<ListProps> {
  constructor(props: ListProps) {
    super(props)
  }
  componentDidMount() {
    if (this.props.listType === 'offer')
      this.props.dispatch(
        offerActionCreators.getAll({ selectType: this.props.selectType })
      )
    else
      this.props.dispatch(
        orderActionCreators.getAll({ selectType: this.props.selectType })
      )
  }
  render() {
    const { offer, order, listType, selectType } = this.props
    return (
      <Row className="page">
        <div className="banner">
          <div className="banner-bg" />
          <div className="title">
            {selectType === 'mine' ? 'My ' : 'All '}
            {listType === 'offer' ? 'Offer' : 'Order'}
          </div>
        </div>
        {offer.error && (
          <span className="text-danger">ERROR: {offer.error}</span>
        )}
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 20, offset: 2 }}
          md={{ span: 18, offset: 3 }}
          lg={{ span: 16, offset: 4 }}
        >
          {listType === 'offer'
            ? offer.items && <ListC items={offer.items} />
            : order.items && <ListC items={order.items} />}
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { offer, order } = state
  return { offer, order }
}

const connectedList = connect(mapStateToProps)(List)
export { connectedList as ListPage }
