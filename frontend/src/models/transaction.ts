import { Currency, ListItem } from '.'
import { Goods } from '.'

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
  isMakerSeller?: boolean
  comment?: string
}
