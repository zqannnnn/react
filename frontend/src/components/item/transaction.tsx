import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import {
  adminActionCreators,
  transactionActionCreators,
  AuthInfo
} from '../../actions'
import { RootState } from '../../reducers'
import { Transaction, Comment } from '../../models'
import { transactionConsts } from '../../constants'
import { Exchange } from '../exchange'
import { Col, Icon, Input } from 'antd'
import i18n from 'i18next'
interface ItemProps {
  dispatch: Dispatch<RootState>
  transaction: Transaction
  authInfo: AuthInfo
}
interface ItemState {
  currentComment: string
  currentReply?: string
  currentReplyTo?: string
  replyInputShowing: boolean
  allCommentShowing: boolean
  comments?: Comment[]
}
class Item extends React.Component<ItemProps, ItemState> {
  constructor(props: ItemProps) {
    super(props)
    this.state = {
      currentComment: '',
      replyInputShowing: false,
      allCommentShowing: false,
      comments: props.transaction.comments
    }
  }
  handleCancel = (id: string) => {
    let r = confirm(i18n.t('Are you sure?'))
    if (r)
      this.props
        .dispatch(transactionActionCreators.cancel(id))
        .then(() => this.forceUpdate())
  }
  handleCommentInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    this.setState({
      currentComment: value
    })
  }
  handleReplyInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    this.setState({
      currentReply: value
    })
  }

  handleReply = (replyTo?: string) => {
    if (replyTo) {
      this.setState({ currentReplyTo: replyTo, replyInputShowing: true })
    }
  }
  ViewAllComments = () => {
    this.setState({ allCommentShowing: !this.state.allCommentShowing })
  }
  componentWillReceiveProps(nextProps: ItemProps) {
    const { transaction } = nextProps
    if (transaction.comments && transaction) {
      this.setState({
        ...this.state,
        comments: transaction.comments
      })
    }
  }
  submitReply = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    let { currentReply, currentReplyTo, comments } = this.state
    const { dispatch, transaction } = this.props
    const reply: Comment = {
      content: currentReply,
      replyTo: currentReplyTo,
      transactionId: transaction.id,
      replys: comments
    }
    dispatch(transactionActionCreators.comment(reply))

    this.setState({
      currentReply: '',
      replyInputShowing: false
    })
  }
  submitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    let { currentComment } = this.state
    const { dispatch, transaction } = this.props
    const comment: Comment = {
      content: currentComment,
      transactionId: transaction.id
    }
    if (currentComment) {
      dispatch(transactionActionCreators.comment(comment))
    }
    this.setState({
      currentComment: '',
      allCommentShowing: true
    })
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
    if (r) this.props.dispatch(adminActionCreators.finish(id))
  }
  handleBuy = (id: string) => {
    let r = confirm(i18n.t('Are you sure?'))
    if (r) this.props.dispatch(transactionActionCreators.buy(id))
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
    const {
      currentComment,
      currentReply,
      replyInputShowing,
      currentReplyTo,
      comments,
      allCommentShowing
    } = this.state
    const goods = transaction.goods
    const taker = transaction.taker
    return (
      goods && (
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
                {this.renderStatus(
                  transaction.isMakerSeller,
                  transaction.status
                )}
              </div>
            </div>
            <div className="title text-overflow">{goods.title}</div>
            <div className="desc content text-overflow">
              <span>{goods.brand && 'Brand:' + goods.brand + ', '}</span>
              <span>{goods.breed && 'Breed:' + goods.breed + ', '}</span>
              <span>{goods.grade && 'Grade:' + goods.grade + ', '}</span>
              <span>
                {goods.quantity && 'Quantity:' + goods.quantity + 'kg'}
              </span>
            </div>
            <Link to={'/transaction/' + transaction.id}>
              <div className="image-wr">
                {goods.images && goods.images[0] ? (
                  <img src={goods.images[0].path} className="block-img" />
                ) : (
                  <img src="/asset/no-image.jpg" className="block-img" />
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
              transaction.status === transactionConsts.STATUS_TAKING ? (
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
              {authInfo &&
              !authInfo.isAdmin &&
              transaction.goods &&
              transaction.goods.ownerId != authInfo.id &&
              transaction.status == transactionConsts.STATUS_CREATED ? (
                <div
                  className="control-btn"
                  onClick={() => {
                    if (transaction.id) this.handleBuy(transaction.id)
                  }}
                >
                  {i18n.t('Buy')}
                </div>
              ) : (
                ''
              )}
            </div>
            <div className="menu content">
              <Link
                className="control-btn"
                to={'/transaction/' + transaction.id}
              >
                {i18n.t('Read More')}
              </Link>

              {authInfo && taker && transaction.takerId && transaction.status === transactionConsts.STATUS_FINISHED &&(
                <>
                <span className="taker">{i18n.t('taker')}:
                  <Link
                    to={'/user/' + transaction.takerId}
                    className="control-btn"
                  >
                    {taker.firstName} {taker.lastName}
                  </Link>
                </span>
              </>
              ) }
              {authInfo &&
                (authInfo.id == transaction.makerId || authInfo.isAdmin) &&
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
              {authInfo &&
                (authInfo.id == transaction.makerId || authInfo.isAdmin) &&
                transaction.status === transactionConsts.STATUS_CANCELLED && (
                  <>
                    <div
                      className="control-btn"
                      onClick={() => {
                        if (transaction.id)
                          this.handleReactivate(transaction.id)
                      }}
                    >
                      {i18n.t('Reactivate')}
                    </div>
                  </>
                )}
            </div>

            <div>
              <div className="comment">
                <div
                  className="control-btn"
                  onClick={() => this.ViewAllComments()}
                >
                  {i18n.t('View all comments')}
                </div>
                {allCommentShowing && (
                  <div>
                    {comments &&
                      comments.map((comment, index) => (
                        <div key={index} className="comment-wrapper">
                          {comment.content &&
                            !comment.replyTo && (
                              <div className="speak">
                                <div className="avatar">
                                  <img
                                    src="/asset/no-image.jpg"
                                    alt="avatar"
                                    className="avatar-image"
                                  />
                                </div>
                                <div className="main">
                                  <span className="userid click">
                                    {comment.userId}
                                  </span>
                                  <span className="content">
                                    {comment.content}
                                  </span>
                                </div>
                                <div className="features">
                                  <span className="click">
                                    {i18n.t('praise')}
                                  </span>
                                  <span
                                    className="click"
                                    onClick={() => {
                                      if (comment.id)
                                        this.handleReply(comment.id)
                                    }}
                                  >
                                    {i18n.t('reply')}
                                  </span>
                                  <span className="click">
                                    {i18n.t('time')}
                                  </span>
                                </div>
                              </div>
                            )}

                          {comment.replyTo && (
                            <div className="reply">
                              <div className="avatar">
                                <img
                                  src="/asset/no-image.jpg"
                                  alt="avatar"
                                  className="avatar-image"
                                />
                              </div>
                              <div className="main">
                                <span className="userid click">
                                  {comment.userId}
                                </span>
                                <span className="content">
                                  {comment.content}
                                </span>
                              </div>
                              <div className="features">
                                <span className="click">
                                  {i18n.t('praise')}
                                </span>
                                <span
                                  className="click"
                                  onClick={() => this.handleReply(comment.id)}
                                >
                                  {i18n.t('reply')}
                                </span>
                                <span className="click">{i18n.t('time')}</span>
                              </div>
                            </div>
                          )}

                          {replyInputShowing &&
                            currentReplyTo === comment.id && (
                              <Input
                                className="reply-input"
                                placeholder="reply..."
                                type="text"
                                name="replyTo"
                                value={currentReply}
                                onChange={this.handleReplyInputChange}
                                suffix={
                                  <Icon
                                    type="enter"
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                    onClick={this.submitReply}
                                  />
                                }
                                prefix={
                                  <Icon
                                    type="user"
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                  />
                                }
                              />
                            )}
                        </div>
                      ))}
                  </div>
                )}

                <Input
                  placeholder="Write a Comment..."
                  type="text"
                  name="comment"
                  value={currentComment}
                  onChange={this.handleCommentInputChange}
                  suffix={
                    <Icon
                      type="enter"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                      onClick={this.submitComment}
                    />
                  }
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                />
              </div>
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

const connectedTransactionItem = connect(mapStateToProps)(Item)
export { connectedTransactionItem as Transaction }
