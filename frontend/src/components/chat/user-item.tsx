
//1532692062 chat

//https://ant.design/components/collapse/
//https://github.com/ant-design/ant-design/blob/master/components/collapse/demo/accordion.md
import { Collapse } from 'antd'

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
        let chatItem: JSX.Element
		const Panel = Collapse.Panel
        chatItem = (
            <>
                <Panel header={this.props.user.name} key={this.props.key}>
                    <h2>{this.props.user.name}</h2>
                </Panel>
            </>
        )
		return chatItem
	}
}

export { UserItem }

