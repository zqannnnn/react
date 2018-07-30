import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../reducers'
//import { AuthInfo } from '../actions'
//import { Currency } from '../models'
interface ItemProps {
  //dispatch: Dispatch<RootState>
  //price: number
  //currencyCode: string
  //currencyState: CurrencyState
}
class Chat extends React.Component<ItemProps> {
  constructor(props: ItemProps) {
    super(props)
  }
  render() {
    //const { price, currencyCode } = this.props
    //let newPrice = this.exchangeCurrency(price, currencyCode)
    return (
      <div>Chat</div>
    )
  }
}

function mapStateToProps(state: RootState) {
  //const { currency } = state
  //return { currencyState: currency }
  return { }
}

const connectedItem = connect(mapStateToProps)(Chat)
export { connectedItem as Chat }

