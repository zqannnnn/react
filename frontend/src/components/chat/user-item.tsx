//1532692062 chat
import * as React from 'react'
import { StringKeyHash } from '../../../../src/interfaces'
import { Form, Input, Button, Spin } from 'antd'
const moment = require('moment')

interface ItemProps {
    messages: StringKeyHash
    userKey: string
    socket: any
    ownerUserKey: string
}
interface ItemState {
    value: string
    messages: StringKeyHash
    msgs: StringKeyHash[]
    loading: boolean
    loadingTimer: any
}
class UserItem extends React.Component<ItemProps, ItemState> {
    private chatBottom: React.RefObject<HTMLDivElement>;
    private msgsList: React.RefObject<HTMLDivElement>;
    constructor(props: ItemProps) {
        super(props)
        this.state = {
            value: '',
            messages: {},
            msgs: [],
            loading: false,
            loadingTimer: undefined
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.chatBottom = React.createRef();
        this.msgsList = React.createRef();
    }    
    renderMsgs(props: any) {
        if (props.messages !== undefined) {
            let relatedMsgs:StringKeyHash = {}
            let messages = this.state.messages
            let isNewMessage = false
            Object.keys(props.messages).map((key, index) => {
                if ( messages[key] == undefined ) {
                    relatedMsgs[key] = props.messages[key]
                    if (!isNewMessage && props.messages[key].from == props.userKey ) isNewMessage = props.messages[key].isNew                
                }
            })       
            messages = Object.assign(messages, relatedMsgs)
            let msgsTimes = []
            for (let k in messages) {
                if (messages.hasOwnProperty(k)) {
                    msgsTimes.push(messages[k].createdAt)
                }
            }        
            msgsTimes.sort()
            const len = msgsTimes.length
            let msgs: StringKeyHash[] = []
            let orderededMessages:StringKeyHash = {}
            for (let i = 0; i < len; i++) {
                let createdAt = msgsTimes[i]
                for (let k in messages) {
                    if (messages.hasOwnProperty(k)) {
                        if ( messages[k].createdAt == createdAt ) {
                            orderededMessages[k] = messages[k]
                            msgs.push(messages[k])
                        }
                    }
                }        
            }
            this.setState({ messages: orderededMessages })
            this.setState({ msgs: msgs })
            this.unsetLoading()
            if ( isNewMessage ) {
                //update all messages from user as read
                const data = { userId: this.props.userKey}
                if (this.props.socket !== undefined) this.props.socket.emit("set-messages-as-old", data)
            }
        }
    }
    scrollBottom() {
        //TODO in componentWillUnmount cancel this timeout
        const that = this    
        setTimeout(() => { 
            if ( that.chatBottom.current != null ) that.chatBottom.current.scrollIntoView({ behavior: "smooth" })            
        }, 300)
    }
    componentDidMount() {
        this.renderMsgs(this.props)
        this.setLoading()
        const data = { from: this.props.ownerUserKey, to: this.props.userKey }
        this.props.socket.emit('get-previous-messages', data)                
    }
    componentDidUpdate(prevProps: any, prevState: any) {
        if (Object.keys(prevProps.messages).length == 0 && Object.keys(this.props.messages).length > 0)  {
            this.scrollBottom()
        } else if (Object.keys(prevProps.messages).length != Object.keys(this.props.messages).length) {
            let scrollBottom = false
            for (let msgId in this.props.messages) {  
                let found = false
                for (let prevMsgId in prevProps.messages) {  
                    if (msgId == prevMsgId) found = true
                }     
                if (!found && this.props.messages[msgId].isNew) scrollBottom = true
            }
            if (scrollBottom) {
                this.scrollBottom()
            } else {
                if (this.msgsList.current != null && this.msgsList.current.scrollTop == 0) this.msgsList.current.scrollTop = 20  
            }
        } else {
            if (this.state.msgs.length > 0 && this.state.msgs[this.state.msgs.length-1].isNew) {
                this.scrollBottom()
                let msgs = this.state.msgs
                msgs[msgs.length-1].isNew = false
                this.setState({ msgs: msgs })
            }
        }
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
        if (this.state.value.trim().length > 0) {
            const msg = { msg: this.state.value, to: this.props.userKey }
            if (this.props.socket !== undefined) this.props.socket.emit("private", msg)
        }
        this.setState({value: '' })
    }
    listenScrollEvent(e:any) {
        if (e.target.scrollTop == 0) {
            this.setLoading()
            const data = { from: this.props.ownerUserKey, to: this.props.userKey, createdAt: this.state.msgs[0].createdAt }
            this.props.socket.emit('get-previous-messages', data)                    
        }
    }    
    setLoading() {
        const that = this
        this.setState({loading: true})
        const timerId = setTimeout(() => {
            that.unsetLoading()
        }, 2000)        
        this.setState({loadingTimer: timerId})
    }
    unsetLoading() {
        if (this.state.loading) {
            clearTimeout(this.state.loadingTimer)
            this.setState({loading: false, loadingTimer: undefined})
        }
    }
    render() {
        const { TextArea } = Input
        const FormItem = Form.Item
        const that = this
        return (
            <div className='chat-container'>
                <Spin spinning={this.state.loading}>
                    <div className='chat-log' onScroll={this.listenScrollEvent.bind(this)} ref={this.msgsList} >
                        {
                            this.state.msgs.map(function(msg, index){
                                if ( (msg.from == that.props.userKey) || (msg.to == that.props.userKey) ) {
                                    let cssClass = (msg.from == that.props.userKey) ? 'incoming' : 'outcoming'
                                    const d = new Date(msg.createdAt.replace(' ', 'T'))
                                    return (
                                        <div ref={msg.id} key={msg.id} className={cssClass} >
                                            {moment(d).format('YYYY/MM/DD HH:mm')}
                                            <div>
                                                {msg.msg}
                                            </div>
                                        </div>
                                    )
                                }
                            })            
                        }
                        <div ref={this.chatBottom}></div>
                    </div>
                    <div className='chat-input'>
                        <Form onSubmit={this.handleSubmit} >
                            <FormItem>
                                <TextArea rows={2} value={this.state.value} onChange={this.handleChange} onKeyUp={this.handleKeyUp}/>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </Spin>
            </div>
        )
    }
}

export { UserItem }

