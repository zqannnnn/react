import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { RootState } from '../../reducers'
import { Collapse } from 'antd'
import './chat.scss'
//import Collapse from 'rc-collapse'
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
    const Panel = Collapse.Panel
    return (
      <div id="chat">
        <Collapse accordion>
          <Panel header="Chat" key="1">
            <p>Hoi</p>
          </Panel>
        </Collapse>  
      </div>   
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

