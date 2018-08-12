//1532692062 chat
import * as React from 'react'
//import { connect, Dispatch } from 'react-redux'
import * as socketIOClient from 'socket.io-client' //1532692062 chat
import { AuthState } from '../../reducers'
import { UserItem } from './user-item'
import { HashOfStringKeyHash, StringKeyHash } from '../../../../src/interfaces'

//https://ant.design/components/collapse/
//https://github.com/ant-design/ant-design/blob/master/components/collapse/demo/accordion.md
import { Collapse } from 'antd'
import './chat.scss'
interface ItemProps {
    auth: AuthState
    users: HashOfStringKeyHash
}
interface ItemState {
    users: HashOfStringKeyHash
    //socket: SocketIOClient.Socket
    socket: any
    userKey: string
    messages: StringKeyHash
}
class Chat extends React.Component<ItemProps, ItemState> {
	constructor(props: ItemProps) {
		super(props)
		//this.state = {
		//  endpoint: "http://localhost:3000" // this is where we are connecting to with sockets
        //}
        this.state = {
            users: props.users,
            socket: undefined,
            messages: {},
            userKey: ''
        }
	}
    componentWillMount() {
		let { auth } = this.props
		const { authInfo } = auth
        const that = this;
		const socket = socketIOClient("http://localhost:3000")
		socket.on('connect', function () {
            that.setState({socket: socket})
			if (authInfo !== undefined) socket.emit('get-users', authInfo)
			socket.on('get-users', (users: any) => {
                that.setState({users: users})
                for (let key in users) {  
                    if (authInfo !== undefined) {
                        if ( users[key].id == authInfo.id ) {
                            //console.log('YOU ARE ' + key )                        
                            that.setState({userKey: key})
                        }
                    }                    
                }
                that.setState({users: users})
            })
            socket.on("private", function(msg: any) {    
                let messages = that.state.messages
                const timestamp = new Date().valueOf().toString()
                messages[timestamp] = msg
                that.setState({ messages: messages });    
            })
		});
    }
	render() {
		let { auth } = this.props
		const { loggedIn, authInfo } = auth
		const Panel = Collapse.Panel
        let chat: JSX.Element
        if (loggedIn) {
			chat = (
				<>
					<div id="chat">
						<Collapse accordion>
                                {
                                    Object.keys(this.state.users).map((key, index) => {
                                        if (this.state.userKey != key) {
                                            return (
                                                <Panel header={this.state.users[key].name} key={key}> 
                                                    <UserItem user={this.state.users[key]} userKey={key} socket={this.state.socket} messages={this.state.messages} /> 
                                                </Panel>
                                            )    
                                        }
                                    })
                                }                            
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

export { Chat }

