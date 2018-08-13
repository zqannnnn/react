//1532692062 chat
import * as React from 'react'
import { StringKeyHash } from '../../../../src/interfaces'
//import * as socketIOClient from 'socket.io-client' //1532692062 chat

interface ItemProps {
    user: StringKeyHash
    userKey: string
}
class PanelHead extends React.Component<ItemProps> {
    constructor(props: ItemProps) {
        super(props)
        this.state = {
        }
        //this.handleChange = this.handleChange.bind(this)
        //this.handleSubmit = this.handleSubmit.bind(this)
    }
    /*
    componentWillReceiveProps(nextProps: any) {
        if ( nextProps.messages !== undefined ) {
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
    */
    render() {
        return (
            <label className='user-header'>
                {this.props.user.name}
            </label>
        )

    }
}

export { PanelHead }

