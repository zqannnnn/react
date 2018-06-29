import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import {
  goodsActionCreators,
  transactionActionCreators,
  categoryActionCreators,
  currencyActionCreators,
  uploadActionCreators,
  lightboxActionCreators,
  alertActionCreators,
  AuthInfo
} from '../../actions'
import { Transaction, Image, Goods } from '../../models'
import { Category, CategoryDetails, Currency } from '../../models'
import { RootState } from '../../reducers'
import { transactionConsts, authConsts } from '../../constants'
import {
  Steps,
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

const Step = Steps.Step
const { TextArea } = Input

interface TransProps
  extends RouteComponentProps<{ id: string; goodsId: string }> {
  dispatch: Dispatch<RootState>
  loading: boolean
  processing: boolean
  transProp: Transaction
  goodsProp: Goods
  categorys: Category[]
  currencys: Currency[]
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
  current: number
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
      certificateUploading: false,
      current: 0
    }
  }
  next() {
    if (this.state.transaction) {
      const current = this.state.current + 1
      this.setState({ current })
    }
  }
  prev() {
    const current = this.state.current - 1
    this.setState({ current })
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
    if (!this.props.categorys)
      this.props.dispatch(categoryActionCreators.getAll())
    if (!this.props.currencys)
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
    const { transProp, goodsProp, image, categorys } = nextProps
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
    if (!transactionId && categorys) {
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
    this.props.dispatch(uploadActionCreators.clear())
    this.setState({ certificateUploading: false })
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
      if (transactionId)
        dispatch(transactionActionCreators.edit(transaction, transactionId))
      else dispatch(transactionActionCreators.new(transaction))
    } else {
      //dispatch(alertActionCreators.error(""));
    }
    window.scrollTo(0, 0)
  }
  openLightbox = (images: string[], index: number) => {
    this.props.dispatch(lightboxActionCreators.open(images, index))
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

  renderItem = (current: number) => {
    const { price, status, currencyCode, goods } = this.state.transaction
    let { submitted } = this.state
    let { processing, currencys } = this.props
    let imagePaths: string[]
    if (goods && goods.images) {
      imagePaths = goods.images.map(image => image.path)
    } else {
      imagePaths = []
    }
    switch (current) {
      case 0:
        return (
          <Row>
            <Col
              xs={{ span: 20, offset: 2 }}
              sm={{ span: 20, offset: 2 }}
              md={{ span: 9, offset: 2 }}
              lg={{ span: 9, offset: 2 }}
              className="edits-input"
            >
              <h2>{i18n.t('Buy or Sell')}</h2>
              <Select
                size="large"
                value={String(this.state.transaction.isMakerSeller)}
                onSelect={(value: string) =>
                  this.handleSelectChange(value, 'isMakerSeller')
                }
              >
                <Select.Option key="false">
                  {i18n.t(transactionConsts.TYPE_BUY)}
                </Select.Option>
                <Select.Option key="true">
                  {i18n.t(transactionConsts.TYPE_SELL)}
                </Select.Option>
              </Select>
            </Col>
          </Row>
        )
      case 1:
        return (
          <>
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
                    {currencys && (
                      <div className="flex">
                        <div className={submitted && !price ? 'has-error' : ''}>
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
                          {currencys.map((item, index) => (
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
                  <Col sm={20} md={8} lg={8} offset={2} className="edits-input">
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
          </>
        )
      default:
        break
    }
  }
  render() {
    const { current } = this.state
    const steps = [
      {
        title: 'First'
      },
      {
        title: 'Second'
      }
    ]
    return (
      <Row className="edit-page">
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
            <Steps current={current}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className="steps-content">
              {this.renderItem(this.state.current)}
            </div>
            <div className="steps-action">
              {this.state.current < steps.length - 1 && (
                <Button type="primary" onClick={() => this.next()}>
                  {i18n.t('Next')}
                </Button>
              )}

              {this.state.current > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  {i18n.t('Previous')}
                </Button>
              )}
            </div>
          </form>
        </Col>
      </Row>
    )
  }
}
function mapStateToProps(state: RootState) {
  const { transaction, category, currency, upload, auth, goods } = state
  const { processing, loading, transData } = transaction
  const { goodsData } = goods
  return {
    processing,
    categorys: category.items,
    currencys: currency.items,
    transProp: transData,
    goodsProp: goodsData,
    image: upload.image,
    authInfo: auth.authInfo
  }
}
const connectedEditPage = connect(mapStateToProps)(EditPage)
export { connectedEditPage as EditPage }
