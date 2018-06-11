import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionConsts } from '../constants'
import { RootState, CurrencyState } from '../reducers'
import { Row, Col, Checkbox, Select, Icon } from 'antd'
import { transactionActionCreators, currencyActionCreators } from '../actions'
import i18n from 'i18next'

interface ItemProps {
  dispatch: Dispatch<RootState>
  currency: CurrencyState
}

const grid = {
  xs: { span: 24 },
  sm: { span: 18, push: 6 },
  md: { span: 16, push: 8 },
  lg: { span: 10, push: 14 }
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

  render() {
    const { currency } = this.props
    return (
      <div className="margin-bottom">
        <Row>
          <Col {...grid}>
            <Checkbox.Group onChange={this.onChange}>
              <Checkbox value={transactionConsts.TYPE_BUY}>
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
            >
              {currency.items
                ? currency.items.map((item, index) => (
                    <Select.Option key={index} value={item.code}>
                      {item.code}({item.description})
                    </Select.Option>
                  ))
                : ''}
            </Select>
          </Col>
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
