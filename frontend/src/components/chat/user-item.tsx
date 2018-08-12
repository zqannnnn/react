
//1532692062 chat
import * as React from 'react'
import { StringKeyHash } from '../../../../src/interfaces'

interface ItemProps {
    user: StringKeyHash
    key: string
}
class UserItem extends React.Component<ItemProps> {
	constructor(props: ItemProps) {
		super(props)
        this.state = {
        }
	}
	render() {
        return (
            <p>{this.props.user.name}</p>
        )
        
	}
}

export { UserItem }

