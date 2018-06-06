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
import { Icon, Col, Row } from 'antd'
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
      <Row>
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 16, offset: 4 }}
          md={{ span: 12, offset: 6 }}
          lg={{ span: 10, offset: 7 }}
        >
          <h3 className="header-center">{i18n.t('Transaction View Page')}</h3>
          {loading ? (
            <Icon type="loading" />
          ) : (
            <div>
              <h3>{i18n.t('Title')}:</h3>
              <div>{transaction.title}</div>
              <h3>{i18n.t('Storage')}:</h3>
              <div>{transaction.storage}</div>
              <h3 className="label">{i18n.t('Breed')}:</h3>
              <div>{transaction.breed}</div>
              <h3 className="label">{i18n.t('Grade')}:</h3>
              <div>{transaction.grade}</div>
              <h3>{i18n.t('MarbleScore')}:</h3>
              <div>{transaction.marbleScore}</div>
              <h3>{i18n.t('Slaughter Specification')}:</h3>
              <div>{transaction.slaughterSpec}</div>
              <h3>{i18n.t('Bone')}:</h3>
              <div>{transaction.bone}</div>
              <h3>{i18n.t('Primal Cuts')}::</h3>
              <div>{transaction.primalCuts}</div>
              <h3>{i18n.t('Trimmings')}:</h3>
              <div>{transaction.trimmings && transaction.trimmings + 'CL'}</div>
              <h3>{i18n.t('Fed')}:</h3>
              <div>
                {transaction.fed}
                {transaction.grainFedDays ? (
                  <span>
                    <br />
                    {transaction.grainFedDays} Day
                  </span>
                ) : (
                  ''
                )}
              </div>
              <h3>{i18n.t('Price')}:</h3>
              <div>
                <span>{`${transaction.price} ${
                  transaction.currencyCode
                }/KG`}</span>
              </div>
              <h3>{i18n.t('Quantity')}:</h3>
              <div>{transaction.quantity && transaction.quantity + 'KG'}</div>
              <h3>{i18n.t('Brand')}:</h3>
              <div>{transaction.brand}</div>
              <h3>{i18n.t('Factory Number')}:</h3>
              <div>{transaction.factoryNum}</div>
              <h3>{i18n.t('Delivery Term')}:</h3>
              <div>{transaction.deliveryTerm}</div>
              <h3>{i18n.t('Place Of Origin')}:</h3>
              <div>{transaction.placeOfOrigin}</div>
              <h3 className="label">{i18n.t('Images')}:</h3>
              <div>
                {imagePaths && (
                  <div className="images-container">
                    {imagePaths.map((image, index) => (
                      <div key={index} className="image-wrapper">
                        <img
                          className="image cursor-pointer"
                          onClick={() => this.openLightbox(imagePaths, index)}
                          src={image}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Col>
      </Row>
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
