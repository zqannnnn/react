//1532692062 chat
import * as React from 'react'
import i18n from 'i18next'
//import { connect, Dispatch } from 'react-redux'
import * as socketIOClient from 'socket.io-client'
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
    authInfo: any
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
            connected: false,
            authInfo: undefined
        }
        this.onUserItemClose = this.onUserItemClose.bind(this)
        this.onOpenChat = this.onOpenChat.bind(this)
        this.onOpenUserItem = this.onOpenUserItem.bind(this)
    }
    disconnect() {
        if (this.state.connected) {
            if (this.state.socket !== undefined) this.state.socket.disconnect()
            this.setState({socket: undefined, connected: false})
        }
    }    
    //TODO: strings to const
    //TODO: clarify definitions & comments
    openChat(userId: string, open = true) {
        let users = this.state.users
        if (users[userId] != undefined) {
            let panelStatus = 'collapsed'
            if (open) panelStatus = 'expended'
            users[userId]['panelStatus'] = panelStatus
            users[userId]['newMsg'] = false
            this.setState({users: users})
        } else {
            const data = { userId: userId, open: open }
            if (this.state.socket !== undefined) this.state.socket.emit("get-user", data)
        }
        this.setState({opened: true})
        if (open) this.setState({activePanel: userId})
    }    
    connect() {
        const that = this;
        //TODO change this!!!!!
		const socket = socketIOClient("http://localhost:3000")
		socket.on('connect', function () {
            let { auth } = that.props
            const { authInfo } = auth
            that.setState({socket: socket, connected: true})
			if (authInfo !== undefined) socket.emit('start-chat-session', authInfo)
			socket.on('session-started', (data: any) => {
                that.setState({authInfo: authInfo})
                socket.emit('get-unread-messages', authInfo)   
            })
            socket.on("private", function(msg: any) {    
                that.onPrivateMsg(msg)
            })
            socket.on("get-user", function(data: any) {    
                that.addUserChatItem(data.user, data.open)
            })
            socket.on("old-messages", function(data: any) {    
                let messages = that.state.messages
                let usersIds = [] as string[]
                data.messages.forEach(function (messageId: string, index: number) {
                    for (let msgKey in messages) {  
                        if ( messages[msgKey].id == messageId ) {
                            messages[msgKey].isNew = false
                            usersIds.push(messages[msgKey].from)
                        }
                    }
                })
                that.setState({ messages: messages })
                usersIds.forEach(function (userId, index) {
                    that.updateUserMsgs(userId)
                })
            })
		})
    }    
    componentWillMount() {
        this.connect()
    }
    //TODO: strings to const
    //TODO: clarify definitions & comments
    addUserChatItem(user: any, open = false) {
        let users = this.state.users
        users[user.id] = user
        let panelStatus = 'collapsed'
        if (open) panelStatus = 'expended'
        users[user.id]['panelStatus'] = panelStatus
        users[user.id]['newMsg'] = false
        users[user.id]['messages'] = {}    
        this.setState({users: users})
        this.updateUserMsgs(user.id)
    }
    //TODO: strings to const
    //TODO: clarify definitions & comments
    updateUserMsgs(userKey: string) {
        const messages = this.state.messages
        let users = this.state.users 
        users[userKey]['messages'] = {}
        let isNewMessage = false
        for (let msgKey in messages) {  
            if ( (messages[msgKey].from == userKey) || (messages[msgKey].to == userKey) ) {
                users[userKey]['messages'][msgKey] = messages[msgKey]
                if (!isNewMessage) isNewMessage = messages[msgKey].isNew
            }
        }
        if (users[userKey]['panelStatus'] == 'collapsed') users[userKey]['newMsg'] = isNewMessage
        this.setState({users: users})
    }    
	onPrivateMsg(msg: any) {
        let messages = this.state.messages
        messages[msg.id] = msg
        this.setState({ messages: messages })
        let foundUser = false
        for (let userKey in this.state.users) {  
            if ( (userKey != this.state.userKey) && ((msg.from == userKey) || (msg.to == userKey)) ) {
                foundUser = true
                this.updateUserMsgs(userKey)
            }
        }
        if (!foundUser) this.openChat(msg.from, false)
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
        if (panel != undefined && users[panel] != undefined) {
            this.setState({activePanel: panel})
            users[panel]['panelStatus'] = 'expended'
            users[panel]['newMsg'] = false
            //update all messages from user as read
            const data = { userId: users[panel].id }
            if (this.state.socket !== undefined) this.state.socket.emit("set-messages-as-old", data)
        } else {
            this.setState({activePanel: ''})
        }
        this.setState({users: users})
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
                                                        <UserItem messages={this.state.users[userKey]['messages']} userKey={userKey} socket={this.state.socket} ownerUserKey={this.state.authInfo.id} /> 
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

