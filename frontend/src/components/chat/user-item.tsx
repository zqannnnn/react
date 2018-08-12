
//1532692062 chat
import * as React from 'react'
import { StringKeyHash } from '../../../../src/interfaces'
//import * as socketIOClient from 'socket.io-client' //1532692062 chat

interface ItemProps {
    user: StringKeyHash
    userKey: string
    socket: any
    msg: any
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
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillReceiveProps(nextProps: any) {
        const msg = nextProps.msg
        if ( msg !== undefined ) {
            if ( msg.from == this.props.userKey ) {
                let messages = this.state.messages
                const timestamp = new Date().valueOf().toString()
                messages[timestamp] = msg
                this.setState({ messages: messages });    
            }
        }
    }
    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ value: event.target.value });
    }
    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const msg = { msg: this.state.value, to: this.props.userKey }
        if (this.state.socket !== undefined) this.state.socket.emit("private", msg);
        let messages = this.state.messages
        const timestamp = new Date().valueOf().toString()
        messages[timestamp] = msg
        this.setState({ messages: messages, value: '' });
    }
    render() {
        return (
            <div className='chat-container'>
                <div className='chat-log'>
                    {
                        Object.keys(this.state.messages).map((key, index) => {
                            return (
                                <p key={key}>
                                    {this.state.messages[key].msg}
                                </p>
                            )
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

