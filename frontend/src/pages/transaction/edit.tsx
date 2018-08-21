import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import {
  goodsActionCreators,
  transactionActionCreators,
  categoryActionCreators,
  currencyActionCreators,
  lightboxActionCreators,
  alertActionCreators,
  AuthInfo
} from '../../actions'
import { Transaction, Image, Goods } from '../../models'
import { Category, CategoryDetails, Currency } from '../../models'
import { RootState } from '../../reducers'
import { transactionConsts, authConsts } from '../../constants'
import {
  Button,
  message,
  Row,
  Col,
  Input,
  InputNumber,
  Select,
  Upload,
  Icon
} from 'antd'
import i18n from 'i18next'

const { TextArea } = Input

interface TransProps
  extends RouteComponentProps<{ id: string; goodsId: string }> {
  dispatch: Dispatch<RootState>
  loading: boolean
  processing: boolean
  transProp: Transaction
  goodsProp: Goods
  categories: Category[]
  currencies: Currency[]
  image: string
  authInfo: AuthInfo
}
interface TransState {
  transaction: Transaction
  transactionId?: string
  goodsId?: string
  goods?: Goods
  submitted: boolean
  imageUploading: boolean
  certificateUploading: boolean
}

class EditPage extends React.Component<TransProps, TransState> {
  constructor(props: TransProps) {
    super(props)
    this.state = {
      submitted: false,
      transaction: {
        currencyCode: 'USD',
        isMakerSeller: true,
        goods: {}
      },
      imageUploading: false,
      certificateUploading: false
    }
  }

