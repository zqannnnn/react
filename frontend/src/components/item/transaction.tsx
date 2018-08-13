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
import { Col, Icon, Input, Avatar, Pagination, Spin } from 'antd'
import { ListOptions } from '../../models'
import i18n from 'i18next'
interface ItemProps {
  dispatch: Dispatch<RootState>
  transaction: Transaction
  authInfo: AuthInfo
  rowComments: Comment[]
}
interface ItemState {
  currentComment: string
  currentReply: string
  currentReplyTo?: string
  currentReplyRoot?: string
  replyInputShowing: boolean
  replysInputShowing: boolean
  viewAllCommentShowing: boolean
  commentSubmitted: boolean
  comments?: Comment[]
  options: ListOptions
}
class Item extends React.Component<ItemProps, ItemState> {
  constructor(props: ItemProps) {
    super(props)
    this.state = this.defaultState
  }
  defaultState = {
    currentComment: '',
    currentReply: '',
    replyInputShowing: false,
    replysInputShowing: false,
    comments: this.props.transaction.comments,
    options: {
      page: 1,
      pageSize: transactionConsts.COMMENT_LIST_SIZE
    },
    viewAllCommentShowing: true,
    commentSubmitted: false
  }
  formatTime = (time: string) => {
    let timeSplit = Date.parse(time)
    const currentTimestamp = new Date().getTime()
    const timeDifference = currentTimestamp - timeSplit

    let result
    let minute = 1000 * 60
    let hour = minute * 60
    let day = hour * 24
    let halfamonth = day * 15
    let month = day * 30
    let now = new Date().getTime()
    let diffValue = now - timeDifference
    if (diffValue < 0) {
      return
    }
    let monthC = timeDifference / month
    let weekC = timeDifference / (7 * day)
    let dayC = timeDifference / day
    let hourC = timeDifference / hour
    let minC = timeDifference / minute
    if (monthC >= 1) {
      result = '' + parseInt(monthC.toPrecision()) + i18n.t(' month ago')
    } else if (weekC >= 1) {
      result = '' + parseInt(weekC.toPrecision()) + i18n.t(' week ago')
    } else if (dayC >= 1) {
      result = '' + parseInt(dayC.toPrecision()) + i18n.t(' day ago')
    } else if (hourC >= 1) {
      result = '' + parseInt(hourC.toPrecision()) + i18n.t(' hour ago')
    } else if (minC >= 1) {
      result = '' + parseInt(minC.toPrecision()) + i18n.t(' minute ago')
    } else result = i18n.t(' just now')
    return <>{result}</>
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
    const { rowComments } = this.props
    if (replyTo && rowComments) {
      const lastComment = rowComments.filter(
        comment => comment.id === replyTo
      )[0]
      this.setState({
        currentReplyTo: replyTo,
        currentReplyRoot: lastComment.rootId,
        replyInputShowing: true,
        replysInputShowing: false
      })
    }
  }

  ViewAllComments = () => {
    const { options } = this.state
    this.setState({ commentSubmitted: true })
    this.props.dispatch(
      transactionActionCreators.listComment(this.props.transaction.id, options)
    )
    this.setState({ viewAllCommentShowing: false })
  }

  onPageChange = (current: number, defaultPageSize: number) => {
    const { transaction } = this.props
    const options = this.state.options
    options.page = current
    options.pageSize = defaultPageSize
    this.setState({ options, commentSubmitted: true })
    this.props.dispatch(
      transactionActionCreators.listComment(transaction.id, {
        ...options
      })
    )
  }

  componentWillReceiveProps(nextProps: ItemProps) {
    const { transaction } = nextProps
    const { commentSubmitted, viewAllCommentShowing } = this.state
    if (!commentSubmitted && viewAllCommentShowing) {
      this.setState({
        ...this.defaultState,
        comments: transaction.comments
      })
    } else {
      this.setState({
        comments: transaction.comments,
        commentSubmitted: false,
        currentComment: '',
        currentReply: ''
      })
    }
  }

  submitComment = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault()
    let {
      currentComment,
      currentReply,
      currentReplyTo,
      currentReplyRoot
    } = this.state
    const { dispatch, transaction } = this.props
    const { options } = this.state
    let comment: Comment
    comment = {
      content: currentReplyTo ? currentReply : currentComment,
      replyTo: currentReplyTo,
      rootId: currentReplyRoot,
      transactionId: transaction.id
    }

