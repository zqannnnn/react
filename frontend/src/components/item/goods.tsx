import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators, AuthInfo } from '../../actions'
import { RootState } from '../../reducers'
import { Goods } from '../../models'
import { Col } from 'antd'
import i18n from 'i18next'
import { adminConsts } from '../../constants'
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
    const { goods,authInfo } = this.props

    return (
      goods && (
        <Col
          key={goods.id}
          xs={24}
          sm={11}
          md={10}
          lg={9}
          className="block goods"
        >
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
                  <img src={goods.images[0].path} className="block-img" />
                ) : (
                  <img src="/asset/no-image.jpg" className="block-img" />
                )}
              </div>
            </Link>
            <div className="text-overflow" />
            <div className="content menu">
              {!goods.selling && goods.proofstatus == adminConsts.PROOFSTATUS_CONFIRMED && (
                <>
                  <Link
                    to={'/transaction/new/' + goods.id}
                    className="control-btn"
                  >
                    {i18n.t('Sell')}
                  </Link>
                </>
              )}
              {!goods.selling && goods.proofstatus == adminConsts.PROOFSTATUS_CONFIRMED && (
                <>
                  <Link
                    to={'/transaction/shipping/' + goods.id}
                    className="control-btn"
                  >
                    {i18n.t('Redeem')}
                    </Link>
                </>
              )} 
              {!goods.selling && goods.proofstatus == adminConsts.PROOFSTATUS_UNCONFIRMED && (
                <>
                {i18n.t(' goods has not been verified')}  
                </>
                
              )}
              {!goods.selling && !goods.proofstatus && authInfo.isAdmin&& (
                <>
                  <Link
                    to={'/goods/confirm/' + goods.id}
                    className="control-btn"
                  >
                    {i18n.t('Confirm')}
                  </Link>
                </>
              )}
              {!goods.selling && goods.proofstatus == adminConsts.PROOFSTATUS_DENIED && (
                <>
                {i18n.t('Verification failed. Please resubmit')}
                  <Link
                    to={'/goods/edit/' + goods.id}
                    className="control-btn"
                  >
                    {i18n.t('edit')}
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
