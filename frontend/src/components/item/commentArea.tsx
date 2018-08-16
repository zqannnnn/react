import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators, AuthInfo } from '../../actions'
import { RootState } from '../../reducers'
import { Transaction, Comment } from '../../models'
import { transactionConsts } from '../../constants'
import { Icon, Input, Pagination, Spin } from 'antd'
import { ListOptions } from '../../models'
import { CommentItem } from '../item/'
import i18n from 'i18next'
interface CommentAreaProps {
  dispatch: Dispatch<RootState>
  comment: Comment
  authInfo: AuthInfo
  rowComments: Comment[]
}

interface CommentAreaState {
  currentComment: string
  currentReply: string
  currentReplyTo?: string
  currentReplyRoot?: string
  replyInputShowing: boolean
  viewAllCommentShowing: boolean
  commentSubmitted: boolean
  comments?: Comment[]
  transaction?: Transaction
  options: ListOptions
}
class CommentAreaItem extends React.Component<CommentAreaProps, CommentAreaState> {
  constructor(props: CommentAreaProps) {
    super(props)
    this.state = this.defaultState
  }
  defaultState = {
    currentComment: '',
    currentReply: '',
    replyInputShowing: false,
    comments: this.props.transaction.comments,
    options: {
      page: 1,
      pageSize: transactionConsts.COMMENT_LIST_SIZE
    },
    viewAllCommentShowing: true,
    commentSubmitted: false
  }

  handleCommentInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    this.setState({
      currentComment: value
    })
  }

  viewAllComments = () => {
    const { options } = this.state
    this.props.dispatch(
      transactionActionCreators.listComment(this.props.transaction.id, options)
    )
    this.setState({ viewAllCommentShowing: false, commentSubmitted: true })
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

  componentWillReceiveProps(nextProps: CommentAreaProps) {
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
        currentReply: '',
        replyInputShowing: false
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

    this.setState({ viewAllCommentShowing: false, currentReplyTo: undefined })
    dispatch(transactionActionCreators.createComment(comment, options))
  }

  render() {
    const { comment } = this.props
    const {
      currentComment,
      viewAllCommentShowing,
      transaction
    } = this.state
    return (
      <div>
        <div className="comment">
          {viewAllCommentShowing && (
            <div>
              <span
                className="control-btn click"
                onClick={() => this.viewAllComments()}
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

          {comment &&
            comment.map((comment, index) => (
            <CommentItem comment={comment} />
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
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
          <div className="release">
            <span>{i18n.t(' Press the Enter key to publish。')}</span>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { auth, transaction } = state
  return { authInfo: auth.authInfo, rowComments: transaction.rowComments }
}

const connectedCommentAreaItem = connect(mapStateToProps)(CommentAreaItem)
export { connectedCommentAreaItem as CommentArea }
