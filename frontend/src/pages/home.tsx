import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators } from '../actions'
import { RootState, TransactionState } from '../reducers'
import { AuthInfo } from '../actions'
import { transactionConsts } from '../constants'
import { List as ListC } from '../components'
import { Row, Col, Checkbox } from 'antd'
interface HomeProps {
  dispatch: Dispatch<RootState>
  transaction: TransactionState
  authInfo: AuthInfo
}

class HomePage extends React.Component<HomeProps> {
  constructor(props: HomeProps) {
    super(props)
  }
  onChange = (values: string[]) => {
    let options: { buy?: boolean; sell?: boolean } = {}
    values.forEach((value: string) => {
      if (value == transactionConsts.TYPE_BUY)
        options = { ...options, buy: true }
      else if (value == transactionConsts.TYPE_SELL)
        options = { ...options, sell: true }
    })
    this.props.dispatch(
      transactionActionCreators.getAll({ type: 'all', ...options })
    )
  }
  componentDidMount() {
    this.props.dispatch(transactionActionCreators.getAll({ type: 'all' }))
  }
  render() {
    const { authInfo, transaction } = this.props
    return (
      <div className="page">
        <div className="banner">
          <div className="banner-bg" />
          <div className="title">All Transaction</div>
        </div>
        <Row>
          <Col
            xs={{ span: 22, offset: 1 }}
            sm={{ span: 20, offset: 2 }}
            md={{ span: 18, offset: 3 }}
            lg={{ span: 16, offset: 4 }}
          >
            <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
              <Row>
                <Col push={21} span={3}>
                  <Checkbox value={transactionConsts.TYPE_BUY}>Wanted</Checkbox>
                </Col>
                <Col push={21} span={3}>
                  <Checkbox value={transactionConsts.TYPE_SELL}>
                    On Sale
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
            <div className="list-container">
              <div className="header">
                <div className="title">Home</div>
                <div className="subtitle">
                  <div className="des">People looking for sell</div>
                  <Link className="link" to={'/transactions'}>
                    👁 view all transactions
                  </Link>
                </div>
              </div>
              {transaction.items && <ListC items={transaction.items} />}
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { auth, transaction } = state
  return { authInfo: auth.authInfo, transaction }
}

const connectedHomePage = connect(mapStateToProps)(HomePage)
export { connectedHomePage as HomePage }
