//1532692062 chat
import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { StringKeyHash } from '../../../../src/interfaces'

interface ItemProps {
    user: StringKeyHash
    userKey: string
    onUserItemClose: any
}
class PanelHead extends React.Component<ItemProps> {
    constructor(props: ItemProps) {
        super(props)
        this.state = {
        }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(event: React.FormEvent<HTMLDivElement>) {
        event.preventDefault()
        event.stopPropagation()
        this.props.onUserItemClose(this.props.userKey)
    }   
    render() {
        return (
            <label className='user-header'>
                {this.props.user.name}
                <div  onClick={this.handleClick}>
                    <FontAwesomeIcon icon="times" />
                </div>
            </label>
        )
    }
}

export { PanelHead }

