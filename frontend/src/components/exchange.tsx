import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RootState, CurrencyState } from '../reducers'
import { AuthInfo } from '../actions'
import { Currency } from '../models'
interface ItemProps {
  dispatch: Dispatch<RootState>
  price: number
  currencyCode: string
  currencyState: CurrencyState
}
class Exchange extends React.Component<ItemProps> {
  constructor(props: ItemProps) {
    super(props)
  }
  exchangeCurrency = (price: number, currencyCode: string) => {
    let currencies = this.props.currencyState.items
    let result = ''
    if (currencies) {
      let newArray = currencies.filter(currency => {
        return currency.code === currencyCode
      })
      let oldRate = newArray[0].rate
      let currentCurrency = this.props.currencyState.currentCurrency
      let newRate = currencies.filter(currency => {
        return currency.code === currentCurrency
      })[0].rate
      let newPrice = (((price / oldRate) * newRate * 100) / 100).toFixed(4)
      result = newPrice.toString() + currentCurrency
    }

    return result
  }
  render() {
    const { price, currencyCode } = this.props
    let newPrice = this.exchangeCurrency(price, currencyCode)
    return <>{newPrice}</>
  }
}

function mapStateToProps(state: RootState) {
  const { currency } = state
  return { currencyState: currency }
}

const connectedItem = connect(mapStateToProps)(Exchange)
export { connectedItem as Exchange }
