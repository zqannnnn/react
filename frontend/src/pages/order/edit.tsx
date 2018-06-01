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
import { FormattedMessage } from 'react-intl'
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
          <>
            <label>
              <FormattedMessage
                id="itemFields.orderType"
                defaultMessage="Order Type"
              />
            </label>
            <Row type="flex" justify="start">
              <Col sm={12} md={12} lg={12}>
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
          </>
        )
      case 1:
        return (
          <>
            <Row type="flex" justify="start">
              <Col xs={20} sm={20} md={20} lg={20} offset={2}>
                <div className={submitted && !title ? ' has-error' : ''}>
                  <label className="edits-title">
                    <FormattedMessage
                      id="itemFields.title"
                      defaultMessage="Title"
                    />
                  </label>
                  <Input
                    type="text"
                    name="title"
                    value={title}
                    onChange={this.handleInputChange}
                    placeholder="请输入标题"
                    size="large"
                  />
                  {submitted &&
                    !title && (
                      <div className="invalid-feedback">
                        <FormattedMessage
                          id="itemErrors.missingTitle"
                          defaultMessage="Title is required"
                        />
                      </div>
                    )}
                </div>
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.bone"
                    defaultMessage="Bone"
                  />
                </label>
                {currentCategory &&
                  this.renderSelect(currentCategory.details['Bone'], 'bone')}
              </Col>
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.storage"
                    defaultMessage="Storage"
                  />
                </label>
                {currentCategory &&
                  this.renderSelect(
                    currentCategory.details['Storage'],
                    'storage'
                  )}
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.grade"
                    defaultMessage="Grade"
                  />
                </label>
                {currentCategory &&
                  this.renderSelect(currentCategory.details['Grade'], 'grade')}
              </Col>
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.slaughterSpec"
                    defaultMessage="Slaughter Specification"
                  />
                </label>
                {currentCategory &&
                  this.renderSelect(
                    currentCategory.details['Slaughter Specification'],
                    'slaughterSpec'
                  )}
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.marbleScore"
                    defaultMessage="Marble Score"
                  />
                </label>
                {currentCategory &&
                  this.renderSelect(
                    currentCategory.details['Marble Score'],
                    'marbleScore'
                  )}
              </Col>
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                {currentCategory &&
                  currentCategory.type != 'Sheep' && (
                    <div>
                      <label>
                        <FormattedMessage
                          id="itemFields.breed"
                          defaultMessage="Breed"
                        />
                      </label>
                      {this.renderSelect(
                        currentCategory.details['Breed'],
                        'breed'
                      )}
                    </div>
                  )}
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                {currentCategory &&
                  currentCategory.type == 'Beef' && (
                    <div>
                      <label>
                        <FormattedMessage
                          id="itemFields.fed"
                          defaultMessage="Fed"
                        />
                      </label>
                      {this.renderSelect(currentCategory.details['Fed'], 'fed')}
                    </div>
                  )}
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                {fed == 'Grain fed' && (
                  <div>
                    <label>
                      <FormattedMessage
                        id="itemFields.grainFedDays"
                        defaultMessage="Grain fed days"
                      />
                    </label>
                    <div>
                      <InputNumber
                        min={0}
                        max={100000}
                        defaultValue={0}
                        onChange={(value: number) =>
                          this.handleInputNumber(value, 'grainFedDays')
                        }
                      />
                      <span className="label-right">
                        <FormattedMessage
                          id="itemFields.day"
                          defaultMessage="Day"
                        />
                      </span>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.primalCuts"
                    defaultMessage="Primal Cuts"
                  />
                </label>
                <Input
                  type="text"
                  name="primalCuts"
                  value={primalCuts}
                  onChange={this.handleInputChange}
                />
              </Col>
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <div>
                  <label>
                    <FormattedMessage
                      id="itemFields.trimmings"
                      defaultMessage="Trimmings"
                    />
                  </label>
                  <div>
                    <InputNumber
                      min={0}
                      max={100000}
                      defaultValue={0}
                      onChange={(value: number) =>
                        this.handleInputNumber(value, 'trimmings')
                      }
                    />
                    <span className="label-right">CL</span>
                  </div>
                </div>
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.brand"
                    defaultMessage="Brand"
                  />
                </label>
                <Input
                  type="text"
                  name="brand"
                  value={brand}
                  onChange={this.handleInputChange}
                />
              </Col>
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <div>
                  <label>
                    <FormattedMessage
                      id="itemFields.factoryNum"
                      defaultMessage="Factory Number"
                    />
                  </label>
                  <Input
                    type="text"
                    name="factoryNum"
                    value={factoryNum}
                    onChange={this.handleInputChange}
                  />
                </div>
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.placeOfOrigin"
                    defaultMessage="Place Of Origin"
                  />
                </label>
                <Input
                  type="text"
                  name="placeOfOrigin"
                  value={placeOfOrigin}
                  onChange={this.handleInputChange}
                />
              </Col>
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.deliveryTerm"
                    defaultMessage="Delivery Term"
                  />
                </label>
                <Input
                  type="text"
                  name="deliveryTerm"
                  value={deliveryTerm}
                  onChange={this.handleInputChange}
                />
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} className="edits-select" offset={2}>
                <div>
                  <label>
                    <FormattedMessage
                      id="itemFields.quantity"
                      defaultMessage="Quantity"
                    />
                  </label>
                  <div>
                    <InputNumber
                      max={999999}
                      defaultValue={1}
                      min={1}
                      value={quantity}
                      onChange={(value: number) =>
                        this.handleInputNumber(value, 'quantity')
                      }
                    />
                    <span className="label-right">KG</span>
                  </div>
                </div>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col sm={17} md={17} lg={17} className="edits-select" offset={2}>
                <label>
                  <FormattedMessage
                    id="itemFields.price"
                    defaultMessage="Price"
                  />
                </label>
                {currencys && (
                  <div>
                    <Col sm={3} md={3} lg={3}>
                      <InputNumber
                        min={0}
                        max={99999}
                        defaultValue={0}
                        value={price}
                        onChange={(value: number) =>
                          this.handleInputNumber(value, 'price')
                        }
                      />
                    </Col>
                    <Col sm={3} md={3} lg={3}>
                      <Select
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
                    </Col>
                    <Col>
                      <span className="label-right">/KG</span>
                    </Col>
                  </div>
                )}
              </Col>
            </Row>
            <Row
              type="flex"
              justify="start"
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            >
              <Col sm={8} md={8} lg={8} offset={2}>
                <div className="edits-select">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="button-margin"
                  >
                    <FormattedMessage
                      id="editButton.submit"
                      defaultMessage="Submit"
                    />
                  </Button>
                  {editing && <Icon type="loading" />}
                  <Button>
                    <Link to="/">
                      <FormattedMessage
                        id="editButton.cancel"
                        defaultMessage="Cancel"
                      />
                    </Link>
                  </Button>
                </div>
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
      <div className="edits-container-wrap">
        <h2 className="header-center">
          {this.state.order.id ? (
            <FormattedMessage
              id="pages.editOrderPage"
              defaultMessage="Edit Order Page"
            />
          ) : (
            <FormattedMessage
              id="pages.createOrderPage"
              defaultMessage="Create Order Page"
            />
          )}
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
      </div>
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
