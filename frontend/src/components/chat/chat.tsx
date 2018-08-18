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
            activePanel: ''
        }
        this.onUserItemClose = this.onUserItemClose.bind(this)
        this.onOpenChat = this.onOpenChat.bind(this)
        this.onOpenUserItem = this.onOpenUserItem.bind(this)
        this.onSendMsg = this.onSendMsg.bind(this)
    }
    openChat(id: string) {
        let users = this.state.users
        for (let userKey in users) {  
            if (users[userKey].id == id) {
                this.setState({opened: true})
                this.setState({activePanel: userKey})
                users[userKey]['panelStatus'] = 'expended'
                users[userKey]['status'] = 'inlist'
                users[userKey]['newMsg'] = false
            }
        }
        this.setState({users: users})
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
                    if (users[key]['messages'] == undefined) users[key]['messages'] = {}
                    if (users[key]['panelStatus'] == undefined) users[key]['panelStatus'] = 'collapsed'
                    if (users[key]['status'] == undefined) users[key]['status'] = 'inlist'
                    if (users[key]['newMsg'] == undefined) users[key]['newMsg'] = false
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
                that.onPrivateMsg(msg)
            })
		});
    }
    updateUserMsgs(userKey: string) {
        const messages = this.state.messages
        let users = this.state.users 
        users[userKey]['messages'] = {}
        for (let msgKey in messages) {  
            if ( (messages[msgKey].from == userKey) || (messages[msgKey].to == userKey) ) users[userKey]['messages'][msgKey] = messages[msgKey]
        }
        if (users[userKey]['panelStatus'] == 'collapsed' || users[userKey]['status'] == 'notInList') {
            users[userKey]['status'] = 'inList'
            users[userKey]['newMsg'] = true
        }
        this.setState({users: users})
    }    
	onPrivateMsg(msg: any) {
        const that = this;
        let messages = that.state.messages
        const timestamp = new Date().getTime().toString()
        messages[timestamp] = msg
        that.setState({ messages: messages }); 
        for (let userKey in that.state.users) {  
            if ( (userKey != that.state.userKey) && ((msg.from == userKey) || (msg.to == userKey)) ) this.updateUserMsgs(userKey)
        }
    }
	onUserItemClose(userKey: any) {
        let users = this.state.users
        users[userKey]['status'] = 'notInList'
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
                                            Object.keys(this.state.users).map((key, index) => {
                                                if (this.state.userKey != key && this.state.users[key]['status'] != 'notInList') {
                                                    let cssClass = ''
                                                    if (this.state.users[key]['newMsg']) cssClass = 'new-msg'
                                                    return (
                                                        <Panel className={cssClass} header={<PanelHead onUserItemClose={this.onUserItemClose} user={this.state.users[key]} userKey={key} text='' showClose={true} />} key={key}> 
                                                            <UserItem user={this.state.users[key]} userKey={key} socket={this.state.socket} onSendMsg={this.onSendMsg} /> 
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

