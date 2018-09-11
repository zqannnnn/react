import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { chatActionCreators } from '../../actions'

import { RootState, ChatState } from '../../reducers'
import { User } from '../../../../src/models'
import { Row, Col, Pagination } from 'antd'
import { List, message, Avatar, Spin, Icon } from 'antd'
import { Table, Divider, Tag } from 'antd'
import i18n from 'i18next'
import './my-chats.scss'

interface ChatsProps {
    dispatch: Dispatch<RootState>
    chat: ChatState
}
interface ChatsState {
}
class Chats extends React.Component<ChatsProps, ChatsState> {
    constructor(props: ChatsProps) {
        super(props)
        this.state = this.defaultState
    }
    defaultState = {
    }
    componentWillMount() {
        this.props.dispatch(
            chatActionCreators.getAll()
        )

    }
    clickItem() {
        console.log('clickItem')
    }
    render() {
        const { chat } = this.props
        const columns = [{
            title: 'First name',
            dataIndex: 'firstName',
            key: 'firstName',
            render: (text: any, record: User) => (
                <span>
                    <Avatar size="small" icon="user" />
                    {record.firstName} {record.lastName}
                </span>
            ),
        }];


        return (
            <div className="page">
                <h2 className="header-center">{i18n.t('Chats History')}</h2>
                <Table
                    pagination={false}
                    showHeader={false}
                    onRow={(user) => {
                        return {
                            onClick: () => {
                                window.Chat.openChat(user.id, true)
                            },
                        }
                    }}
                    columns={columns}
                    dataSource={chat.users} />
            </div>
        )
    }
}

function mapStateToProps(state: RootState) {
    const { chat } = state
    return { chat }
}


const connectedList = connect(mapStateToProps)(Chats)
export { connectedList as MyChatsPage }
