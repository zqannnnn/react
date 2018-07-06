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
  AuthInfo
} from '../../actions'
import { Goods, Image, Transaction } from '../../models'
import { Category, Currency } from '../../models'
import { RootState } from '../../reducers'
import { goodsConsts } from '../../constants'
import { Steps, Button, Row, Col, Input, InputNumber, Select, Icon } from 'antd'
import i18n from 'i18next'

const Step = Steps.Step
const { TextArea } = Input

interface OrderEditProps {
  dispatch: Dispatch<RootState>
  processing: boolean
  categorys: Category[]
  currencys: Currency[]
  authInfo: AuthInfo
}
interface OrderEditState {
  transaction: Transaction
  goods: Goods
  goodsId?: string
  submitted: boolean
  current: number
}

class OrderEditPage extends React.Component<OrderEditProps, OrderEditState> {
  constructor(props: OrderEditProps) {
    super(props)
    this.state = {
      submitted: false,
      transaction: {
        currencyCode: 'USD',
        isMakerSeller: false
      },
      goods: {
        category: 'Beef',
        ifExist: false
      },
      current: 0
    }
  }
  next() {
    if (this.state.goods) {
      const current = this.state.current + 1
      this.setState({ current })
    }
  }
  prev() {
    const current = this.state.current - 1
    this.setState({ current })
  }

  componentDidMount() {
    if (!this.props.categorys)
      this.props.dispatch(categoryActionCreators.getAll())
    if (!this.props.currencys)
      this.props.dispatch(currencyActionCreators.getAll())
  }

  handleSelectChange = (value: string, name: string) => {
    const { goods } = this.state
    this.setState({
      goods: {
        ...goods,
        [name]: value
      }
    })
  }

  handlePriceChange = (value: string, name: string) => {
    const { transaction } = this.state
    this.setState({
      transaction: {
        ...transaction,
        [name]: value
      }
    })
  }

  handleInputChange = (
    e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>
  ) => {
    const { value, name } = e.currentTarget
    const { goods } = this.state
    this.setState({
      goods: {
        ...goods,
        [name]: value
      }
    })
  }

  handleInputNumber = (value: string | number, name: string | number) => {
    const { goods } = this.state
    this.setState({
      goods: {
        ...goods,
        [name]: value
      }
    })
  }

