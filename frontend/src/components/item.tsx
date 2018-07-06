import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../reducers'
import { ListItem } from '../models'
import { Item as TransactionItem } from './transaction/item'
import { Item as CompanyItem } from './company/item'
import { Item as GoodsItem } from './goods/item'
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
      case 'Company':
        return <CompanyItem company={item} />
      case 'Goods':
        return <GoodsItem goods={item} />
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
