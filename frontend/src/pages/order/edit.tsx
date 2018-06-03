import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import {
  orderActionCreators,
  categoryActionCreators,
  currencyActionCreators
} from '../../actions'
import { Order } from '../../models'
import { Category, CategoryDetails, Currency } from '../../models'
import { RootState } from '../../reducers'
import { orderConsts } from '../../constants'
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
  Icon,
  Modal
} from 'antd'
import i18n from 'i18next'

const Step = Steps.Step

interface OrderProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch<RootState>
  loading: boolean
  editing: boolean
  orderData: Order
  categorys: Category[]
  currencys: Currency[]
}
interface OrderState {
  order: Order
  orderId?: string
  submitted: boolean
  current: number
}
class EditPage extends React.Component<OrderProps, OrderState> {
  constructor(props: OrderProps) {
    super(props)
    this.state = {
      submitted: false,
      order: {
        type: 'Beef'
      },
      current: 0
    }
  }

  componentDidMount() {
    let orderId = this.props.match.params.id
    orderId &&
      this.setState({
        ...this.state,
        orderId
      })
    if (!this.props.categorys)
      this.props.dispatch(categoryActionCreators.getAll())
    if (!this.props.currencys)
      this.props.dispatch(currencyActionCreators.getAll())
    orderId && this.props.dispatch(orderActionCreators.getById(orderId))
  }
  componentWillReceiveProps(nextProps: OrderProps) {
    const { orderData, categorys } = nextProps
    const { submitted, orderId, order } = this.state
    if (orderId && orderData && !submitted) {
      this.setState({
        order: {
          ...orderData,
          ...order
        }
      })
    }
    if (!orderId && categorys) {
      this.setState({
        order: {
          ...order
        }
      })
    }
  }
  next() {
    const current = this.state.current + 1
    this.setState({ current })
  }
  prev() {
    const current = this.state.current - 1
    this.setState({ current })
  }
  handleSelectChange = (value: string, name: string) => {
    const { order } = this.state
    this.setState({
      order: {
        ...order,
        [name]: value
      }
    })
  }
  handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    const { order } = this.state
    this.setState({
      order: {
        ...order,
        [name]: value
      }
    })
  }
  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { order, orderId } = this.state
    const { dispatch } = this.props
    if (order.type) {
      if (orderId) dispatch(orderActionCreators.edit(order, orderId))
      else dispatch(orderActionCreators.new(order))
    } else {
      //dispatch(alertActionCreators.error(""));
    }
    window.scrollTo(0, 0)
  }
  //for render select input
  renderSelect(optionItems: Array<string>, field: keyof Order) {
    let selectValue = this.state.order[field] || ' '
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
  handleInputNumber = (value: string | number, name: string | number) => {
    const { order } = this.state
    this.setState({
      order: {
        ...order,
        [name]: value
      }
    })
  }
  renderItem = (current: number) => {
    let {
      id,
      type,
      price,
      bone,
      primalCuts,
      quantity,
      brand,
      factoryNum,
      deliveryTerm,
      placeOfOrigin,
      fed,
      grainFedDays,
      trimmings,
      title
    } = this.state.order
    let { editing, categorys, currencys } = this.props
    let options = null
    let currentCategory: Category =
      categorys &&
      categorys.filter((category: Category) => {
        return category.type === type
      })[0]
    let { submitted } = this.state
    switch (current) {
      case 0:
        return (
          <Row>
            <Col xs={20} sm={18} md={12} lg={8} offset={1}>
              <label>{i18n.t('Order Type')}</label>
              <Select
                size="large"
                value={type}
                onSelect={(value: string) =>
                  this.handleSelectChange(value, 'type')
                }
              >
                {orderConsts.ORDER_TYPE.map((item, index) => (
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
            <Row>
              <Col span={20} offset={2}>
                <div className={submitted && !title ? ' has-error' : ''}>
                  <label className="edits-title">{i18n.t('Title')}</label>
                  <Input
                    type="text"
                    name="title"
                    value={title}
                    onChange={this.handleInputChange}
                    size="large"
                  />
                  {submitted &&
                    !title && (
                      <div className="invalid-feedback">
                        {i18n.t('Title is required"')}
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
                className="edits-select"
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
                className="edits-select"
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
                className="edits-select"
              >
                <label>{i18n.t('Grade')}</label>
                {currentCategory &&
                  this.renderSelect(currentCategory.details['Grade'], 'grade')}
              </Col>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
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
                className="edits-select"
              >
                <label>{i18n.t('Marble Score')}</label>
                {currentCategory &&
                  this.renderSelect(
                    currentCategory.details['Marble Score'],
                    'marbleScore'
                  )}
              </Col>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                {currentCategory &&
                  currentCategory.type != 'Sheep' && (
                    <>
                      <label>{i18n.t('Breed')}</label>
                      {this.renderSelect(
                        currentCategory.details['Breed'],
                        'breed'
                      )}
                    </>
                  )}
              </Col>
            </Row>
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                {currentCategory &&
                  currentCategory.type == 'Beef' && (
                    <>
                      <label>{i18n.t('Fed')}</label>
                      {this.renderSelect(currentCategory.details['Fed'], 'fed')}
                    </>
                  )}
              </Col>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
              >
                {fed == 'Grain fed' && (
                  <>
                    <label>{i18n.t('Grain fed days')}</label>
                    <div className="flex">
                      <InputNumber
                        min={0}
                        max={100000}
                        defaultValue={0}
                        onChange={(value: number) =>
                          this.handleInputNumber(value, 'grainFedDays')
                        }
                      />
                      <div className="label-right">{i18n.t('Day')}</div>
                    </div>
                  </>
                )}
              </Col>
            </Row>
            <Row>
              <Col
                xs={{ span: 20, offset: 2 }}
                sm={{ span: 20, offset: 2 }}
                md={{ span: 9, offset: 2 }}
                lg={{ span: 9, offset: 2 }}
                className="edits-select"
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
                className="edits-select"
              >
                <label>{i18n.t('Trimmings')}</label>
                <div className="flex">
                  <InputNumber
                    min={0}
                    max={100000}
                    defaultValue={0}
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
                className="edits-select"
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
                className="edits-select"
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
                className="edits-select"
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
                className="edits-select"
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
                className="edits-select"
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
                className="edits-select"
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
                        this.handleInputNumber(value, 'price')
                      }
                    />
                    <Select
                      className="label-right"
                      placeholder="currencys"
                      value={this.state.order['currencyCode']}
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
              <Col sm={20} md={8} lg={8} offset={2} className="edits-select">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="button-margin"
                >
                  {i18n.t('Submit')}
                </Button>
                {editing && <Icon type="loading" />}
                <Button>
                  <Link to="/">{i18n.t('Cancel')}</Link>
                </Button>
              </Col>
            </Row>
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
        title: 'Last'
      }
    ]
    return (
      <Row className="edit-page">
        <Col
          xs={24}
          sm={{ span: 22, offset: 1 }}
          md={{ span: 20, offset: 2 }}
          lg={{ span: 20, offset: 2 }}
        >
          <h2 className="header-center">
            {this.state.order.id
              ? i18n.t('Edit Order Page')
              : i18n.t('Create Order Page')}
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
                  Next
                </Button>
              )}
              {this.state.current > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  Previous
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
  const { order, category, currency } = state
  const { editing, loading, orderData } = order
  return {
    editing,
    categorys: category.items,
    currencys: currency.items,
    orderData
  }
}
const connectedEditPage = connect(mapStateToProps)(EditPage)
export { connectedEditPage as EditPage }
