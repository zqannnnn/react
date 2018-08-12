//1532692062 chat
import * as React from 'react'
import { SHash } from '../../actions'
interface ItemProps {
    user: SHash
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

