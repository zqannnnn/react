import { Currency, Image, ListItem } from '.'
import { Consignee, Country } from '.'

export class User implements ListItem {
  id?: string
  itemType?: string
  firstName?: string
  lastName?: string
  password?: string
  email?: string
  isActive?: boolean
  resetKey?: string
  userType?: number
  deleting?: boolean
  deleteError?: string
  preferredCurrencyCode?: string
  preferredCurrency?: Currency
  companyName?: string
  countryCode?: string
  country?: Country
  companyAddress?: string
  businessLicenses?: Image[]
  licenseStatus?: number
  consignees?: Consignee[]
  defaultConsigneeId?: string
}
