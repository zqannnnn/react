import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators } from '../actions'
import { RootState, TransactionState } from '../reducers'
import { AuthInfo } from '../actions'
import { transactionConsts } from '../constants'
import { List as ListC, Filter, Selector } from '../components'
import { ListOptions } from '../models'
import { Row, Col } from 'antd'
import i18n from 'i18next'

interface HomeProps {
  dispatch: Dispatch<RootState>
  transaction: TransactionState
  authInfo: AuthInfo
}
interface HomeState {
  searched?: boolean
  options: ListOptions
}
class HomePage extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props)
    this.state = {
      searched: false,
      options: {
        type: 'all',
        page: 1,
        pageSize: 6,
        category: []
      }
    }
  }
  onOptionsChange = (newOptions: ListOptions) => {
    const oldOptions = this.state.options
    const options = { ...oldOptions, ...newOptions }
    this.setState({ options })
    this.props.dispatch(transactionActionCreators.getAll(options))
  }
  componentDidMount() {
    this.props.dispatch(transactionActionCreators.getAll(this.state.options))
  }
  render() {
    const { authInfo, transaction } = this.props
    return (
      <div className="page">
        <h2 className="header-center">{i18n.t('Home')}</h2>
          <Row>
            <Col
              xs={{ span: 20, offset: 2 }}
              sm={{ span: 20, offset: 2 }}
              md={{ span: 16, offset: 4 }}
            >
              <div className="list-container">
                <div className="header">
                  <div className="title">{i18n.t('Home')}</div>
                  <div className="subtitle">
                    <div className="des">
                      {i18n.t('People looking for buy or sell')}
                    </div>
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
