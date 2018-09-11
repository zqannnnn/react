import * as React from 'react'
import { Link } from 'react-router-dom'
import { Comment, Transaction } from '../../models'
import { Icon, Input, Avatar, Spin } from 'antd'
import i18n from 'i18next'
interface CommentProps {
  comment: Comment
  viewAllReplies: (comment: Comment) => void
  submitReply: (comment: Comment) => void
  commentLoading?: boolean
  reset: boolean
  transaction: Transaction
}
interface CommentState {
  currentReply: string
  currentReplyTo?: string
  replyInputShowing: boolean
  viewAllReplyShowing: boolean
  replyLoading: boolean
  currentReplyRoot?: string
  comment: Comment
}
class CommentItem extends React.Component<CommentProps, CommentState> {
  constructor(props: CommentProps) {
    super(props)
    this.state = this.defaultState
  }
  defaultState = {
    currentReply: '',
    replyInputShowing: false,
    viewAllReplyShowing: false,
    replyLoading: false,
    comment: {}
  }

  formatTime = (time: string) => {
    let timeSplit = Date.parse(time)
    const currentTimestamp = new Date().getTime()
    const timeDifference = currentTimestamp - timeSplit

    let result
    let minute = 1000 * 60
    let hour = minute * 60
    let day = hour * 24
    let halfMonth = day * 15
    let month = day * 30
    let now = new Date().getTime()
    let diffValue = now - timeDifference
    if (diffValue < 0) {
      return
    }
    let monthC = timeDifference / month
    let halfMonthC = timeDifference / halfMonth
    let weekC = timeDifference / (7 * day)
    let dayC = timeDifference / day
    let hourC = timeDifference / hour
    let minC = timeDifference / minute
    if (monthC >= 1) {
      result = '' + parseInt(monthC.toPrecision()) + i18n.t(' month ago')
    } else if (halfMonthC >= 1) {
      result = i18n.t('after half a month')
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

  viewAllReplies = (comment: Comment) => {
    this.setState({
      replyLoading: true,
      viewAllReplyShowing: true
    })
    this.props.viewAllReplies(comment)
  }

  handleReply = (replyTo?: string) => {
    this.setState({
      currentReplyTo: replyTo,
      replyInputShowing: true,
      currentReplyRoot: this.props.comment.rootId
    })
  }

  componentWillReceiveProps(nextProps: CommentProps) {
    const { commentLoading, reset } = nextProps
    if (!commentLoading) {
      this.setState({
        replyLoading: false,
        comment: nextProps.comment
      })
    }
    if (reset) {
      this.setState({
        ...this.defaultState,
        comment: nextProps.comment
      })
    }
  }

  submitReply = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault()
    let { currentReply, currentReplyTo, currentReplyRoot } = this.state
    let comment: Comment
    comment = {
      content: currentReply,
      replyTo: currentReplyTo,
      rootId: currentReplyRoot
    }
    if (currentReply !== '') {
      this.setState({
        replyInputShowing: false,
        replyLoading: true,
        viewAllReplyShowing: true,
        currentReply: ''
      })
      this.props.submitReply(comment)
    }
  }

  handleReplyInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    this.setState({
      currentReply: value
    })
  }

  renderComment = (comment: Comment) => {
    const { transaction } = this.props
    const { replyInputShowing, currentReplyTo, currentReply } = this.state
    return (
      <div key={comment.id} className="reply-wrapper">
        <div className="reply">
          <div className="comment-flex">
            {transaction.makerId === comment.userId && (
              <div className="main-comment">
                <Link to={'/user/' + comment.userId}>
                  <span className="user-id click highlighted">
                    {comment.user && comment.user.firstName}
                  </span>
                </Link>
                {comment.rootId !== comment.replyTo && (
                  <>
                    <span className="comment-replyTo">
                      {i18n.t(' reply ')}
                    </span>
                    <Link to={'/user/' + comment.userId}>
                      <span className="user-id click">
                        {comment.userReplyTo && comment.userReplyTo.firstName}
                      </span>
                    </Link>
                  </>
                )}
                <span className="reply-content">{comment.content}</span>
              </div>
            )}
            {transaction.makerId !== comment.userId && (
              <div className="main-comment">
                <Link to={'/user/' + comment.userId}>
                  <span className="user-id click">
                    {comment.user && comment.user.firstName}
                  </span>
                </Link>
                {comment.rootId !== comment.replyTo && (
                  <>
                    <span className="comment-replyTo">
                      {i18n.t(' reply ')}
                    </span>
                    <Link to={'/user/' + comment.userId}>
                      <span className="user-id click">
                        {comment.userReplyTo && comment.userReplyTo.firstName}
                      </span>
                    </Link>
                  </>
                )}
                <span className="reply-content">{comment.content}</span>
              </div>
            )}
          </div>

          <div className="features">
            <span
              className="click"
              onClick={() => {
                this.handleReply(comment.id)
              }}
            >
              {i18n.t('reply')}
            </span>
            <span className="createdAt">
              {comment.createdAt && this.formatTime(comment.createdAt)}
            </span>
          </div>
          {replyInputShowing &&
            currentReplyTo === comment.id && (
              <Input
                className="reply-input"
                autoFocus
                placeholder="reply..."
                type="text"
                name="replyTo"
                onPressEnter={this.submitReply}
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
                    onClick={this.submitReply}
                    className="cursor-pointer"
                  />
                }
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
              />
            )}
        </div>
      </div>
    )
  }
  render() {
    const { comment, commentLoading, transaction } = this.props
    const {
      currentReply,
      replyInputShowing,
      currentReplyTo,
      viewAllReplyShowing
    } = this.state
    return (
      <div className="comment-wrapper">
        <div className="speak">
          <div className="comment-flex">
            {transaction.makerId === comment.userId && (
              <div className="main-comment">
                <Link to={'/user/' + comment.userId}>
                  <span className="user-id click highlighted">
                    {comment.user && comment.user.firstName}
                  </span>
                </Link>
                <span className="comment-content">{comment.content}</span>
              </div>
            )}
            {transaction.makerId !== comment.userId && (
              <div className="main-comment">
                <Link to={'/user/' + comment.userId}>
                  <span className="user-id click">
                    {comment.user && comment.user.firstName}
                  </span>
                </Link>
                <span className="comment-content">{comment.content}</span>
              </div>
            )}
          </div>

          <div className="features">
            <span
              className="click"
              onClick={() => {
                this.handleReply(comment.id)
              }}
            >
              {i18n.t('reply')}
            </span>
            <span className="createdAt">
              {comment.createdAt && this.formatTime(comment.createdAt)}
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
                onPressEnter={this.submitReply}
                value={currentReply}
                onChange={this.handleReplyInputChange}
                style={{ paddingTop: 5, paddingBottom: 5 }}
                suffix={
                  <Icon
                    type="enter"
                    style={{ color: 'rgba(0,0,0,.25)' }}
                    onClick={this.submitReply}
                    className="cursor-pointer"
                  />
                }
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
              />
            </div>
          )}

        {!viewAllReplyShowing &&
          comment.totalReply && (
            <div className="features">
              <Icon type="rollback" className="icon-rollback" />
              <span
                className="click"
                onClick={() => this.viewAllReplies(comment)}
              >
                {comment.totalReply} {i18n.t('replies')}
              </span>
              {commentLoading && <Spin />}
            </div>
          )}

        {comment.replies &&
          comment.replies.map(reply => this.renderComment(reply))}
      </div>
    )
  }
}

export { CommentItem }
