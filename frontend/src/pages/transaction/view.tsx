import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import {
  transactionActionCreators,
  lightboxActionCreators,
  AuthInfo
} from '../../actions'
import { Transaction } from '../../models'
import { RootState } from '../../reducers'
import { transactionConsts } from '../../constants'
import { Row, Col, Icon, Input } from 'antd'
import i18n from 'i18next'
interface ViewProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<RootState>
  transaction: Transaction
  authInfo: AuthInfo
  loading: boolean
}
interface ViewState {
  commentInputShowing: boolean
  transactionId?: string
  comment: string
}
class ViewPage extends React.Component<ViewProps, ViewState> {
  constructor(props: ViewProps) {
    super(props)
    this.state = {
      commentInputShowing: false,
      comment: ''
    }
  }
  componentDidMount() {
    let transactionId = this.props.match.params.id
    transactionId &&
      this.setState({
        ...this.state,
        transactionId
      })
    transactionId &&
      this.props.dispatch(transactionActionCreators.getById(transactionId))
  }

  openLightbox = (image: string) => {
    this.props.dispatch(lightboxActionCreators.open(image))
  }
  triggerCommentInput = () => {
    let value = this.state.commentInputShowing
    this.setState({ ...this.state, commentInputShowing: !value })
  }
  handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    this.setState({
      ...this.state,
      [name]: value
    })
  }
  render() {
    const { transaction, authInfo, loading } = this.props
    const { commentInputShowing, comment } = this.state
    let maker
    if (transaction) { 
      maker = transaction.maker
    }
    let taker
    if (transaction) { 
      taker = transaction.taker
    }
    let goods
    if (transaction) { 
      goods = transaction.goods
    }
    let imagePaths: string[]
    if (goods && goods.images) {
      imagePaths = goods.images.map(image => image.path)
    } else {
      imagePaths = []
    }
    return (
      <Row type="flex" justify="space-around" align="middle" className="page">
        <Col span={20}>
          <h2 className="header-center">{i18n.t('Transaction View Page')}</h2>
          {!goods ? (
            <Icon type="loading" />
          ) : (
            <div>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 17, offset: 5 }}
                >
                  <label>{i18n.t('Title')}:</label>
                  <div className="message">
                    {goods.title ? goods.title : 'N/A'}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 6, offset: 5 }}
                  className="view-top"
                >
                  <label>{i18n.t('maker')}:</label>
                  <div className="message">
                    {maker ? (
                    <Link
                    to={'/user/' + transaction.makerId}
                    className="control-btn"
                    >
                      <span>
                        {maker.firstName} {maker.lastName}
                      </span>
                      </Link>
                    ) : (
                      ''
                    )}
                  </div>
                </Col>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 7, offset: 1 }}
                  className="view-top"
                >
                  <label>{i18n.t('Price')}:</label>
                  <div className="message">{`${
                    transaction.price ? transaction.price : 'N/A'
                  } ${
                    transaction.currencyCode
                      ? transaction.currencyCode + '/KG'
                      : ''
                  }`}</div>
                </Col>
              </Row>
              {taker && <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 6, offset: 5 }}
                  className="view-top"
                >
                  <label>{i18n.t('taker')}:</label>
                  <div className="message">
                    {taker ? (
                    <Link
                    to={'/user/' + transaction.takerId}
                    className="control-btn"
                    >
                      <span>
                        {taker.firstName} {taker.lastName}
                      </span>
                      </Link>
                    ) : (
                      ''
                    )}
                  </div>
                </Col>
              </Row>}
              <Row className="top">
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 17, offset: 5 }}
                >
                  <label className="details-nav">{i18n.t('goods information')}:</label>
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 14, offset: 5 }}
                  className="view-top"
                >
                  <label>{i18n.t('Description')}:</label>
                  <div className="message">
                    {goods.desc ? goods.desc : 'N/A'}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 6, offset: 5 }}
                  className="view-top"
                >
                  <label>{i18n.t('Storage')}:</label>
                  <div className="message">
                    {goods.storage ? goods.storage : 'N/A'}
                  </div>
                </Col>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 7, offset: 1 }}
                  className="view-top"
                >
                  <label>{i18n.t('Breed')}:</label>
                  <div className="message">
                    {goods.breed ? goods.breed : 'N/A'}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 6, offset: 5 }}
                  className="view-top"
                >
                  <label>{i18n.t('Grade')}:</label>
                  <div className="message">
                    {goods.grade ? goods.grade : 'N/A'}
                  </div>
                </Col>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 7, offset: 1 }}
                  className="view-top"
                >
                  <label>{i18n.t('MarbleScore')}:</label>
                  <div className="message">
                    {goods.marbleScore ? goods.marbleScore : 'N/A'}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 6, offset: 5 }}
                  className="view-top"
                >
                  <label>{i18n.t('Slaughter Specification')}:</label>
                  <div className="message">
                    {goods.slaughterSpec ? goods.slaughterSpec : 'N/A'}
                  </div>
                </Col>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 7, offset: 1 }}
                  className="view-top"
                >
                  <label>{i18n.t('Bone')}:</label>
                  <div className="message">
                    {goods.bone ? goods.bone : 'N/A'}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 6, offset: 5 }}
                  className="view-top"
                >
                  <label>{i18n.t('Primal Cuts')}:</label>
                  <div className="message">
                    {goods.primalCuts ? goods.primalCuts : 'N/A'}
                  </div>
                </Col>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 7, offset: 1 }}
                  className="view-top"
                >
                  <label>{i18n.t('Trimmings')}:</label>
                  <div className="message">
                    {goods.trimmings ? goods.trimmings + 'CL' : 'N/A'}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 6, offset: 5 }}
                  className="view-top"
                >
                  <label>{i18n.t('Fed')}:</label>
                  <div className="message">
                    {goods.fed ? goods.fed : 'N/A'}
                    {goods.grainFedDays ? (
                      <span>
                        <br />
                        {goods.grainFedDays} Day
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                </Col>
                 <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 7, offset: 1 }}
                  className="view-top"
                >
                  <label>{i18n.t('Place of Origin')}:</label>
                  <div className="message">
                    {goods.placeOfOrigin ? goods.placeOfOrigin : 'N/A'}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 6, offset: 5 }}
                  className="view-top"
                >
                  <label>{i18n.t('Quantity')}:</label>
                  <div className="message">
                    {goods.quantity ? goods.quantity + 'KG' : 'N/A'}
                  </div>
                </Col>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 7, offset: 1 }}
                  className="view-top"
                >
                  <label>{i18n.t('Brand')}:</label>
                  <div className="message">
                    {goods.brand ? goods.brand : 'N/A'}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 6, offset: 5 }}
                  className="view-top"
                >
                  <label>{i18n.t('Factory Number')}:</label>
                  <div className="message">
                    {goods.factoryNum ? goods.factoryNum : 'N/A'}
                  </div>
                </Col>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 7, offset: 1 }}
                  className="view-top"
                >
                  <label>{i18n.t('Delivery Term')}:</label>
                  <div className="message">
                    {goods.deliveryTerm ? goods.deliveryTerm : 'N/A'}
                  </div>
                </Col>
              </Row>
              <Row>
               
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 12, offset: 5 }}
                  className="view-top"
                >
                  <label>{i18n.t('Images')}:</label>
                  <div className="message">
                    {imagePaths && (
                      <div className="images-container">
                        {imagePaths.map((image, index) => (
                          <div key={index} className="image-wrapper">
                            <img
                              className="image cursor-pointer"
                              onClick={() =>
                                this.openLightbox(imagePaths[index])
                              }
                              src={image}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { transaction, auth } = state
  const { transData } = transaction
  return {
    transaction: transData,
    authInfo: auth.authInfo,
    loading: transaction.loading
  }
}
const connectedViewPage = connect(mapStateToProps)(ViewPage)
export { connectedViewPage as ViewPage }
