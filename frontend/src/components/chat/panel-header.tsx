//1532692062 chat
import * as React from 'react'
import { StringKeyHash } from '../../../../src/interfaces'
import { Icon } from 'antd'

interface ItemProps {
    user: StringKeyHash
    userKey: string
    onUserItemClose: any
    text: string
    showClose: boolean
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
        let closeBtn;
        
        if (this.props.showClose) closeBtn = <div  onClick={this.handleClick}><Icon type="close" /></div>
        let title = this.props.text != '' ? this.props.text : this.props.user.name
        return (
            <label className='user-header'>
                {title}
                {closeBtn}
            </label>
        )
    }
}

export { PanelHead }