    this.setState({ viewAllCommentShowing: false })
    dispatch(transactionActionCreators.createComment(comment, options))
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
  renderComment = (comment: Comment) => {
    const {
      currentComment,
      replyInputShowing,
      currentReplyTo,
      currentReplyRoot,
      currentReply
    } = this.state
    return (
      <div key={comment.id} className="reply-wrapper">
        <div className="reply">
          <div className="avatar">
            <Avatar icon="user" />
          </div>
          <div className="main-comment">
            <span className="userid click">
              {comment.user && comment.user.firstName} {i18n.t('reply to')}{' '}
              {comment.user && comment.user.firstName}
            </span>
            <span className="reply-content">{comment.content}</span>
          </div>
          <div className="features">
            <span className="click">{i18n.t('praise')}</span>
            <span
              className="click"
              onClick={() => {
                this.handleReply(comment.id)
              }}
            >
              {i18n.t('reply')}
            </span>
            <span className="click">
              {comment.createdAt && this.formatTime(comment.createdAt)}
            </span>
          </div>
        </div>
        {replyInputShowing &&
          currentReplyTo === comment.id && (
            <Input
              className="reply-input"
              autoFocus
              placeholder="reply..."
              type="text"
              name="replyTo"
              onPressEnter={this.submitComment}
              value={currentReply}
              onChange={this.handleReplyInputChange}
              style={{
                paddingTop: 5,
                paddingBottom: 5
              }}
              suffix={
                <Icon
                  type="enter"
                  style={{ color: 'rgba(0,0,0,.25)' }}
                  onClick={this.submitComment}
                  className="icon-click"
                />
              }
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />
          )}
      </div>
    )
  }
  render() {
    const { transaction, authInfo } = this.props
    const {
      currentComment,
      currentReply,
      replyInputShowing,
      replysInputShowing,
      currentReplyTo,
      comments,
      viewAllCommentShowing,
      currentReplyRoot
    } = this.state
    const goods = transaction.goods
    const taker = transaction.taker
    return (
      goods && (
        <Col
          key={transaction.id}
          xs={24}
          sm={11}
          md={10}
          lg={9}
          className="block transation"
          style={{ marginBottom: 10, paddingRight: 10, minHeight: 100 }}
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
                {viewAllCommentShowing && (
                  <div>
                    <span
                      className="control-btn click"
                      onClick={() => this.ViewAllComments()}
                    >
                      {i18n.t('View all comments')}
                    </span>
                    {transaction.commentLoading && <Spin />}
                  </div>
                )}

                {transaction.totalComment === 0 && (
                  <div className="release">
                    <span>{i18n.t("Let's comment on it.")}</span>
                  </div>
                )}

                {comments &&
                  comments.map((comment, index) => (
                    <div key={index} className="comment-wrapper">
                      <div className="speak">
                        <div className="avatar">
                          <Avatar icon="user" />
                        </div>
                        <div className="main-comment">
                          <span className="userid click">
                            {comment.user && comment.user.firstName}
                          </span>
                          <span className="comment-content">
                            {comment.content}
                          </span>
                        </div>
                        <div className="features">
                          <span className="click">{i18n.t('praise')}</span>
                          <span
                            className="click"
                            onClick={() => {
                              this.handleReply(comment.id)
                            }}
                          >
                            {i18n.t('reply')}
                          </span>
                          <span className="click">
                            {comment.createdAt &&
                              this.formatTime(comment.createdAt)}
                          </span>
                        </div>
                      </div>

                      {replyInputShowing &&
                        currentReplyTo === comment.id && (
                          <div>
                            <Input
                              className="reply-input"
                              autoFocus
                              placeholder="reply..."
                              type="text"
                              name="replyTo"
                              onPressEnter={this.submitComment}
                              value={currentReply}
                              onChange={this.handleReplyInputChange}
                              style={{ paddingTop: 5, paddingBottom: 5 }}
                              suffix={
                                <Icon
                                  type="enter"
                                  style={{ color: 'rgba(0,0,0,.25)' }}
                                  onClick={this.submitComment}
                                  className="icon-click"
                                />
                              }
                              prefix={
                                <Icon
                                  type="user"
                                  style={{ color: 'rgba(0,0,0,.25)' }}
                                />
                              }
                            />
                          </div>
                        )}

                      {comment.replys &&
                        comment.replys.map(reply => this.renderComment(reply))}
                    </div>
                  ))}

                <Pagination
                  style={{
                    paddingBottom: 5,
                    paddingTop: 5,
                    textAlign: 'center'
                  }}
                  defaultCurrent={1}
                  defaultPageSize={3}
                  hideOnSinglePage={true}
                  total={transaction.totalComment}
                  onChange={this.onPageChange}
                  size="small"
                />

                <Input
                  placeholder="Write a Comment..."
                  type="text"
                  name="comment"
                  onPressEnter={this.submitComment}
                  value={currentComment}
                  onChange={this.handleCommentInputChange}
                  style={{ paddingLeft: 5, paddingRight: 5 }}
                  suffix={
                    <Icon
                      type="enter"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                      onClick={this.submitComment}
                      className="icon-click"
                    />
                  }
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                />
                <div className="release">
                  <span>{i18n.t(' Press the Enter key to publish。')}</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      )
    )
  }
}

function mapStateToProps(state: RootState) {
  const { auth, transaction } = state
  return { authInfo: auth.authInfo, rowComments: transaction.rowComments }
}

const connectedTransactionItem = connect(mapStateToProps)(Item)
export { connectedTransactionItem as Transaction }