  componentDidMount() {
    let transactionId = this.props.match.params.id
    transactionId &&
      this.setState({
        ...this.state,
        transactionId
      })
    let goodsId = this.props.match.params.goodsId
    goodsId &&
      this.setState({
        ...this.state,
        goodsId
      })
    if (!this.props.categories)
      this.props.dispatch(categoryActionCreators.getAll())
    if (!this.props.currencies)
      this.props.dispatch(currencyActionCreators.getAll())
    transactionId &&
      this.props.dispatch(transactionActionCreators.getById(transactionId))
    goodsId && this.props.dispatch(goodsActionCreators.getById(goodsId))

    if (this.props.authInfo && this.props.authInfo.preferredCurrencyCode) {
      const transaction = this.state.transaction
      this.setState({
        transaction: {
          ...transaction,
          currencyCode: this.props.authInfo.preferredCurrencyCode
        }
      })
    }
  }
  componentWillReceiveProps(nextProps: TransProps) {
    const { transProp, goodsProp, image, categories } = nextProps
    const { submitted, transactionId, goodsId, transaction } = this.state
    const goods = transaction.goods
    if (transactionId && transProp && !submitted) {
      this.setState({
        transaction: {
          ...transaction,
          ...transProp
        }
      })
    }
    if (!transactionId && categories) {
      this.setState({
        transaction: {
          ...transaction
        }
      })
    }
    if (goodsId && goodsProp && !submitted) {
      this.setState({
        transaction: {
          ...transaction,
          goods: {
            ...goods,
            ...goodsProp
          }
        }
      })
    }
  }
  handleSelectChange = (value: string, name: string) => {
    const { transaction } = this.state
    this.setState({
      transaction: {
        ...transaction,
        [name]: value
      }
    })
  }
  handleInputNumber = (value: string | number, name: string | number) => {
    const { transaction } = this.state
    this.setState({
      transaction: {
        ...transaction,
        [name]: value
      }
    })
  }
  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.setState({ submitted: true })
    if (this.state.transaction.isMakerSeller) {
      if (
        this.props.authInfo.licenseStatus !==
        authConsts.LICENSE_STATUS_CONFIRMED
      ) {
        this.props.dispatch(
          alertActionCreators.error(
            'You are not allowed to add new Offer, please fullfill company info first.'
          )
        )
        window.scrollTo(0, 0)
        return
      }
    }
    const { transaction, transactionId, goodsId } = this.state
    const { dispatch } = this.props
    if (transaction.price) {
      transaction.goodsId = goodsId
      if (transactionId)
        dispatch(transactionActionCreators.edit(transaction, transactionId))
      else dispatch(transactionActionCreators.new(transaction))
    } else {
      //dispatch(alertActionCreators.error(""));
    }
    window.scrollTo(0, 0)
  }
  openLightbox = (image: string) => {
    this.props.dispatch(lightboxActionCreators.open(image))
  }

  //for render select input
  renderSelect(optionItems: Array<string>, field: keyof Transaction) {
    let selectValue = this.state.transaction[field] || ''
    return (
      <Select value={String(selectValue)}>
        {optionItems.map((item, index) => (
          <Select.Option key={index} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    )
  }
  customRequest = () => {
    return false
  }

  render() {
    const { price, status, currencyCode, goods } = this.state.transaction
    let { submitted } = this.state
    let { processing, currencies } = this.props
    let imagePaths: string[]
    if (goods && goods.images) {
      imagePaths = goods.images.map(image => image.path)
    } else {
      imagePaths = []
    }
    return (
      <Row className="edit-page page">
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 22, offset: 1 }}
          md={{ span: 20, offset: 2 }}
          lg={{ span: 20, offset: 2 }}
        >
          <h2 className="header-center">
            {this.state.transaction.id
              ? i18n.t('Edit Transaction Page')
              : i18n.t('Create Transaction Page')}
          </h2>
          <form name="form" onSubmit={this.handleSubmit}>
            <div className="steps-content">
              {goods && (
                <div className="edits-input">
                  <Row>
                    <Col span={20} offset={2} className="edits-input">
                      <label className="edits-input">{i18n.t('Title')}</label>
                      <div>{goods.title}</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={20} offset={2} className="edits-input">
                      <label>{i18n.t('Description')}</label>
                      <div>{goods.desc}</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={20} offset={2} className="view-top">
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
                  <Row>
                    <Col
                      xs={{ span: 20, offset: 2 }}
                      sm={{ span: 20, offset: 2 }}
                      md={{ span: 9, offset: 2 }}
                      lg={{ span: 9, offset: 2 }}
                      className="edits-input"
                      offset={2}
                    >
                      <label>{i18n.t('Price')}</label>
                      {currencies && (
                        <div className="flex">
                          <div
                            className={submitted && !price ? 'has-error' : ''}
                          >
                            <InputNumber
                              min={0}
                              max={99999}
                              defaultValue={0}
                              value={price}
                              onChange={(value: number) =>
                                this.handleInputNumber(value, 'price')
                              }
                            />
                            {submitted &&
                              !price && (
                                <div className="invalid-feedback">
                                  {i18n.t('Price is required')}
                                </div>
                              )}
                          </div>
                          <Select
                            className="label-right"
                            value={currencyCode}
                            onSelect={(value: string) =>
                              this.handleSelectChange(value, 'currencyCode')
                            }
                          >
                            {currencies.map((item, index) => (
                              <Select.Option key={index} value={item.code}>
                                {item.code}
                              </Select.Option>
                            ))}
                          </Select>
                          <div className="label-right">/KG</div>
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      sm={20}
                      md={8}
                      lg={8}
                      offset={2}
                      className="edits-input"
                    >
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="button-margin"
                      >
                        {i18n.t('Submit')}
                      </Button>
                      {processing && <Icon type="loading" />}
                      <Button>
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
  const { transaction, category, currency, auth, goods } = state
  const { processing, loading, transData } = transaction
  const { goodsData } = goods
  return {
    processing,
    categories: category.items,
    currencies: currency.items,
    transProp: transData,
    goodsProp: goodsData,
    authInfo: auth.authInfo
  }
}
const connectedEditPage = connect(mapStateToProps)(EditPage)
export { connectedEditPage as EditPage }
