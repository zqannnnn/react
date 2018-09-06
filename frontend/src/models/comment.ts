import { User } from '.'

export interface Comment {
  id?: string
  content?: string
  replyTo?: string
  transactionId?: string
  userId?: string
  userReplyTo?: User
  replys?: Comment[]
  createdAt?: string
  levelOnTheTree?: number
  user?: User
  rootId?: string
  totalReply?: number
}
