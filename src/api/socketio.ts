import * as socket from 'socket.io' //1532692062 chat
import { AuthInfo } from '../../frontend/src/actions'
import { StringKeyHash, HashOfStringKeyHash } from '../interfaces'
import { Message } from '../models/'
//https://socket.io/get-started/chat/
//https://codeburst.io/isomorphic-web-app-react-js-express-socket-io-e2f03a469cd3
const startSocket = async (server: any) => {
	const io = socket(server)
	let users: HashOfStringKeyHash = {}
	io.on('connection', socket => {
        socket.on("private", function(data) {     
            if ( users[socket.id] != undefined && users[data.to] != undefined ) {
                const privateMsg = { from: socket.id, to: data.to, msg: data.msg }
                io.to(`${data.to}`).emit('private', privateMsg );
                const from = users[socket.id]['id']
                const to = users[data.to]['id']
                const message = new Message({
                    from: from,
                    to: to,
                    message: data.msg
                })
                message.save()    
            }      
        });
		socket.on('get-users', (authInfo: AuthInfo) => {
			let keyForRemove = null
			for (var key in users) {
				if ( users[key]['id'] == authInfo.id ) {
					let aInfo: StringKeyHash = {};
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
				let aInfo: StringKeyHash = {};
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