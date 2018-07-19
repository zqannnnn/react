export interface Comment {
  id?: string
  content?: string
  replyTo?: string
  transactionId?: string
  userId?: string
  replys?: Comment[]
  createdAt?: string
}
