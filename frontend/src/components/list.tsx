import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../reducers'
import { ListItem } from '../models'
import { Item } from '.'
import { Row } from 'antd'
interface ListProps {
  dispatch: Dispatch<RootState>
  items: ListItem[]
  title?: string
}
class List extends React.Component<ListProps> {
  constructor(props: ListProps) {
    super(props)
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
          {items.map((item, index) => <Item key={index} item={item} />)}
        </Row>
      </div>
    )
  }
}

const connectedList = connect()(List)
export { connectedList as List }
