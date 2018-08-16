import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators, AuthInfo } from '../../actions'
import { RootState } from '../../reducers'
import { Transaction, Comment } from '../../models'
import { transactionConsts } from '../../constants'
import { Icon, Input, Avatar, Spin } from 'antd'
import { ListOptions } from '../../models'
import i18n from 'i18next'
interface CommentProps {
  dispatch: Dispatch<RootState>
  comment: Comment
  transactionId?: string
  rowComments: Comment[]
}
interface CommentState {
  currentComment: string
  currentReply: string
  currentReplyTo?: string
  currentReplyRoot?: string
  replyInputShowing: boolean
  replysInputShowing: boolean
  viewAllCommentShowing: boolean
  viewAllReplyShowing: boolean
  commentSubmitted: boolean
  comments?: Comment[]
  options: ListOptions
}
class CommentItem extends React.Component<CommentProps, CommentState> {
  constructor(props: CommentProps) {
    super(props)
    this.state = this.defaultState
  }
  defaultState = {
    currentComment: '',
    currentReply: '',
    replyInputShowing: false,
    replysInputShowing: false,
    options: {
      page: 1,
      pageSize: transactionConsts.COMMENT_LIST_SIZE
    },
    viewAllCommentShowing: true,
    viewAllReplyShowing: true,
    commentSubmitted: false
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

  submitComment = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault()
    let {
      currentComment,
      currentReply,
      currentReplyTo,
      currentReplyRoot
    } = this.state
    const { dispatch, comment } = this.props
    const { options } = this.state
    comment = {
      content: currentReplyTo ? currentReply : currentComment,
      replyTo: currentReplyTo,
      rootId: currentReplyRoot,
      transactionId: transaction.id
    }

    this.setState({ viewAllCommentShowing: false, currentReplyTo: undefined })
    dispatch(transactionActionCreators.createComment(comment, options))
  }

  handleReplyInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    this.setState({
      currentReply: value
    })
  }

  viewAllReplys = (comment: Comment) => {
    const { options } = this.state
    this.props.dispatch(
      transactionActionCreators.listReplys(
        comment.rootId,
        comment.transactionId,
        options
      )
    )
    this.setState({ commentSubmitted: true, viewAllReplyShowing: false })
  }

  renderComment = (comment: Comment) => {
    const {
      replyInputShowing,
      currentReplyTo,
      currentReply
    } = this.state
    return (
      <div key={comment.id} className="reply-wrapper">
        <div className="reply">
          <div className="avatar">
            <Avatar icon="user" />
          </div>
          <div className="main-comment">
            <span className="user-id click">
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
            <span className="click createdAt">
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
    const { comment } = this.props
    const {
      currentReply,
      replyInputShowing,
      currentReplyTo,
      comments,
      viewAllReplyShowing
    } = this.state
    return (
      <div key={comment.id} className="comment-wrapper">
        <div className="speak">
          <div className="avatar">
            <Avatar icon="user" />
          </div>
          <div className="comment-flex">
            <div className="main-comment">
              <span className="user-id click">
                {comment.user && comment.user.firstName}
              </span>
              <span className="comment-content">{comment.content}</span>
            </div>
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
            <span className="click createdAt">
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

        {viewAllReplyShowing &&
          comment.totalReply && (
            <div className="features">
              <Icon type="rollback" className="icon-rollback" />
              <span
                className="click"
                onClick={() => this.viewAllReplys(comment)}
              >
                {comment.totalReply} {i18n.t('replies')}
              </span>
            </div>
          )}

        {comment.replys &&
          comment.replys.map(reply => this.renderComment(reply))}
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { transaction } = state
  return { rowComments: transaction.rowComments }
}

const connectedCommentItem = connect(mapStateToProps)(CommentItem)
export { connectedCommentItem as Comment }
