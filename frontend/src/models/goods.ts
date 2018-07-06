import { ListItem, Image } from '.'

export class Goods implements ListItem {
  id?: string
  creatorId?: string
  ownerId?: string
  address?: string
  itemType?: string
  category?: string
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
  trimmings?: number
  images?: Image[]
  certificates?: Image[]
  ifExist?: boolean
  createdAt?: string
  updatedAt?: string
}
