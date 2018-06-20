import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { transactionActionCreators } from '../actions'
import { RootState, TransactionState } from '../reducers'
import { AuthInfo } from '../actions'
import { transactionConsts } from '../constants'
import { List as ListC, Filter } from '../components'
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
        pageSize: 6
      }
    }
  }
  componentDidMount() {
    this.props.dispatch(transactionActionCreators.getAll(this.state.options))
  }
  handleChangeType = (values: string[]) => {
    let typeOption: { buy?: boolean; sell?: boolean } = {}
    let newOptions = this.state.options
    if (values.length === 2) {
      newOptions.buy = true
      newOptions.sell = true
    } else if (values.length === 1) {
      if (values[0] === transactionConsts.TYPE_BUY) {
        newOptions.buy = true
        newOptions.sell = false
      } else {
        newOptions.buy = false
        newOptions.sell = true
      }
    } else if (values.length === 0) {
      newOptions.buy = false
      newOptions.sell = false
    }
    this.setState({ options: newOptions })
    this.props.dispatch(transactionActionCreators.getAll({ ...newOptions }))
  }
  handleSelectSort = (value: string) => {
    let options = this.state.options
    options.sorting = value
    this.setState({ options })
    this.props.dispatch(
      transactionActionCreators.getAll({ type: 'all', ...options })
    )
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
            <Filter
              handleChangeType={this.handleChangeType}
              handleSelectSort={this.handleSelectSort}
            />
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
