import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RouteComponentProps, Link } from 'react-router-dom'
import {
  userActionCreators,
  AuthInfo,
  lightboxActionCreators,
  goodsActionCreators
} from '../../actions'
import { RootState, UserState } from '../../reducers'
import { Consignee, Goods } from '../../models'
import { Row, Col, Button, Icon } from 'antd'
import i18n from 'i18next'
import { Record, EditableTable } from '../../components/consignee-editor'
import '../user/profile.scss'
import { GoodsInfo } from '../../components'

interface ShippingProps
  extends RouteComponentProps<{ id: string; goodsId: string }> {
  dispatch: Dispatch<RootState>
  userProp: UserState
  authInfo: AuthInfo
  processing: boolean
  goodsProp: Goods
}

interface ShippingState {
  goods: Goods
  userId: string
  submitted: boolean
  goodsId?: string
  selectable: boolean
}

class ShippingPage extends React.Component<ShippingProps, ShippingState> {
  constructor(props: ShippingProps) {
    super(props)
    this.state = {
      submitted: false,
      goods: {},
      userId: '',
      selectable: false
    }
  }
  componentDidMount() {
    this.props.authInfo.id &&
      this.props.dispatch(userActionCreators.getById(this.props.authInfo.id))
    let goodsId = this.props.match.params.goodsId
    goodsId &&
      this.setState({
        ...this.state,
        goodsId
      })
    goodsId && this.props.dispatch(goodsActionCreators.getById(goodsId))
  }

  componentWillReceiveProps(nextProps: ShippingProps) {
    const { goodsProp } = nextProps
    const { submitted, goodsId, goods } = this.state

    if (goodsId && goodsProp && !submitted) {
      this.setState({
        goods: {
          ...goods,
          ...goodsProp
        }
      })
    }
    this.setState({ selectable: true })
  }

  handleSubmitConsignee = (values: Record) => {
    const { dispatch } = this.props
    let consignee: Consignee = {
      name: values.name,
      email: values.email,
      phoneNum: values.phoneNum,
      address: values.address
    }
    if (values.id)
      dispatch(userActionCreators.editConsignee(consignee, values.id))
    else dispatch(userActionCreators.newConsignee(consignee))
  }

  handleDeleteConsignee = (id: string) => {
    const { dispatch } = this.props
    dispatch(userActionCreators.deleteConsignee(id))
  }

  handleDefaultConsignee = (id: string) => {
    const { dispatch } = this.props
    dispatch(userActionCreators.setDefaultConsignee(id))
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { goodsId } = this.state
    const { goods } = this.state
    const { dispatch } = this.props
    if (goods && goods.consigneeId) {
      if (goodsId) {
        dispatch(goodsActionCreators.edit(goods, goodsId))
      } else dispatch(goodsActionCreators.new(goods))
    }
    window.scrollTo(0, 0)
    this.setState({ submitted: true })
  }

  openLightbox = (image: string) => {
    this.props.dispatch(lightboxActionCreators.open(image))
  }

  onSelect = (data: Record) => {
    const { goods } = this.state
    this.setState({
      goods: { ...goods, consigneeId: data.id, address: data.address }
    })
  }

  render() {
    const { userData } = this.props.userProp
    const { goods } = this.state
    let { processing } = this.props
    let dataSource: Record[]
    if (userData && userData.consignees) {
      dataSource = userData.consignees.map((source, index) => ({
        key: index.toString(),
        id: source.id,
        name: source.name,
        email: source.email,
        phoneNum: source.phoneNum,
        address: source.address
      }))
    } else {
      dataSource = []
    }
    let imagePaths: string[]
    if (userData && userData.businessLicenses) {
      imagePaths = userData.businessLicenses.map(image => image.path)
    } else {
      imagePaths = []
    }
    return (
      <Row
        type="flex"
        justify="space-around"
        align="middle"
        className="edit-page page"
      >
        <Col xs={{ span: 20, offset: 2 }} sm={{ span: 20, offset: 1 }}>
          <h2 className="header-center">
            {this.state.goods.id
              ? i18n.t('Edit Goods Page')
              : i18n.t('Create Goods Page')}
          </h2>
          <form name="form" onSubmit={this.handleSubmit}>
            <div className="steps-content">
              {goods && (
                <div className="field">
                  <GoodsInfo goods={goods} openLightbox={this.openLightbox} />
                  <Row>
                    <Col
                      xs={{ span: 20, offset: 2 }}
                      sm={{ span: 20, offset: 2 }}
                      md={{ span: 20, offset: 2 }}
                      lg={{ span: 20, offset: 2 }}
                      className="field"
                      offset={2}
                    >
                      <div className="view-content">
                        <div className="field" style={{ marginBottom: 0 }}>
                          <label>{i18n.t('Address')}:</label>
                          {dataSource && (
                            <EditableTable
                              data={dataSource}
                              selectable={this.state.selectable}
                              handleSubmit={this.handleSubmitConsignee}
                              handleDelete={this.handleDeleteConsignee}
                              handleDefault={this.handleDefaultConsignee}
                              defaultConsigneeId={
                                this.props.userProp.userData &&
                                this.props.userProp.userData.defaultConsigneeId
                              }
                              onSelect={this.onSelect}
                            />
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={20} md={8} lg={8} offset={2} className="footer">
                      <Button type="primary" htmlType="submit">
                        {i18n.t('Submit')}
                      </Button>
                      {processing && <Icon type="loading" />}
                      <Button className="button-left">
                        <Link to="/">{i18n.t('Cancel')}</Link>
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          </form>
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { user, auth, transaction, goods } = state
  const { processing } = transaction
  const { goodsData } = goods
  return {
    userProp: user,
    authInfo: auth.authInfo,
    processing,
    goodsProp: goodsData
  }
}
const connectedShippingPage = connect(mapStateToProps)(ShippingPage)
export { connectedShippingPage as ShippingPage }
