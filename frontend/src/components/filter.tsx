import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionConsts } from '../constants'
import { RootState, CurrencyState } from '../reducers'
import { Row, Col, Checkbox, Select } from 'antd'
import { transactionActionCreators, currencyActionCreators } from '../actions'
import i18n from 'i18next'
import { Transaction } from '../../../src/models'
const Option = Select.Option

interface ItemProps {
  dispatch: Dispatch<RootState>
  currency: CurrencyState
}

class Filter extends React.Component<ItemProps> {
  constructor(props: ItemProps) {
    super(props)
  }

  onChange = (values: string[]) => {
    let options: { buy?: boolean; sell?: boolean } = {}
    values.forEach((value: string) => {
      if (value == transactionConsts.TYPE_BUY)
        options = { ...options, buy: true }
      else if (value == transactionConsts.TYPE_SELL)
        options = { ...options, sell: true }
    })
    this.props.dispatch(
      transactionActionCreators.getAll({ selectType: 'all', ...options })
    )
  }
  handleSelect = (value: string) => {
    this.props.dispatch(currencyActionCreators.upCurrencystatus(value))
  }

  handleChange = (value: string) => {
    let options: { sorting: string } = { sorting: value }
    this.props.dispatch(
      transactionActionCreators.getAll({ selectType: 'all', ...options })
    )
  }

  render() {
    const { currency } = this.props
    return (
      <div className="filter margin-bottom">
        <Row className="media-width">
          <Select
            defaultValue={i18n.t('New to old')}
            style={{ width: 160 }}
            onChange={this.handleChange}
            className="sorting-left margin-bottom"
          >
            <Option value="new">{i18n.t('New to old')}</Option>
            <Option value="old">{i18n.t('Old to new')}</Option>
          </Select>
          <div className="float-right">
            <Checkbox.Group onChange={this.onChange} className="margin-bottom">
              <Checkbox
                value={transactionConsts.TYPE_BUY}
                className="margin-right"
              >
                {' '}
                {i18n.t('Wanted')}
              </Checkbox>
              <Checkbox value={transactionConsts.TYPE_SELL}>
                {i18n.t('On Sale')}
              </Checkbox>
            </Checkbox.Group>
            <Select
              value={currency.currentCurrency}
              onChange={this.handleSelect}
              style={{ width: 220 }}
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
