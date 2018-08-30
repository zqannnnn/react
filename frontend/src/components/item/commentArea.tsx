import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../reducers'
import { Comment } from '../../models'
import { transactionConsts } from '../../constants'
import { Icon, Input, Pagination, Spin } from 'antd'
import { ListOptions } from '../../models'
import { CommentItem } from '../item/'
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
  rowComments: Comment[]
}

interface CommentAreaState {
  currentComment: string
  currentReplyTo?: string
  currentReplyRoot?: string
  viewAllCommentShowing: boolean
  reseted: boolean
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
    reseted: false
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

  viewAllReplys = (comment: Comment) => {
    this.props.dispatch(
      transactionActionCreators.listReplys(
        comment.rootId,
        comment.transactionId
      )
    )
  }

  onPageChange = (current: number, defaultPageSize: number) => {
    const options = this.state.options
    options.page = current
    options.pageSize = defaultPageSize
    this.setState({ options, reseted: true })
    this.props.listComment(options)
  }

  componentWillReceiveProps(nextProps: CommentAreaProps) {
    const { commentLoading } = nextProps
    if (!commentLoading) {
      this.setState({
        comments: nextProps.comments
      })
    }
    if (this.state.reseted) {
      this.setState({
        ...this.defaultState,
        reseted: false,
        comments: nextProps.comments,
        viewAllCommentShowing: true
      })
    }
  }

  submitComment = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault()
    let { currentComment, currentReplyTo, currentReplyRoot } = this.state
    const { options } = this.state
    let comment: Comment
    comment = {
      content: currentComment,
      replyTo: currentReplyTo,
      rootId: currentReplyRoot
    }

    this.setState({
      viewAllCommentShowing: true,
      currentReplyTo: undefined,
      currentComment: ''
    })
    this.props.submitComment(comment, options)
  }

  submitReply = (comment: Comment) => {
    this.props.submitReply(comment)
  }

  render() {
    const { comments, totalComment, commentLoading } = this.props
    const { currentComment, viewAllCommentShowing } = this.state
    return (
      <div>
        <div className="comment">
          {!viewAllCommentShowing && (
            <div>
              <span
                className="control-btn click"
                onClick={() => this.viewAllComments()}
              >
                {i18n.t('view All Comments')}
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
                commentLoading={this.props.commentLoading}
                viewAllReplys={this.viewAllReplys}
                submitReply={this.submitReply}
                reseted={this.state.reseted}
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
  const { transaction } = state
  return { rowComments: transaction.rowComments }
}

const connectedCommentArea = connect(mapStateToProps)(CommentArea)
export { connectedCommentArea as CommentArea }
