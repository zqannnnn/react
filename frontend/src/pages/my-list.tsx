import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators } from '../actions'
import { RootState, TransactionState } from '../reducers'
import { List as ListC } from '../components'
import { Checkbox, Row, Col } from 'antd'
import { transactionConsts } from '../constants'
import i18n from 'i18next'
import { Filter } from '../components'
import { Link } from 'react-router-dom'

interface ListProps {
  dispatch: Dispatch<RootState>
  transaction: TransactionState
}
class List extends React.Component<ListProps> {
  constructor(props: ListProps) {
    super(props)
  }
  
  componentDidMount() {
    this.props.dispatch(
      transactionActionCreators.getAll({ type: 'mine' })
    )
  }
  render() {
    const {transaction} = this.props;
    return (
      <Row className="page">
        <div className="banner">
          <div className="banner-bg" />
          <div className="title">
            {i18n.t('My Transaction')}
          </div>
        </div>
        {transaction.error && (
          <span className="text-danger">
            {i18n.t('ERROR: ')}
            {transaction.error}
          </span>
        )}
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 20, offset: 2 }}
          md={{ span: 18, offset: 3 }}
          lg={{ span: 16, offset: 4 }}
        >
          <Filter />
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
export { connectedList as MyListPage }
