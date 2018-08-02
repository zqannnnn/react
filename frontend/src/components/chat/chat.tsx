//1532692062 chat
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import * as socketIOClient from 'socket.io-client' //1532692062 chat
import { AuthState } from '../../reducers'
//https://ant.design/components/collapse/
//https://github.com/ant-design/ant-design/blob/master/components/collapse/demo/accordion.md
import { Collapse } from 'antd'
import './chat.scss'
interface ItemProps {
	auth: AuthState
}
class Chat extends React.Component<ItemProps> {
	constructor(props: ItemProps) {
		super(props)
		//this.state = {
		//  endpoint: "http://localhost:3000" // this is where we are connecting to with sockets
		//}
	}
	render() {
		let { auth } = this.props
		const { loggedIn, authInfo } = auth

		const socket = socketIOClient("http://localhost:3000")
		socket.on('connect', function () {
			if (authInfo !== undefined) socket.emit('get-users', authInfo)
			socket.on('get-users', (users: any) => {
				//console.log(users)
			})
		});

		const Panel = Collapse.Panel
		let chat: JSX.Element
		if (loggedIn) {
			chat = (
				<>
					<div id="chat">
						<Collapse accordion>
							<Panel header="Chat" key="1">
								<p>Hoi</p>
							</Panel>
						</Collapse>
					</div>
				</>
			)
		} else {
			chat = (
				<>
					<div id="chat">
					</div>
				</>
			)
		}
		return chat
	}
}

export { Chat }

