import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { transactionConsts } from '../constants'
import { RootState, CurrencyState } from '../reducers'
import { Row, Col, Checkbox, Select } from 'antd'
import { transactionActionCreators, currencyActionCreators } from '../actions'
import i18n from 'i18next'
import { Transaction } from '../../../src/models'
import { ListOptions } from '../models'

const Option = Select.Option

interface ItemProps {
  dispatch: Dispatch<RootState>
  currency: CurrencyState
  handleSelectSort: (value: string) => void

  handleChangeType: (values: string[]) => void
}

class Filter extends React.Component<ItemProps> {
  constructor(props: ItemProps) {
    super(props)
  }

  handleSelectCurrency = (value: string) => {
    this.props.dispatch(currencyActionCreators.upCurrencystatus(value))
  }

  render() {
    const { currency, handleChangeType, handleSelectSort } = this.props
    return (
      <div className="filter margin-bottom">
        <Row>
          <Select
            defaultValue={i18n.t('New to old')}
            style={{ width: 160 }}
            onChange={handleSelectSort}
            className="sorting-left margin-bottom"
          >
            <Option value="new">{i18n.t('New to old')}</Option>
            <Option value="old">{i18n.t('Old to new')}</Option>
          </Select>
          <div className="float-right">
            <Checkbox.Group
              onChange={handleChangeType}
              className="margin-bottom"
            >
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
