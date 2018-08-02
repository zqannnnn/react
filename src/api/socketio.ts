import * as socket from 'socket.io' //1532692062 chat
import { AuthInfo } from '../../frontend/src/actions'
//https://socket.io/get-started/chat/
//https://codeburst.io/isomorphic-web-app-react-js-express-socket-io-e2f03a469cd3
interface SHash {
	[details: string]: any;
}
interface IHash {
	[details: string]: SHash;
}
const startSocket = async (server: any) => {
	const io = socket(server)
	let users: IHash = {};
	io.sockets.on('connection', function (socket) {
	})
	io.on('connection', socket => {
		socket.on('get-users', (authInfo: AuthInfo) => {
			/*
			io.sockets.clients((error :any, clients :any) => {
			  console.log('clients')
			  console.log(clients)
			});    
			*/
			let keyForRemove = null
			for (var key in users) {
				if ( users[key]['id'] == authInfo.id ) {
					let aInfo: SHash = {};
					aInfo['id'] = authInfo.id
					let name = users[key]['name']
					if ( name == 'undefined undefined' ) name = authInfo.name					
					aInfo['name'] = name
					aInfo['ts'] = Date.now()
					keyForRemove = key
					users[socket.id] = aInfo
				}
			}
			if ( keyForRemove == null) {
				let aInfo: SHash = {};
				aInfo['id'] = authInfo.id
				aInfo['name'] = authInfo.name
				aInfo['ts'] = Date.now()
				users[socket.id] = aInfo	
			} else {
				delete users[keyForRemove]
			}
			io.sockets.emit('get-users', users)
		})
		socket.on('disconnect', () => {
			delete users[socket.id]
		})
	})
}

export { startSocket }