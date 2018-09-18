import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../reducers'
import { Comment, Transaction } from '../../models'
import { transactionConsts } from '../../constants'
import { Icon, Input, Pagination, Spin } from 'antd'
import { ListOptions } from '../../models'
import { CommentItem } from './comment'
import { transactionActionCreators } from '../../actions'
import i18n from 'i18next'
interface CommentAreaProps {
  dispatch: Dispatch<RootState>
  comments?: Comment[]
  listComment: (options: ListOptions) => void
  submitComment: (comment: Comment, options: ListOptions) => void
  submitReply: (comment: Comment) => void
  totalComment?: number
  commentLoading?: boolean
  transaction: Transaction
}

interface CommentAreaState {
  currentComment: string
  viewAllCommentShowing: boolean
  reset: boolean
  comments?: Comment[]
  options: ListOptions
}
class CommentArea extends React.Component<CommentAreaProps, CommentAreaState> {
  constructor(props: CommentAreaProps) {
    super(props)
    this.state = this.defaultState
  }
  defaultState = {
    currentComment: '',
    comments: this.props.comments,
    options: {
      page: 1,
      pageSize: transactionConsts.COMMENT_LIST_SIZE
    },
    viewAllCommentShowing: false,
    reset: false
  }

  handleCommentInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    this.setState({
      currentComment: value
    })
  }

  viewAllComments = () => {
    const { options } = this.state
    this.props.listComment(options)
    this.setState({
      viewAllCommentShowing: true
    })
  }

  viewAllReplies = (comment: Comment) => {
    this.props.dispatch(
      transactionActionCreators.listReplies(
        comment.rootId,
        comment.transactionId
      )
    )
  }

  onPageChange = (current: number, defaultPageSize: number) => {
    const options = this.state.options
    options.page = current
    options.pageSize = defaultPageSize
    this.setState({ options, reset: true })
    this.props.listComment(options)
  }

  componentWillReceiveProps(nextProps: CommentAreaProps) {
    const { commentLoading } = nextProps
    if (!commentLoading) {
      this.setState({
        comments: nextProps.comments
      })
    }
    if (this.state.reset) {
      this.setState({
        ...this.defaultState,
        reset: false,
        comments: nextProps.comments,
        viewAllCommentShowing: true
      })
    }
  }

  submitComment = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault()
    let { currentComment } = this.state
    const { options } = this.state
    let comment: Comment
    comment = {
      content: currentComment
    }
    if (currentComment !== '') {
      this.setState({
        viewAllCommentShowing: true,
        currentComment: ''
      })
      this.props.submitComment(comment, options)
    }
  }

  submitReply = (comment: Comment) => {
    this.props.submitReply(comment)
  }

  render() {
    const { comments, totalComment, commentLoading, transaction } = this.props
    const { currentComment, viewAllCommentShowing, reset } = this.state
    return (
      <div>
        <div className="comment">
          {!viewAllCommentShowing && (
            <div>
              <span
                className="control-btn click"
                onClick={() => this.viewAllComments()}
              >
                {i18n.t('view all comments')}
              </span>
              {commentLoading && <Spin />}
            </div>
          )}

          {totalComment === 0 && (
            <div className="release">
              <span>{i18n.t("Let's comment on it.")}</span>
            </div>
          )}

          {comments &&
            comments.map((comment, index) => (
              <CommentItem
                comment={comment}
                commentLoading={commentLoading}
                viewAllReplies={this.viewAllReplies}
                submitReply={this.submitReply}
                reset={reset}
                transaction={transaction}
                key={index}
              />
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
            total={totalComment}
            onChange={this.onPageChange}
            size="small"
          />

          <Input
            placeholder="Write a comment..."
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
                className="cursor-pointer"
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

const connectedCommentArea = connect()(CommentArea)
export { connectedCommentArea as CommentArea }
