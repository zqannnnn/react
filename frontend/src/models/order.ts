import { Currency, ListItem } from '.'

export class Order implements ListItem {
  id?: string
  userId?: string
  status?: number
  itemType?: string
  type?: string
  storage?: string
  breed?: string
  grade?: string
  slaughterSpec?: string
  primalCuts?: string
  bone?: string
  title?: string
  desc?: string
  fed?: string
  grainFedDays?: number
  brand?: string
  factoryNum?: string
  deliveryTerm?: string
  placeOfOrigin?: string
  marbleScore?: number
  quantity?: number
  price?: number
  currencyCode?: string
  currency?: Currency
  trimmings?: number
  comment?: string
  offerId?: string
  cancelling?: boolean
  cancellError?: string
}
