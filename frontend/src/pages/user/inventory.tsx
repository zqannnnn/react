import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { goodsActionCreators } from '../../actions'
import { RootState, GoodsState } from '../../reducers'
import { AuthInfo } from '../../actions'
import { List as ListC, Filter } from '../../components'
import { ListOptions } from '../../models'
import { Row, Col, Button, Icon } from 'antd'
import i18n from 'i18next'

interface GoodsProps {
  dispatch: Dispatch<RootState>
  goods: GoodsState
  authInfo: AuthInfo
}
interface GoodsStates {
  searched?: boolean
  options: ListOptions
}
class GoodsPage extends React.Component<GoodsProps, GoodsStates> {
  constructor(props: GoodsProps) {
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
  onOptionsChange = (newOptions: ListOptions) => {
    const oldOptions = this.state.options
    const options = { ...oldOptions, ...newOptions }
    this.setState({ options })
    this.props.dispatch(goodsActionCreators.getAll(options))
  }
  componentDidMount() {
    this.props.dispatch(goodsActionCreators.getAll(this.state.options))
  }
  render() {
    const { goods } = this.props
    return (
      <div className="page">
        <Row>
          <Col
            xs={{ span: 22, offset: 1 }}
            sm={{ span: 20, offset: 2 }}
            md={{ span: 18, offset: 3 }}
            lg={{ span: 16, offset: 4 }}
          >
            <div className="list-container">
              <div className="header">
                <div className="subtitle">
                  <div className="des">{i18n.t('Goods List')}</div>
                  <Link className="link" to={'/goods/new'}>
                    <Button type="primary">
                      {i18n.t('add goods')}
                      <Icon type="right" />
                    </Button>
                  </Link>
                </div>
              </div>
              {goods.items && <ListC items={goods.items} />}
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { auth, goods } = state
  return { authInfo: auth.authInfo, goods }
}

const connectedGoodsPage = connect(mapStateToProps)(GoodsPage)
export { connectedGoodsPage as MyInventoryPage }
