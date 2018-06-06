import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators, AuthInfo } from '../../actions'
import { RootState, TransactionState } from '../../reducers'
import { Transaction, ListItem } from '../../models'
import { transactionConsts } from '../../constants'
import { Exchange } from '../exchange'
import { Checkbox, Row, Col } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
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

  handleCancell = (id: string) => {
    this.props.dispatch(transactionActionCreators.cancell(id))
  }
  handleFinish = (id: string) => {
    let r = confirm('Are you sure?')
    if (r) this.props.dispatch(transactionActionCreators.finish(id))
  }
  triggerCommentInput = () => {
    let value = this.state.commentInputShowing
    this.setState({ commentInputShowing: !value })
  }
  handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    this.setState({
      ...this.state,
      [name]: value
    })
  }
  sendComment = (id: string) => {
    this.props.dispatch(
      transactionActionCreators.addComment(id, this.state.comment)
    )
    this.setState({ commentInputShowing: false })
  }
  render() {
    const { transaction, authInfo } = this.props
    const { commentInputShowing, comment } = this.state
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
          <div className="leftIcons">
            <div className="header">{transaction.type}</div>
          </div>
          <div className="title content">{transaction.title}</div>
          <div className="desc content">
            <span>
              {transaction.storage && 'Storage:' + transaction.storage + ','}
            </span>
            <span>
              {transaction.breed && 'Breed:' + transaction.breed + ','}
            </span>
            <span>
              {transaction.grade && 'Grade:' + transaction.grade + ','}
            </span>
            <span>
              {transaction.slaughterSpec &&
                'Slaughter Specificatin:' + transaction.slaughterSpec + ','}
            </span>
            <span>
              {transaction.primalCuts && 'Primal Cut:' + transaction.primalCuts}
            </span>
          </div>
          <Link to={'/transaction/' + transaction.id}>
            <div className="image-wr">
              {transaction.images && transaction.images[0] ? (
                <img src={transaction.images[0].path} />
              ) : (
                <img src="/asset/no-image.jpg" />
              )}
            </div>
          </Link>
          <div className="space-between content">
            <div className="status">
              {transaction.status != transactionConsts.STATUS_FINISHED
                ? 'On Sale'
                : 'Sold'}
            </div>
            {authInfo.isAdmin &&
            transaction.status != transactionConsts.STATUS_FINISHED ? (
              <div
                className="control-btn"
                onClick={() => {
                  if (transaction.id) this.handleFinish(transaction.id)
                }}
              >
                Set Sold
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="content">
            {transaction.price &&
              transaction.currencyCode && (
                <Exchange
                  price={transaction.price}
                  currencyCode={transaction.currencyCode}
                />
              )}
          </div>
          <div className="menu content">
            <Link className="control-btn" to={'/transaction/' + transaction.id}>
              Read More
            </Link>
            {authInfo.id == transaction.userId || authInfo.isAdmin ? (
              <>
                {transaction.status === transactionConsts.STATUS_CREATED && (
                  <>
                    <Link
                      to={'/transaction/edit/' + transaction.id}
                      className="control-btn"
                    >
                      Edit ✎
                    </Link>
<<<<<<< d5d5a361979cf2b094276dfd71971ca53937d33a
                    <div className="space-between content">
                        <div className="status" >{offer.status!=offerConsts.OFFER_STATUS_FINISHED?'On Sale':'Sold'}</div>
                        {authInfo.isAdmin&&offer.status!=offerConsts.OFFER_STATUS_FINISHED?<div className="control-btn" onClick = {()=>{
                                if(offer.id)
                                    this.handleFinish(offer.id)
                            }
                        }>Set Sold</div>:
                    ''}
                    </div>
                    <div className="content">{offer.price&&offer.currencyCode&&<Exchange price={offer.price} currencyCode = {offer.currencyCode}/>}</div>
                    <div className="menu content">
                        <Link className="control-btn" to={'/offer/' + offer.id}>Read More</Link>
                        {(authInfo.id==offer.userId||authInfo.isAdmin)?
                        <>
                            {offer.status===offerConsts.OFFER_STATUS_CREATED &&<>
                                <Link to={'/offer/edit/' + offer.id} className="control-btn">Edit ✎</Link>
                                <div className="control-btn" onClick = {()=>{
                                        if(offer.id)
                                            this.handleCancell(offer.id)
                                        }
                                    }>
                                    Cancel < i className = "fa fa-times-circle" aria-hidden="true" ></i>
                                </div>
                            </>}
                            {(authInfo.isAdmin&&offer.status==offerConsts.OFFER_STATUS_FINISHED)?
                            <div className="control-btn" onClick={()=>{this.triggerCommentInput()}}>{"Comment "}
                                <i className={"fa fa-comment-o "+(commentInputShowing?"icon-active":"")} aria-hidden="true"  ></i>
                            </div>:''}
                        </>:''}
=======
                    <div
                      className="control-btn"
                      onClick={() => {
                        if (transaction.id) this.handleCancell(transaction.id)
                      }}
                    >
                      Cancel{' '}
                      <i className="fa fa-times-circle" aria-hidden="true" />
>>>>>>> refactor whole frontend with ant design and add new solution of i18n using react-i18next
                    </div>
                  </>
                )}
                {authInfo.isAdmin &&
                transaction.status == transactionConsts.STATUS_FINISHED ? (
                  <div
                    className="control-btn"
                    onClick={() => {
                      this.triggerCommentInput()
                    }}
                  >
                    {'Comment '}
                    <i
                      className={
                        'fa fa-comment-o ' +
                        (commentInputShowing ? 'icon-active' : '')
                      }
                      aria-hidden="true"
                    />
                  </div>
                ) : (
                  ''
                )}
              </>
            ) : (
              ''
            )}
          </div>
          {commentInputShowing ? (
            <div className="input-wr content">
              <input
                type="text"
                name="comment"
                value={comment}
                onChange={this.handleInputChange}
              />
              <div className="input-btn-wr">
                <i
                  className="fa fa-share-square-o input-btn"
                  aria-hidden="true"
                  onClick={() => {
                    if (transaction.id) this.sendComment(transaction.id)
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="comment content">{transaction.comment}</div>
          )}
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
