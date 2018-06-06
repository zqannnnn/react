import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators } from '../actions'
import { RootState, TransactionState } from '../reducers'
import { AuthInfo } from '../actions'
import { List as ListC } from '../components'
import { Checkbox, Row, Col } from 'antd'
import { transactionConsts } from '../constants'
interface ListProps {
  dispatch: Dispatch<RootState>
  transaction: TransactionState
  selectType: string
  listType: string
}
class List extends React.Component<ListProps> {
  constructor(props: ListProps) {
    super(props)
  }
  onChange = (values: string[]) => {
    let options: { buy?: boolean; sell?: boolean } = {}
    values.forEach((value: string) => {
      if (value == transactionConsts.TYPE_BUY) options = { buy: true }
      else if (value == transactionConsts.TYPE_SELL) options = { sell: true }
    })
    this.props.dispatch(
      transactionActionCreators.getAll({
        selectType: this.props.selectType,
        ...options
      })
    )
  }
  componentDidMount() {
    this.props.dispatch(
      transactionActionCreators.getAll({ selectType: this.props.selectType })
    )
  }
  render() {
    const { transaction, listType, selectType } = this.props
    return (
      <Row className="page">
        <div className="banner">
          <div className="banner-bg" />
          <div className="title">
            {selectType === 'mine' ? 'My ' : 'All '}
            Transaction
          </div>
        </div>
        {transaction.error && (
          <span className="text-danger">ERROR: {transaction.error}</span>
        )}
        <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
          <Row>
          <Col span={2}>
              <Checkbox value="transactionConsts.TYPE_BUY">buy</Checkbox>
            </Col>
            <Col span={2}>
              <Checkbox value="transactionConsts.TYPE_SELL">sell</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 20, offset: 2 }}
          md={{ span: 18, offset: 3 }}
          lg={{ span: 16, offset: 4 }}
        >
          {transaction.items && <ListC items={transaction.items} />}
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { transaction } = state
  return { transaction }
}

const connectedList = connect(mapStateToProps)(List)
export { connectedList as ListPage }
