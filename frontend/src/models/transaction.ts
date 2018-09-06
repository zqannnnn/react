import { Currency, ListItem } from '.'
import { Goods, Comment, User } from '.'

export class Transaction implements ListItem {
  id?: string
  itemType?: string
  status?: number
  price?: number
  currency?: Currency
  currencyCode?: string
  takerId?: string
  makerId?: string
  goodsId?: string
  goods?: Goods
  taker?:User
  maker?:User
  isMakerSeller?: boolean
  comments?: Comment[]
  rowComments?: Comment[]
  createdAt?: string
  updatedAt?: string
  totalComment?: number
  commentLoading?: boolean
}
