import { Currency, ListItem } from '.'
import { Goods } from '.'
import { User } from '../../../src/models';

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
  isMakerSeller?: boolean
  comment?: string
  createdAt?: string
  updatedAt?: string
}
