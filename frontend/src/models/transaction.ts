import { Currency, ListItem, Image } from '.'
import { category } from '../reducers/category'

export class Transaction implements ListItem {
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
  currency?: Currency
  currencyCode?: string
  trimmings?: number
  comment?: string
  images?: Image[]
  certificates?: Image[]
  processing?: boolean
  error?: string
  category?: string
  createdAt?: string
  updatedAt?: string
}
