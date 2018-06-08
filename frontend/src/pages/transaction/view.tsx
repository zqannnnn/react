import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import {
  transactionActionCreators,
  lightboxActionCreators
} from '../../actions'
import { Transaction } from '../../models'
import { Category, CategoryDetails } from '../../models'
import { RootState } from '../../reducers'
import { Exchange } from '../../components/exchange'
import { Row, Col, Icon } from 'antd'
import i18n from 'i18next'
interface TransactionProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<RootState>
  transaction: Transaction
}
interface TransactionState {
  transactionId?: string
  loading: boolean
}
class ViewPage extends React.Component<TransactionProps, TransactionState> {
  constructor(props: TransactionProps) {
    super(props)
    this.state = {
      loading: true
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
  componentWillReceiveProps(nextProps: TransactionProps) {
    const { transaction } = nextProps
    if (transaction) {
      this.setState({ loading: false })
    }
  }
  openLightbox = (images: string[], index: number) => {
    this.props.dispatch(lightboxActionCreators.open(images, index))
  }
  render() {
    const { transaction } = this.props
    const { loading } = this.state

    let imagePaths: string[]
    if (transaction && transaction.images) {
      imagePaths = transaction.images.map(image => image.path)
    } else {
      imagePaths = []
    }
    return (
      <>
        <Row type="flex" justify="space-around" align="middle">
          <Col span={20}>
            <h2 className="header-center">{i18n.t('Transaction View Page')}</h2>
            {loading ? (
              <Icon type="loading" />
            ) : (
              <div className="view-content">
                <Row>
                  <Col span={20} offset={2}>
                    <label>{i18n.t('Title')}:</label>
                    <div className="message">
                      {transaction.title ? transaction.title : 'N/A'}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={20} md={9} offset={2} className="view-top">
                    <label>{i18n.t('Storage')}:</label>
                    <div className="message">
                      {transaction.storage ? transaction.storage : 'N/A'}
                    </div>
                  </Col>
                  <Col sm={20} md={9} offset={2} className="view-top">
                    <label>{i18n.t('Breed')}:</label>
                    <div className="message">
                      {transaction.breed ? transaction.breed : 'N/A'}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={20} md={9} offset={2} className="view-top">
                    <label>{i18n.t('Grade')}:</label>
                    <div className="message">
                      {transaction.grade ? transaction.grade : 'N/A'}
                    </div>
                  </Col>
                  <Col sm={20} md={9} offset={2} className="view-top">
                    <label>{i18n.t('MarbleScore')}:</label>
                    <div className="message">
                      {transaction.marbleScore
                        ? transaction.marbleScore
                        : 'N/A'}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={20} md={9} offset={2} className="view-top">
                    <label>{i18n.t('Slaughter Specification')}:</label>
                    <div className="message">
                      {transaction.slaughterSpec
                        ? transaction.slaughterSpec
                        : 'N/A'}
                    </div>
                  </Col>
                  <Col sm={20} md={9} offset={2} className="view-top">
                    <label>{i18n.t('Bone')}:</label>
                    <div className="message">
                      {transaction.bone ? transaction.bone : 'N/A'}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={20} md={9} offset={2} className="view-top">
                    <label>{i18n.t('Primal Cuts')}:</label>
                    <div className="message">
                      {transaction.primalCuts ? transaction.primalCuts : 'N/A'}
                    </div>
                  </Col>
                  <Col sm={20} md={9} offset={2} className="view-top">
                    <label>{i18n.t('Trimmings')}:</label>
                    <div className="message">
                      {transaction.trimmings
                        ? transaction.trimmings + 'CL'
                        : 'N/A'}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={20} md={9} offset={2} className="view-top">
                    <label>{i18n.t('Fed')}:</label>
                    <div className="message">
                      {transaction.fed ? transaction.fed : 'N/A'}
                      {transaction.grainFedDays ? (
                        <span>
                          <br />
                          {transaction.grainFedDays} Day
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </Col>
                  <Col sm={20} md={9} offset={2} className="view-top">
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
                <Row>
                  <Col sm={20} md={9} offset={2} className="view-top">
                    <label>{i18n.t('Quantity')}:</label>
                    <div className="message">
                      {transaction.quantity
                        ? transaction.quantity + 'KG'
                        : 'N/A'}
                    </div>
                  </Col>
                  <Col sm={20} md={9} offset={2} className="view-top">
                    <label>{i18n.t('Brand')}:</label>
                    <div className="message">
                      {transaction.brand ? transaction.brand : 'N/A'}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={20} md={9} offset={2} className="view-top">
                    <label>{i18n.t('Factory Number')}:</label>
                    <div className="message">
                      {transaction.factoryNum ? transaction.factoryNum : 'N/A'}
                    </div>
                  </Col>
                  <Col sm={20} md={9} offset={2} className="view-top">
                    <label>{i18n.t('Delivery Term')}:</label>
                    <div className="message">
                      {transaction.deliveryTerm
                        ? transaction.deliveryTerm
                        : 'N/A'}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={20} md={9} offset={2} className="view-top">
                    <label>{i18n.t('Place of Origin')}:</label>
                    <div className="message">
                      {transaction.placeOfOrigin
                        ? transaction.placeOfOrigin
                        : 'N/A'}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={20} offset={2} className="view-top">
                    <label>{i18n.t('Images')}:</label>
                    <div>
                      {imagePaths && (
                        <div className="images-container">
                          {imagePaths.map((image, index) => (
                            <div key={index} className="image-wrapper">
                              <img
                                className="image cursor-pointer"
                                onClick={() =>
                                  this.openLightbox(imagePaths, index)
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
      </>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { transaction } = state
  const { transData } = transaction
  return { transaction: transData }
}
const connectedViewPage = connect(mapStateToProps)(ViewPage)
export { connectedViewPage as ViewPage }
