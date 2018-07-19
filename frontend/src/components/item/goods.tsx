import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators, AuthInfo } from '../../actions'
import { RootState } from '../../reducers'
import { Goods } from '../../models'
import { Col } from 'antd'
import i18n from 'i18next'

interface GoodsItemProps {
  dispatch: Dispatch<RootState>
  goods: Goods
  authInfo: AuthInfo
}
class GoodsItem extends React.Component<GoodsItemProps> {
  constructor(props: GoodsItemProps) {
    super(props)
  }
  render() {
    const { goods } = this.props

    return (
      goods && (
        <Col key={goods.id} xs={12} sm={11} md={10} lg={9} className="block">
          <div className="boxmain">
            <div className="title text-overflow">{goods.title}</div>
            <div className="desc content text-overflow">
              <span>{goods.brand && 'Brand:' + goods.brand + ', '}</span>
              <span>{goods.breed && 'Breed:' + goods.breed + ', '}</span>
              <span>{goods.grade && 'Grade:' + goods.grade + ', '}</span>
              <span>
                {goods.quantity && 'Quantity:' + goods.quantity + 'kg'}
              </span>
            </div>
            <Link to={'/goods/' + goods.id}>
              <div className="image-wr">
                {goods.images && goods.images[0] ? (
                  <img src={goods.images[0].path} />
                ) : (
                  <img src="/asset/no-image.jpg" />
                )}
              </div>
            </Link>
            <div className="text-overflow" />
            <div className="content menu">
              {!goods.selling && (
                <>
                  <Link
                    to={'/transaction/new/' + goods.id}
                    className="control-btn"
                  >
                    {i18n.t('Sell')}
                  </Link>
                </>
              )}
              {goods.transaction &&
                goods.selling && (
                  <>
                    {i18n.t('Selling')}
                    <Link
                      to={'/transaction/' + goods.transaction.id}
                      className="control-btn"
                    >
                      {i18n.t('To offer')}
                    </Link>
                  </>
                )}
            </div>
          </div>
        </Col>
      )
    )
  }
}

function mapStateToProps(state: RootState) {
  const { auth } = state
  return { authInfo: auth.authInfo }
}

const connectedGoodsItem = connect(mapStateToProps)(GoodsItem)
export { connectedGoodsItem as Goods }
