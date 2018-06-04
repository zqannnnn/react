import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators, orderActionCreators } from '../actions'
import { RootState, TransactionState, OrderState } from '../reducers'
import { AuthInfo } from '../actions'
import { Transaction, Order, ListItem } from '../models'
import { Item as TransactionItem } from './transaction/item'
import { Item as OrderItem } from './order/item'
import { Item as CompanyItem } from './company/item'
interface ItemProps {
  dispatch: Dispatch<RootState>
  key: number
  item: ListItem
}
class Item extends React.Component<ItemProps> {
  constructor(props: ItemProps) {
    super(props)
  }
  renderItem = (type: string) => {
    const item = this.props.item
    switch (type) {
      case 'Transaction':
        return <TransactionItem transaction={item} />
      case 'Order':
        return <OrderItem order={item} />
      case 'Company':
        return <CompanyItem company={item} />
      default:
        break
    }
  }
  render() {
    let itemType = this.props.item.itemType
    return <>{itemType && this.renderItem(itemType)}</>
  }
}

const connectedItem = connect()(Item)
export { connectedItem as Item }
