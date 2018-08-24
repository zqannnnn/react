//1532692062 chat
import * as React from 'react'
import i18n from 'i18next'
//import { connect, Dispatch } from 'react-redux'
import * as socketIOClient from 'socket.io-client' //1532692062 chat
import { AuthState } from '../../reducers'
import { UserItem } from './user-item'
import { PanelHead } from './panel-header'
import { HashOfStringKeyHash, StringKeyHash } from '../../../../src/interfaces'

//https://ant.design/components/collapse/
//https://github.com/ant-design/ant-design/blob/master/components/collapse/demo/accordion.md
import { Collapse } from 'antd'
import './chat.scss'
declare global {
    interface Window { Chat: any; }
}
interface ItemProps {
    auth: AuthState
}
interface ItemState {
    users: HashOfStringKeyHash
    //socket: SocketIOClient.Socket
    socket: any
    userKey: string
    messages: StringKeyHash
    newMsg: boolean
    opened: boolean
    activePanel: string
    connected: boolean
}
class Chat extends React.Component<ItemProps, ItemState> {
	constructor(props: ItemProps) {
		super(props)
		//this.state = {
		//  endpoint: "http://localhost:3000" // this is where we are connecting to with sockets
        //}
        this.state = {
            users: {},
            socket: undefined,
            messages: {},
            userKey: '',
            newMsg: false,
            opened: false,
            activePanel: '',
            connected: false
        }
        this.onUserItemClose = this.onUserItemClose.bind(this)
        this.onOpenChat = this.onOpenChat.bind(this)
        this.onOpenUserItem = this.onOpenUserItem.bind(this)
        this.onSendMsg = this.onSendMsg.bind(this)
    }
    disconnect() {
        if (this.state.connected) {
            if (this.state.socket !== undefined) this.state.socket.disconnect()
            this.setState({socket: undefined, connected: false})
        }
    }    
    openChat(userId: string) {
        let users = this.state.users
        if (users[userId] != undefined) {
            this.setState({opened: true})
            this.setState({activePanel: userId})
            users[userId]['panelStatus'] = 'expended'
            users[userId]['newMsg'] = false
        } else {
            const data = { userId: userId }
            if (this.state.socket !== undefined) this.state.socket.emit("get-user", data)
        }
        this.setState({users: users})
    }    
    connect() {
        const that = this;
		const socket = socketIOClient("http://localhost:3000")
		socket.on('connect', function () {
            let { auth } = that.props
            const { authInfo } = auth
            that.setState({socket: socket, connected: true})
			if (authInfo !== undefined) socket.emit('start-chat-session', authInfo)
			socket.on('session-started', (data: any) => {
                socket.emit('get-unread-messages', authInfo)                
            })
            socket.on("private", function(msg: any) {    
                that.onPrivateMsg(msg)
            })
            socket.on("get-user", function(data: any) {    
                let users = that.state.users
                const user = data.user
                users[user.id] = user
                users[user.id]['panelStatus'] = 'expended'
                users[user.id]['newMsg'] = false
                users[user.id]['messages'] = {}    
                that.setState({users: users, opened: true, activePanel: user.id})
                that.updateUserMsgs(user.id)
            })
		});
    }    
    componentWillMount() {
        this.connect()
    }
    updateUserMsgs(userKey: string) {
        const messages = this.state.messages
        let users = this.state.users 
        users[userKey]['messages'] = {}
        for (let msgKey in messages) {  
            if ( (messages[msgKey].from == userKey) || (messages[msgKey].to == userKey) ) users[userKey]['messages'][msgKey] = messages[msgKey]
        }
        if (users[userKey]['panelStatus'] == 'collapsed') users[userKey]['newMsg'] = true
        this.setState({users: users})
    }    
	onPrivateMsg(msg: any) {
        const that = this;
        let messages = that.state.messages
        const timestamp = new Date().getTime().toString()
        messages[timestamp] = msg
        that.setState({ messages: messages }); 
        let foundUser = false
        for (let userKey in that.state.users) {  
            if ( (userKey != that.state.userKey) && ((msg.from == userKey) || (msg.to == userKey)) ) {
                foundUser = true
                this.updateUserMsgs(userKey)
            }
        }
        if (!foundUser) this.openChat(msg.from)
    }
	onUserItemClose(userKey: any) {
        let users = this.state.users
        for (let userId in users) {  
            if ( userKey == userId ) delete users[userKey]
        }
        this.setState({users: users})
    }
	onOpenChat(panel: any) {
        if (panel != undefined) {
            this.setState({opened: true})
            this.setState({newMsg: false})
        } else {
            this.setState({opened: false})
        }
    }
	onOpenUserItem(panel: any) {
        let users = this.state.users
        for (let userKey in users) {  
            users[userKey]['panelStatus'] = 'collapsed'
        }
        if (panel != undefined) {
            this.setState({activePanel: panel})
            users[panel]['panelStatus'] = 'expended'
            users[panel]['newMsg'] = false
            //update all messages from user as read
            const data = { userId: users[panel].id }
            if (this.state.socket !== undefined) this.state.socket.emit("ununread-messages", data)
        } else {
            this.setState({activePanel: ''})
        }
        this.setState({users: users})
    }
	onSendMsg(msg: any) {
        this.onPrivateMsg(msg)
    }
	render() {
        let users = this.state.users   
        let chatCssClass = ''
        for (let userKey in users) {  
            if (users[userKey]['newMsg']) chatCssClass = 'new-msg'
        }
		let { auth } = this.props
		const { loggedIn, authInfo } = auth
        const Panel = Collapse.Panel        
        let chat: JSX.Element
        let chatActiveKey = ''
        if (this.state.opened) chatActiveKey = 'chat'
        const that = this
        if (loggedIn) {
			chat = (
				<>
					<div id="chat">
						<Collapse activeKey={chatActiveKey} accordion onChange={this.onOpenChat}>
                            <Panel className={chatCssClass} header={<PanelHead onUserItemClose='' user={{}} userKey='none' text={i18n.t('Chat')} showClose={false} />} key='chat'> 
                                <Collapse activeKey={this.state.activePanel} accordion onChange={that.onOpenUserItem}>
                                    {
                                        Object.keys(this.state.users).map((userKey, index) => {
                                            if (this.state.userKey != userKey) {
                                                let cssClass = ''
                                                if (this.state.users[userKey]['newMsg']) cssClass = 'new-msg'
                                                return (
                                                    <Panel className={cssClass} header={<PanelHead onUserItemClose={this.onUserItemClose} user={this.state.users[userKey]} userKey={userKey} text='' showClose={true} />} key={userKey}> 
                                                        <UserItem messages={this.state.users[userKey]['messages']} userKey={userKey} socket={this.state.socket} onSendMsg={this.onSendMsg} /> 
                                                    </Panel>
                                                )    
                                            }
                                        })
                                    }                            
                                </Collapse>
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

export { Chat }

