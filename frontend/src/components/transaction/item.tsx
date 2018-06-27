import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators, AuthInfo } from '../../actions'
import { RootState } from '../../reducers'
import { Transaction } from '../../models'
import { transactionConsts } from '../../constants'
import { Exchange } from '../exchange'
import { Col } from 'antd'
import i18n from 'i18next'
interface ItemProps {
  dispatch: Dispatch<RootState>
  transaction: Transaction
  authInfo: AuthInfo
}
interface ItemState {
  commentInputShowing: boolean
  comment: string
}
class Item extends React.Component<ItemProps, ItemState> {
  constructor(props: ItemProps) {
    super(props)
    this.state = {
      commentInputShowing: false,
      comment: props.transaction.comment || ''
    }
  }
  handleCancel = (id: string) => {
    let r = confirm(i18n.t('Are you sure?'))
    if (r)
      this.props
        .dispatch(transactionActionCreators.cancel(id))
        .then(() => this.forceUpdate())
  }
  handleReactivate = (id: string) => {
    let r = confirm(i18n.t('Are you sure?'))
    if (r)
      this.props
        .dispatch(transactionActionCreators.reactivate(this.props.transaction))
        .then(() => this.forceUpdate())
  }
  handleFinish = (id: string) => {
    let r = confirm(i18n.t('Are you sure?'))
    if (r) this.props.dispatch(transactionActionCreators.finish(id))
  }
  renderStatus = (
    isMakerSeller: boolean = false,
    status: number = transactionConsts.STATUS_CREATED
  ) => {
    let finalStatus: string
    if (isMakerSeller) {
      switch (status) {
        case transactionConsts.STATUS_CANCELLED:
          finalStatus = i18n.t('Not active')
          break
        case transactionConsts.STATUS_FINISHED:
          finalStatus = i18n.t('Sold')
          break
        default:
          finalStatus = i18n.t('For Sale')
          break
      }
    } else {
      switch (status) {
        case transactionConsts.STATUS_CANCELLED:
          finalStatus = i18n.t('Not active')
          break
        case transactionConsts.STATUS_FINISHED:
          finalStatus = i18n.t('Bought')
          break
        default:
          finalStatus = i18n.t('Wanted')
          break
      }
    }
    return finalStatus
  }
  render() {
    const { transaction, authInfo } = this.props
    const goods = transaction.goods
    // const { commentInputShowing, comment } = this.state
    return (
      <Col
        key={transaction.id}
        xs={12}
        sm={11}
        md={10}
        lg={9}
        className="block"
      >
        <div className="boxmain">
          <div className="left-icon">
            <div className="header">
              {this.renderStatus(transaction.isMakerSeller, transaction.status)}
            </div>
          </div>
          <div className="title text-overflow">{goods.title}</div>
          <div className="desc content text-overflow">
            <span>{goods.brand && 'Brand:' + goods.brand + ', '}</span>
            <span>{goods.breed && 'Breed:' + goods.breed + ', '}</span>
            <span>{goods.grade && 'Grade:' + goods.grade + ', '}</span>
            <span>{goods.quantity && 'Quantity:' + goods.quantity + 'kg'}</span>
          </div>
          <Link to={'/transaction/' + transaction.id}>
            <div className="image-wr">
              {goods.images && goods.images[0] ? (
                <img src={goods.images[0].path} />
              ) : (
                <img src="/asset/no-image.jpg" />
              )}
            </div>
          </Link>
          <div className="space-between content text-overflow">
            {transaction.price &&
              transaction.currencyCode && (
                <Exchange
                  price={transaction.price}
                  currencyCode={transaction.currencyCode}
                />
              )}
            {authInfo &&
            authInfo.isAdmin &&
            transaction.status != transactionConsts.STATUS_FINISHED ? (
              <div
                className="control-btn"
                onClick={() => {
                  if (transaction.id) this.handleFinish(transaction.id)
                }}
              >
                {i18n.t('Set Finish')}
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="menu content">
            <Link className="control-btn" to={'/transaction/' + transaction.id}>
              {i18n.t('Read More')}
            </Link>
            {(authInfo.id == transaction.makerId || authInfo.isAdmin) &&
              transaction.status === transactionConsts.STATUS_CREATED && (
                <>
                  <Link
                    to={'/transaction/edit/' + transaction.id}
                    className="control-btn"
                  >
                    {i18n.t('Edit')}
                  </Link>
                  <div
                    className="control-btn"
                    onClick={() => {
                      if (transaction.id) this.handleCancel(transaction.id)
                    }}
                  >
                    {i18n.t('Deactivate')}
                  </div>
                </>
              )}
            {(authInfo.id == transaction.makerId || authInfo.isAdmin) &&
              transaction.status === transactionConsts.STATUS_CANCELLED && (
                <>
                  <div
                    className="control-btn"
                    onClick={() => {
                      if (transaction.id) this.handleReactivate(transaction.id)
                    }}
                  >
                    {i18n.t('Reactivate')}
                  </div>
                </>
              )}
          </div>
        </div>
      </Col>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { auth } = state
  return { authInfo: auth.authInfo }
}

const connectedItem = connect(mapStateToProps)(Item)
export { connectedItem as Item }
