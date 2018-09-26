import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../reducers'
import { ListItem } from '../models'
import { TransactionItem, GoodsItem, CompanyItem } from './item/'
import { Row } from 'antd'
import './list.scss'
interface ListProps {
  dispatch: Dispatch<RootState>
  items: ListItem[]
  title?: string
}
class List extends React.Component<ListProps> {
  constructor(props: ListProps) {
    super(props)
  }
  renderItem = (item: ListItem, i: number) => {
    switch (item.itemType) {
      case 'Transaction':
        return <TransactionItem transaction={item} key={i} />
      case 'Company':
        return <CompanyItem company={item} key={i} />
      case 'Goods':
        return <GoodsItem goods={item} key={i} />
      default:
        break
    }
  }
  render() {
    const { items, title } = this.props
    return (
      <div>
        {title && (
          <div className="header">
            <div className="title">{title}</div>
          </div>
        )}

        <Row className="block-container" gutter={15} style={{ marginLeft: 0 }}>
          {items.map((item, i) => this.renderItem(item, i))}
        </Row>
      </div>
    )
  }
}

const connectedList = connect()(List)
export { connectedList as List }
