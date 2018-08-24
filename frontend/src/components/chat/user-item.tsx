//1532692062 chat
import * as React from 'react'
import { StringKeyHash } from '../../../../src/interfaces'

interface ItemProps {
    messages: StringKeyHash
    userKey: string
    socket: any
    onSendMsg: any
}
interface ItemState {
    value: string
    messages: StringKeyHash
}
class UserItem extends React.Component<ItemProps, ItemState> {
    private chatBottom: React.RefObject<HTMLDivElement>;
    constructor(props: ItemProps) {
        super(props)
        this.state = {
            value: '',
            messages: {},
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.chatBottom = React.createRef();
    }    
    renderMsgs(props: any) {
        if (props.messages !== undefined) {
            let relatedMsgs:StringKeyHash = {}
            let messages = this.state.messages
            let isNewMessage = false
            Object.keys(props.messages).map((key, index) => {
                if ( messages[key] == undefined ) {
                    relatedMsgs[key] = props.messages[key]
                    if (!isNewMessage) isNewMessage = props.messages[key].isNew                    
                }
            })       
            messages = Object.assign(messages, relatedMsgs)
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
            this.setState({ messages: orderededMessages })

            if ( isNewMessage ) {
                //update all messages from user as read
                const data = { userId: this.props.userKey}
                if (this.props.socket !== undefined) this.props.socket.emit("set-messages-as-old", data)
            }
        }
    }
    scrollBottom() {
        const that = this    
        //if we do scroll without timeout, then on opening user chat item it jumping
        //and make not nice user experience
        setTimeout(() => { 
            if ( that.chatBottom.current != null ) that.chatBottom.current.scrollIntoView({ behavior: "smooth" })
        }, 300)
    }
    componentDidMount() {
        this.renderMsgs(this.props)
        this.scrollBottom()
    }
    componentDidUpdate() {
        this.scrollBottom()
    }
    componentWillReceiveProps(nextProps: any) {
        this.renderMsgs(nextProps)
    }
    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ value: event.target.value });
    }
    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        this.submit()
    }
    handleKeyUp(event: any) {
        if (event.keyCode == 13) this.submit()
    }
    submit() {
        if (this.state.value.length > 0) {
            const msg = { msg: this.state.value, to: this.props.userKey }
            if (this.props.socket !== undefined) this.props.socket.emit("private", msg);
            this.setState({value: '' })
            this.props.onSendMsg(msg)    
        }
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
                    <div ref={this.chatBottom}></div>
                </div>
                <div className='chat-input'>
                    <form onSubmit={this.handleSubmit}>
                        <textarea value={this.state.value} onChange={this.handleChange} onKeyUp={this.handleKeyUp} />
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        )
    }
}

export { UserItem }

