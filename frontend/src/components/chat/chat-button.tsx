//1532692062 chat
import * as React from 'react'
import i18n from 'i18next'
import { Button } from 'antd'
import { User } from '../../models'
import './chat.scss'
interface ItemProps {
    user: User
}
interface ItemState {
}

class ChatButton extends React.Component<ItemProps, ItemState> {
    constructor(props: ItemProps) {
        super(props)
        this.state = {}
    }
    openChat = () => {
        window.Chat.openChat(this.props.user.id, true)
    }
    render() {
        return (
            <Button
                className="openChat"
                type="primary"
                style={{ marginBottom: 12 }}
                onClick={this.openChat}
            >
                {i18n.t('Open Chat')}
            </Button>
        )
    }
}

export { ChatButton }

