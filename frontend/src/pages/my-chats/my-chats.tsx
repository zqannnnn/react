//1532692062 chat
import * as React from 'react'
import { User } from '../../../../src/models'
import { Table, Avatar, Spin, message } from 'antd'
import i18n from 'i18next'
import './my-chats.scss'
import { chatService } from '../../services'


interface ChatsProps {
}
interface ChatsState {
    users: Array<User>
    loading: boolean
}
class Chats extends React.Component<ChatsProps, ChatsState> {
    constructor(props: ChatsProps) {
        super(props)
        this.state = {
            users: [],
            loading: true
        }
    }
    componentWillMount() {
        chatService.getAll().then(
            (result: { users: Array<User>, ids: Array<string> }) => {
                this.setState({ users: result.users, loading: false })
            },
            (error: string) => {
                this.setState({ loading: false })
                message.error(i18n.t('Something wrong. Can\'t get chat history.'))
            }
        )
    }
    render() {
        const columns = [
            {
                title: 'avatar',
                dataIndex: 'avatar',
                width: 60,
                render: (text: any, record: User) => (
                    <span>
                        <Avatar size="small" icon="user" />
                    </span>
                ),
            },
            {
                title: 'First name',
                dataIndex: 'firstName',
                key: 'firstName',
                render: (text: any, record: User) => (
                    <span>
                        {record.firstName} {record.lastName}
                    </span>
                ),
            }
        ];
        return (
            <div className="page">
                <h2 className="header-center">{i18n.t('Chats History')}</h2>
                <Spin spinning={this.state.loading}>
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
                        dataSource={this.state.users} />
                </Spin>
            </div>
        )
    }
}
export { Chats as MyChatsPage }
