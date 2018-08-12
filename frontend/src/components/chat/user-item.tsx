//1532692062 chat
import * as React from 'react'
import { StringKeyHash } from '../../../../src/interfaces'

interface ItemProps {
    user: StringKeyHash
}
class UserItem extends React.Component<ItemProps> {
	constructor(props: ItemProps) {
		super(props)
        this.state = {
        }
	}
	render() {
        let chatItem: JSX.Element
        chatItem = (
            <>
                <h2>{this.props.user.name}</h2>
            </>
        )
		return chatItem
	}
}

export { UserItem }

