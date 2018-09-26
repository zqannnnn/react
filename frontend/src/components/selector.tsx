import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RootState, CurrencyState } from '../reducers'
import { Row, Select } from 'antd'
import { currencyActionCreators } from '../actions'
import { ListOptions } from '../models'
import i18n from 'i18next'
import './selector.scss'
const Option = Select.Option

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
class Selector extends React.Component<ItemProps, ItemState> {
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

  handleSelectSort = (value: string) => {
    let options = this.state.options
    options.sorting = value
    this.setState({ options })
    this.props.onOptionsChange(options)
  }
  render() {
    const { currency } = this.props
    return (
      <div className="selector">
        <Row>
            <span className="selector-item">
                <Select
                    defaultValue={i18n.t('New to old')}
                    onChange={this.handleSelectSort}
                    className="item"
                >
                    <Option value="new">{i18n.t('New to old')}</Option>
                    <Option value="old">{i18n.t('Old to new')}</Option>
                </Select>
            </span>
            
            <span className="selector-item">
                <Select
                    value={currency.currentCurrency}
                    onChange={this.handleSelectCurrency}
                    className="item"
                >
                    {currency.items
                    ? currency.items.map((item, index) => (
                        <Select.Option key={index} value={item.code}>
                            {item.code}({item.description})
                        </Select.Option>
                        ))
                    : ''}
                </Select>
            </span>
            
        </Row>
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  const { currency } = state
  return { currency }
}

const connectedItem = connect(mapStateToProps)(Selector)
export { connectedItem as Selector }
