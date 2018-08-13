import { User } from '.'

export interface Comment {
  id?: string
  content?: string
  replyTo?: string
  transactionId?: string
  userId?: string
  replys?: Comment[]
  createdAt?: string
  totalReplys?: number
  levelOnTheTree?: number
  user?: User
  rootId?: string
}
