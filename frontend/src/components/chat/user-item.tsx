//1532692062 chat
import * as React from 'react'
import { StringKeyHash } from '../../../../src/interfaces'
//import * as socketIOClient from 'socket.io-client' //1532692062 chat

interface ItemProps {
    user: StringKeyHash
    userKey: string
    socket: any
    messages: StringKeyHash    
    onSendMsg: any
}
interface ItemState {
    value: string
    messages: StringKeyHash
    //socket: SocketIOClient.Socket
    socket: any
}
class UserItem extends React.Component<ItemProps, ItemState> {
    constructor(props: ItemProps) {
        super(props)
        this.state = {
            value: '',
            messages: {},
            socket: this.props.socket
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }    
    renderMsgs(props: any) {
        let relatedMsgs:StringKeyHash = {}
        let messages = this.state.messages
        Object.keys(props.user.messages).map((key, index) => {
            if ( messages[key] == undefined ) relatedMsgs[key] = props.user.messages[key]
        })       
        messages = Object.assign(messages, relatedMsgs);
        let msgsKeys = []
        for (let k in messages) {
            if (messages.hasOwnProperty(k)) {
                msgsKeys.push(k);
            }
        }        
        msgsKeys.sort()
        const len = msgsKeys.length
        let orderededMessages:StringKeyHash = {}
        for (let i = 0; i < len; i++) {
            let msgKey = msgsKeys[i]
            orderededMessages[msgKey] = messages[msgKey]
        }
        this.setState({ messages: orderededMessages });  
    }
    componentDidMount() {
        this.renderMsgs(this.props)
    }
    componentWillReceiveProps(nextProps: any) {
        console.log('componentWillReceiveProps ')
        console.log(nextProps)
        this.renderMsgs(nextProps)
        /*
        let relatedMsgs:StringKeyHash = {}
        let messages = this.state.messages
        Object.keys(nextProps.user.messages).map((key, index) => {
            if ( messages[key] == undefined ) relatedMsgs[key] = nextProps.user.messages[key]
        })       
        messages = Object.assign(messages, relatedMsgs);
        let msgsKeys = []
        for (let k in messages) {
            if (messages.hasOwnProperty(k)) {
                msgsKeys.push(k);
            }
        }        
        msgsKeys.sort()
        const len = msgsKeys.length
        let orderededMessages:StringKeyHash = {}
        for (let i = 0; i < len; i++) {
            let msgKey = msgsKeys[i]
            orderededMessages[msgKey] = messages[msgKey]
        }
        this.setState({ messages: orderededMessages });  
        */
    }
    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ value: event.target.value });
    }
    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const msg = { msg: this.state.value, to: this.props.userKey }
        if (this.state.socket !== undefined) this.state.socket.emit("private", msg);
        this.setState({value: '' });
        this.props.onSendMsg(msg)
    }
    render() {
        return (
            <div className='chat-container'>
                <div className='chat-log'>
                    {
                        Object.keys(this.state.messages).map((key, index) => {
                            if ( (this.state.messages[key].from == this.props.userKey) || (this.state.messages[key].to == this.props.userKey) ) {
                                let cssClass = (this.state.messages[key].from == this.props.userKey) ? 'incoming' : 'outcoming'
                                return (
                                    <p key={key} className={cssClass} >
                                        {this.state.messages[key].msg}
                                    </p>
                                )
                            }
                        })
                    }
                </div>
                <div className='chat-input'>
                    <form onSubmit={this.handleSubmit}>
                        <textarea value={this.state.value} onChange={this.handleChange} />
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        )
    }
}

export { UserItem }