  handleInputPrice = (value: string | number, name: string | number) => {
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
    let { goods, goodsId, transaction } = this.state
    const { dispatch } = this.props

    if (goods.category && goods.title) {
      transaction.goods = goods
      dispatch(transactionActionCreators.newOrder(transaction))
    }
    window.scrollTo(0, 0)
  }
  //for render select input
  renderSelect(optionItems: Array<string>, field: keyof Goods) {
    let selectValue = this.state.goods[field] || ''
    return (
      <Select
        value={String(selectValue)}
        onSelect={(value: string) => this.handleSelectChange(value, field)}
      >
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
    const { currencyCode, price } = this.state.transaction
    let {
      title,
      desc,
      quantity,
      primalCuts,
      brand,
      factoryNum,
      deliveryTerm,
      placeOfOrigin,
      fed,
      grainFedDays,
      trimmings,
      category
    } = this.state.goods
    let { submitted } = this.state
    let { processing, categorys, currencys } = this.props
    let currentCategory: Category =
      categorys &&
      categorys.filter((item: Category) => {
        return item.type === category
      })[0]

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
              <label>{i18n.t('Category')}</label>
              <Select
                size="large"
                value={category}
                onSelect={(value: string) =>
                  this.handleSelectChange(value, 'category')
                }
              >
                {goodsConsts.CATEGORY.map((item, index) => (
                  <Select.Option key={index} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        )
      case 1:
        return (
          <>
            <div className="edits-input">
              <Row>
                <Col span={20} offset={2} className="edits-input">
                  <div className={submitted && !title ? ' has-error' : ''}>
                    <label className="edits-input">{i18n.t('Title')}</label>
                    <Input
                      placeholder=""
                      type="text"
                      name="title"
                      value={title}
                      onChange={this.handleInputChange}
                      size="large"
                    />
                    {submitted &&
                      !title && (
                        <div className="invalid-feedback">
                          {i18n.t('Title is required')}
                        </div>
                      )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={20} offset={2} className="edits-input">
                  <label>{i18n.t('Description')}</label>
                  <TextArea
                    placeholder=""
                    name="desc"
                    rows={4}
                    value={desc}
                    onChange={this.handleInputChange}
                  />
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 9, offset: 2 }}
                  lg={{ span: 9, offset: 2 }}
                  className="edits-input"
                >
                  <label>{i18n.t('Bone')}</label>
                  {currentCategory &&
                    this.renderSelect(currentCategory.details['Bone'], 'bone')}
                </Col>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 9, offset: 2 }}
                  lg={{ span: 9, offset: 2 }}
                  className="edits-input"
                >
                  <label>{i18n.t('Storage')}</label>
                  {currentCategory &&
                    this.renderSelect(
                      currentCategory.details['Storage'],
                      'storage'
                    )}
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 9, offset: 2 }}
                  lg={{ span: 9, offset: 2 }}
                  className="edits-input"
                >
                  <label>{i18n.t('Grade')}</label>
                  {currentCategory &&
                    this.renderSelect(
                      currentCategory.details['Grade'],
                      'grade'
                    )}
                </Col>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 9, offset: 2 }}
                  lg={{ span: 9, offset: 2 }}
                  className="edits-input"
                >
                  <label>{i18n.t('Slaughter Specification')}</label>
                  {currentCategory &&
                    this.renderSelect(
                      currentCategory.details['Slaughter Specification'],
                      'slaughterSpec'
                    )}
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 9, offset: 2 }}
                  lg={{ span: 9, offset: 2 }}
                  className="edits-input"
                >
                  <label>{i18n.t('Marble Score')}</label>
                  {currentCategory &&
                    this.renderSelect(
                      currentCategory.details['Marble Score'],
                      'marbleScore'
                    )}
                </Col>

                {currentCategory &&
                  currentCategory.type != 'Sheep' && (
                    <Col
                      xs={{ span: 20, offset: 2 }}
                      sm={{ span: 20, offset: 2 }}
                      md={{ span: 9, offset: 2 }}
                      lg={{ span: 9, offset: 2 }}
                      className="edits-input"
                    >
                      <label>{i18n.t('Breed')}</label>
                      {this.renderSelect(
                        currentCategory.details['Breed'],
                        'breed'
                      )}
                    </Col>
                  )}
              </Row>
              <Row>
                {currentCategory &&
                  currentCategory.type == 'Beef' && (
                    <Col
                      xs={{ span: 20, offset: 2 }}
                      sm={{ span: 20, offset: 2 }}
                      md={{ span: 9, offset: 2 }}
                      lg={{ span: 9, offset: 2 }}
                      className="edits-input"
                    >
                      <label>{i18n.t('Fed')}</label>
                      {this.renderSelect(currentCategory.details['Fed'], 'fed')}
                    </Col>
                  )}

                {fed == 'Grain fed' && (
                  <Col
                    xs={{ span: 20, offset: 2 }}
                    sm={{ span: 20, offset: 2 }}
                    md={{ span: 9, offset: 2 }}
                    lg={{ span: 9, offset: 2 }}
                    className="edits-input"
                  >
                    <label>{i18n.t('Grain fed days')}</label>
                    <div className="flex">
                      <InputNumber
                        min={0}
                        max={100000}
                        defaultValue={grainFedDays}
                        onChange={(value: number) =>
                          this.handleInputNumber(value, 'grainFedDays')
                        }
                      />
                      <div className="label-right">{i18n.t('Days')}</div>
                    </div>
                  </Col>
                )}
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 9, offset: 2 }}
                  lg={{ span: 9, offset: 2 }}
                  className="edits-input"
                >
                  <label>{i18n.t('Primal Cuts')}</label>
                  <Input
                    type="text"
                    name="primalCuts"
                    value={primalCuts}
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 9, offset: 2 }}
                  lg={{ span: 9, offset: 2 }}
                  className="edits-input"
                >
                  <label>{i18n.t('Trimmings')}</label>
                  <div className="flex">
                    <InputNumber
                      min={0}
                      max={100000}
                      defaultValue={trimmings}
                      onChange={(value: number) =>
                        this.handleInputNumber(value, 'trimmings')
                      }
                    />
                    <div className="label-right">CL</div>
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
                >
                  <label>{i18n.t('Brand')}</label>
                  <Input
                    type="text"
                    name="brand"
                    value={brand}
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 9, offset: 2 }}
                  lg={{ span: 9, offset: 2 }}
                  className="edits-input"
                >
                  <label>{i18n.t('Factory Number')}</label>
                  <Input
                    type="text"
                    name="factoryNum"
                    value={factoryNum}
                    onChange={this.handleInputChange}
                  />
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 9, offset: 2 }}
                  lg={{ span: 9, offset: 2 }}
                  className="edits-input"
                >
                  <label>{i18n.t('Place Of Origin')}</label>
                  <Input
                    type="text"
                    name="placeOfOrigin"
                    value={placeOfOrigin}
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 9, offset: 2 }}
                  lg={{ span: 9, offset: 2 }}
                  className="edits-input"
                >
                  <label>{i18n.t('Delivery Term')}</label>
                  <Input
                    type="text"
                    name="deliveryTerm"
                    value={deliveryTerm}
                    onChange={this.handleInputChange}
                  />
                </Col>
              </Row>
              <Row>
                <Col
                  xs={{ span: 20, offset: 2 }}
                  sm={{ span: 20, offset: 2 }}
                  md={{ span: 9, offset: 2 }}
                  lg={{ span: 9, offset: 2 }}
                  className="edits-input"
                >
                  <label>{i18n.t('Quantity')}</label>
                  <div className="flex">
                    <InputNumber
                      max={999999}
                      defaultValue={1}
                      min={1}
                      value={quantity}
                      onChange={(value: number) =>
                        this.handleInputNumber(value, 'quantity')
                      }
                    />
                    <div className="label-right">KG</div>
                  </div>
                </Col>
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
                      <InputNumber
                        min={0}
                        max={99999}
                        defaultValue={0}
                        value={price}
                        onChange={(value: number) =>
                          this.handleInputPrice(value, 'price')
                        }
                      />
                      <Select
                        className="label-right"
                        value={currencyCode}
                        onSelect={(value: string) =>
                          this.handlePriceChange(value, 'currencyCode')
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
          <h2 className="header-center">{i18n.t('Create Order Page')}</h2>
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
  const { goods, category, currency, auth } = state
  const { processing } = goods
  return {
    processing,
    categorys: category.items,
    currencys: currency.items,
    authInfo: auth.authInfo
  }
}
const connectedOrderEditPage = connect(mapStateToProps)(OrderEditPage)
export { connectedOrderEditPage as OrderEditPage }
