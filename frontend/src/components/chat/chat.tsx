//1532692062 chat
import * as React from 'react'
import i18n from 'i18next'
//import { connect, Dispatch } from 'react-redux'
//import * as socketIOClient from 'socket.io-client'
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
    active: boolean
}
class Chat extends React.Component<ItemProps, ItemState> {
    constructor(props: ItemProps) {
        super(props)
        let userId = ''
        if (this.props.auth != undefined && this.props.auth.authInfo != undefined && this.props.auth.authInfo.id != undefined) userId = this.props.auth.authInfo.id
        this.state = {
            users: {},
            socket: undefined,
            messages: {},
            userKey: userId,
            newMsg: false,
            opened: false,
            activePanel: '',
            connected: false,
            authInfo: undefined,
            active: false
        }
        this.onChatClose = this.onChatClose.bind(this)
        this.onUserItemClose = this.onUserItemClose.bind(this)
        this.onOpenChat = this.onOpenChat.bind(this)
        this.onOpenUserItem = this.onOpenUserItem.bind(this)
    }
    disconnect() {
        if (this.state.connected) {
            if (this.state.socket !== undefined) this.state.socket.disconnect()
            this.setState({ socket: undefined, connected: false })
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
            this.setState({ users: users })
        } else {
            const data = { userId: userId, open: open }
            if (this.state.socket !== undefined) this.state.socket.emit("get-user", data)
        }
        this.setState({ opened: true, active: true })
        if (open) this.setState({ activePanel: userId })
    }
    connect() {
        const that = this;
        const socket = socketIOClient.connect(window.location.origin)
        socket.on('connect', function () {
            let { auth } = that.props
            const { authInfo } = auth
            that.setState({ socket: socket, connected: true })
            if (authInfo !== undefined) socket.emit('start-chat-session', authInfo)
            socket.on('session-started', (data: any) => {
                that.setState({ authInfo: authInfo })
                socket.emit('get-unread-messages', authInfo)
            })
            socket.on("private", function (msg: any) {
                that.onPrivateMsg(msg)
            })
            socket.on("private-batch", function (msgs: any[]) {
                that.onPrivateMsgsBatch(msgs)
            })
            socket.on("get-user", function (data: any) {
                that.addUserChatItem(data.user, data.open)
            })
            socket.on("old-messages", function (data: any) {
                let messages = that.state.messages
                let usersIds = [] as string[]
                data.messages.forEach(function (messageId: string, index: number) {
                    for (let msgKey in messages) {
                        if (messages[msgKey].id == messageId) {
                            //messages[msgKey].isNew = false
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
    componentWillUpdate() {
        // if got new msg but chat window is closed then open chat window
        if (!this.state.active) {
            for (let userKey in this.state.users) {
                if (this.state.users[userKey]['newMsg']) this.setState({ active: true, opened: false })
            }
        }
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
        this.setState({ users: users })
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
            if ((messages[msgKey].from == userKey) || (messages[msgKey].to == userKey)) {
                users[userKey]['messages'][msgKey] = messages[msgKey]
                if (!isNewMessage) isNewMessage = messages[msgKey].isNew
            }
        }
        if (users[userKey]['panelStatus'] == 'collapsed') users[userKey]['newMsg'] = isNewMessage
        this.setState({ users: users })
    }
    onPrivateMsg(msg: any) {
        let messages = this.state.messages
        messages[msg.id] = msg
        this.setState({ messages: messages })
        let foundUser = false
        for (let userKey in this.state.users) {
            if ((userKey != this.state.userKey) && ((msg.from == userKey) || (msg.to == userKey))) {
                foundUser = true
                this.updateUserMsgs(userKey)
            }
        }
        if (!foundUser) this.openChat(msg.from, false)
    }
    onPrivateMsgsBatch(msgs: any[]) {
        if (msgs.length == 0) return
        let messages = this.state.messages
        msgs.map(function (msg, index) {
            messages[msg.id] = msg
        })
        this.setState({ messages: messages })
        let foundUser = false
        for (let userKey in this.state.users) {
            if ((userKey != this.state.userKey) && ((msgs[0].from == userKey) || (msgs[0].to == userKey))) {
                foundUser = true
                this.updateUserMsgs(userKey)
            }
        }
        if (!foundUser && msgs.length > 0) this.openChat(msgs[0].from, false)
    }
    onUserItemClose(userKey: any) {
        let users = this.state.users
        for (let userId in users) {
            if (userKey == userId) delete users[userKey]
        }
        this.setState({ users: users })
    }
    onChatClose(key: any) {
        this.setState({ active: false, opened: false })
    }
    onOpenChat(panel: any) {
        if (panel != undefined) {
            this.setState({ opened: true })
            this.setState({ newMsg: false })
        } else {
            this.setState({ opened: false })
        }
    }
    onOpenUserItem(panel: any) {
        let users = this.state.users
        for (let userKey in users) {
            users[userKey]['panelStatus'] = 'collapsed'
        }
        if (panel != undefined && users[panel] != undefined) {
            this.setState({ activePanel: panel })
            users[panel]['panelStatus'] = 'expended'
            users[panel]['newMsg'] = false
        } else {
            this.setState({ activePanel: '' })
        }
        this.setState({ users: users })
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
        if (loggedIn && this.state.active) {
            chat = (
                <>
                    <div id="chat">
                        <Collapse activeKey={chatActiveKey} accordion onChange={this.onOpenChat}>
                            <Panel className={chatCssClass} header={<PanelHead onUserItemClose={this.onChatClose} user={{}} userKey='none' text={i18n.t('Chat')} showClose={true} />} key='chat'>
                                <Collapse activeKey={this.state.activePanel} accordion onChange={that.onOpenUserItem}>
                                    {
                                        Object.keys(users).map((userKey, index) => {
                                            if (this.state.userKey != userKey) {
                                                let cssClass = ''
                                                if (users[userKey]['newMsg']) cssClass = 'new-msg'
                                                return (
                                                    <Panel className={cssClass} header={<PanelHead onUserItemClose={this.onUserItemClose} user={users[userKey]} userKey={userKey} text='' showClose={true} />} key={userKey}>
                                                        <UserItem messages={users[userKey]['messages']} userKey={userKey} socket={this.state.socket} ownerUserKey={this.state.userKey} />
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

