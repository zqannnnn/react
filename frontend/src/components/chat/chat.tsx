//1532692062 chat
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import * as socketIOClient from 'socket.io-client' //1532692062 chat
import { AuthState } from '../../reducers'
//https://ant.design/components/collapse/
//https://github.com/ant-design/ant-design/blob/master/components/collapse/demo/accordion.md
import { Collapse } from 'antd'
import './chat.scss'
//import Collapse from 'rc-collapse'
//import { AuthInfo } from '../actions'
//import { Currency } from '../models'
interface ItemProps {
  auth: AuthState
  //dispatch: Dispatch<RootState>
  //price: number
  //currencyCode: string
  //currencyState: CurrencyState
}
class Chat extends React.Component<ItemProps> {
  constructor(props: ItemProps) {
    super(props)
    //1532692062 chat
    //this.state = {
    //  endpoint: "http://localhost:3000" // this is where we are connecting to with sockets
    //}
  }
  render() {
    //console.log(AuthState)
    let { auth } = this.props
    const { loggedIn, authInfo } = auth
    //console.log('!!!!!!!!!!!!!!!!!')
    //console.log(authInfo)
    //const { loggedIn, authInfo } = auth
    //console.log('loggedIn: ' + loggedIn)
    //1532692062 chat
    // Within the render method, we will be checking for any sockets.
    // We do it in the render method because it is ran very often.
    //1532692062 chat
    //const socket = socketIOClient(this.state.endpoint)
    const socket = socketIOClient("http://localhost:3000")    
    //socket.set('nickname', authInfo['username']);
    //socket.nickname = authInfo['username'];
    socket.on('connect', function () {
      if ( authInfo !== undefined && authInfo['email'] !== undefined ) {
        console.log('!!!!!!!!!! send nickname')
        console.log(authInfo)
        //console.log(authInfo['username'])
        socket.emit('set email', authInfo['email']);
      }
      //socket.on('ready', function () {
      //  console.log('Connected !');
      //  socket.emit('msg', 'Static Message'));
      //});
    });    
    socket.emit('get-users', '') 

    //var clients = socket.clients();
    //console.log(clients)
    //const { price, currencyCode } = this.props
    //let newPrice = this.exchangeCurrency(price, currencyCode)
    const Panel = Collapse.Panel
    let chat: JSX.Element
    if (loggedIn) {
      chat = (
        <>
        <div id="chat">
          <Collapse accordion>
            <Panel header="Chat" key="1">
              <p>Hoi</p>
            </Panel>
          </Collapse>  
        </div>   
        </>
      )
    } else {
      chat = (
        <>
        <div id="chat">
        </div>   
        </>
      )
    }
    return chat
  }
}

//const connectedItem = connect(Chat)
export { Chat }

