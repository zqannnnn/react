import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import {
  goodsActionCreators,
  lightboxActionCreators,
  AuthInfo
} from '../../actions'
import { Goods } from '../../models'
import { RootState } from '../../reducers'
import { Row, Col, Icon, Input } from 'antd'
import i18n from 'i18next'
interface ViewProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<RootState>
  goods: Goods
  authInfo: AuthInfo
  loading: boolean
}
interface ViewState {
  goodsId?: string
}
class ViewPage extends React.Component<ViewProps, ViewState> {
  componentDidMount() {
    let goodsId = this.props.match.params.id
    goodsId &&
      this.setState({
        ...this.state,
        goodsId
      })
    goodsId && this.props.dispatch(goodsActionCreators.getById(goodsId))
  }

  openLightbox = (image: string) => {
    this.props.dispatch(lightboxActionCreators.open(image))
  }

  render() {
    const { goods, authInfo, loading } = this.props
    let creator
    if (goods) { 
      creator = goods.creator
    }
    let imagePaths: string[]
    if (goods && goods.images) {
      imagePaths = goods.images.map(image => image.path)
    } else {
      imagePaths = []
    }
    return (
      <div className="page view-page">
            <h2 className="header-center">{i18n.t('Goods View Page')}</h2>
            {!goods ? (
              <Icon type="loading" />
            ) : (
              <div className="view-content">
                <Row>
                  <Col
                    xs={{ span: 20, offset: 2 }}
                    sm={{ span: 20, offset: 2 }}
                    md={{ span: 17, offset: 6 }}
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
                    md={{ span: 17, offset: 6 }}
                    className="field"
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
                    md={{ span: 6, offset: 6 }}
                    className="field"
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
                    className="field"
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
                    md={{ span: 6, offset: 6 }}
                    className="field"
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
                    className="field"
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
                    md={{ span: 6, offset: 6 }}
                    className="field"
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
                    className="field"
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
                    md={{ span: 6, offset: 6 }}
                    className="field"
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
                    className="field"
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
                    md={{ span: 6, offset: 6 }}
                    className="field"
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
                </Row>
                <Row>
                  <Col
                    xs={{ span: 20, offset: 2 }}
                    sm={{ span: 20, offset: 2 }}
                    md={{ span: 6, offset: 6 }}
                    className="field"
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
                    className="field"
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
                    md={{ span: 6, offset: 6 }}
                    className="field"
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
                    className="field"
                  >
                    <label>{i18n.t('Delivery Term')}:</label>
                    <div className="message">
                      {goods.deliveryTerm ? goods.deliveryTerm : 'N/A'}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col
                    xs={{ span: 20, offset: 2 }}
                    sm={{ span: 20, offset: 2 }}
                    md={{ span: 6, offset: 6 }}
                    className="field"
                  >
                    <label>{i18n.t('Place of Origin')}:</label>
                    <div className="message">
                      {goods.placeOfOrigin ? goods.placeOfOrigin : 'N/A'}
                    </div>
                  </Col>
                  <Col
                   xs={{ span: 20, offset: 2 }}
                   sm={{ span: 20, offset: 2 }}
                   md={{ span: 7, offset: 1 }}
                    className="field"
                  >
                    <label>{i18n.t('Address')}:</label>
                    <div className="message">
                      {goods.address ? goods.address : 'N/A'}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col
                    xs={{ span: 20, offset: 2 }}
                    sm={{ span: 20, offset: 2 }}
                    md={{ span: 6, offset: 6 }}
                    className="field"
                  >
                    <label>{i18n.t('Creator')}:</label>
                    <div className="message">
                      {creator ? (
                      <Link
                      to={'/user/' + goods.creatorId}
                      className="control-btn"
                      >
                        <span>
                          {creator.firstName} {creator.lastName}
                        </span>
                        </Link>
                      ) : (
                        'no taker'
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col
                    xs={{ span: 20, offset: 2 }}
                    sm={{ span: 20, offset: 2 }}
                    md={{ span: 12, offset: 6 }}
                    className="field"
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
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { goods, auth } = state
  const { goodsData } = goods
  return {
    goods: goodsData,
    authInfo: auth.authInfo,
    loading: goods.loading
  }
}
const connectedViewPage = connect(mapStateToProps)(ViewPage)
export { connectedViewPage as ViewPage }
