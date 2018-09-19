import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionConsts } from '../constants'
import { RootState, CurrencyState } from '../reducers'
import { Row, Col, Checkbox, Select } from 'antd'
import { currencyActionCreators } from '../actions'
import { ListOptions } from '../models'
import i18n from 'i18next'

const Option = Select.Option
const CheckboxGroup = Checkbox.Group
const plainOptions = ['Beef', 'Veal', 'Sheep'];

interface ItemProps {
  dispatch: Dispatch<RootState>
  currency: CurrencyState
  onOptionsChange: (option: ListOptions) => void
  initOptions: ListOptions
}
interface ItemState {
  options: ListOptions
  checkedList: string[]
}

class Filter extends React.Component<ItemProps, ItemState> {
  constructor(props: ItemProps) {
    super(props)
    this.state = { options: {}, checkedList: [] }
  }
  componentDidMount() {
    this.setState({ options: this.props.initOptions })
  }
  handleSelectCurrency = (value: string) => {
    this.props.dispatch(currencyActionCreators.upCurrencyStatus(value))
  }
  handleChangeType = (values: string[]) => {
    let newOptions = this.state.options
    if (values.length === 2) {
      newOptions.buy = true
      newOptions.sell = true
    } else if (values.length === 1) {
      if (values[0] === transactionConsts.TYPE_BUY) {
        newOptions.buy = true
        newOptions.sell = false
      } else {
        newOptions.buy = false
        newOptions.sell = true
      }
    } else if (values.length === 0) {
      newOptions.buy = false
      newOptions.sell = false
    }
    this.setState({ options: newOptions })
    this.props.onOptionsChange(newOptions)
  }
  handleSelectSort = (value: string) => {
    let options = this.state.options
    options.sorting = value
    this.setState({ options })
    this.props.onOptionsChange(options)
  }
  processingCategory = (checkedList: string[]) => {
    let options = this.state.options
    options.category = checkedList
    this.setState({ options, checkedList })
    this.props.onOptionsChange(options)
  }
  render() {
    const { currency } = this.props
    return (
      <div className="filter">
        <Row>
          <Select
            defaultValue={i18n.t('New to old')}
            onChange={this.handleSelectSort}
            className="sorting-left margin-bottom select"
          >
            <Option value="new">{i18n.t('New to old')}</Option>
            <Option value="old">{i18n.t('Old to new')}</Option>
          </Select>
          <div className="checkbox-wr">
            <Checkbox.Group
              onChange={this.handleChangeType}
              className="margin-bottom"
            >
              <CheckboxGroup 
                options={plainOptions} 
                value={this.state.checkedList} 
                onChange={this.processingCategory} 
              />
              <Checkbox
                value={transactionConsts.TYPE_BUY}
                className="margin-right"
              >
                {' '}
                {i18n.t('Wanted')}
              </Checkbox>
              <Checkbox value={transactionConsts.TYPE_SELL}>
                {i18n.t('For Sale')}
              </Checkbox>
            </Checkbox.Group>
            <Select
              value={currency.currentCurrency}
              onChange={this.handleSelectCurrency}
              className="select"
            >
              {currency.items
                ? currency.items.map((item, index) => (
                    <Select.Option key={index} value={item.code}>
                      {item.code}({item.description})
                    </Select.Option>
                  ))
                : ''}
            </Select>
          </div>
        </Row>
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { currency } = state
  return { currency }
}

const connectedItem = connect(mapStateToProps)(Filter)
export { connectedItem as Filter }
