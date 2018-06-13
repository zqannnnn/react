import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators } from '../actions'
import { RootState, TransactionState } from '../reducers'
import { AuthInfo } from '../actions'
import { transactionConsts } from '../constants'
import { List as ListC } from '../components'
import { Row, Col } from 'antd'
import { Filter } from '../components'
import i18n from 'i18next'

interface HomeProps {
  dispatch: Dispatch<RootState>
  transaction: TransactionState
  authInfo: AuthInfo
}

class HomePage extends React.Component<HomeProps> {
  constructor(props: HomeProps) {
    super(props)
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
          <div className="title">{i18n.t('All Transaction')}</div>
        </div>
        <Row>
          <Col
            xs={{ span: 22, offset: 1 }}
            sm={{ span: 20, offset: 2 }}
            md={{ span: 18, offset: 3 }}
            lg={{ span: 16, offset: 4 }}
          >
            <Filter />
            <div className="list-container">
              <div className="header">
                <div className="title">{i18n.t('Home')}</div>
                <div className="subtitle">
                  <div className="des">{i18n.t('People looking for buy or sell')}</div>
                  <Link className="link" to={'/transactions'}>
                    {i18n.t('👁 view all transactions')}
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
