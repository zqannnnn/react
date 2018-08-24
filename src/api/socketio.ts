import * as socket from 'socket.io' //1532692062 chat
import { AuthInfo } from '../../frontend/src/actions'
import { StringKeyHash, HashOfStringKeyHash } from '../interfaces'
import { Message, User } from '../models/'
//https://socket.io/get-started/chat/
//https://codeburst.io/isomorphic-web-app-react-js-express-socket-io-e2f03a469cd3
const startSocket = async (server: any) => {
	const io = socket(server)
	let users: HashOfStringKeyHash = {}
	io.on('connection', socket => {
        socket.on("private", function(data) {     
            let from
            for (var key in users) {
                if ( users[key]['socket'] == socket.id ) from = key
            }
            let createdAt:any = ''
            if (from != undefined) {
                const message = new Message({
                    from: from,
                    to: data.to,
                    message: data.msg
                })
                message.save()        
                createdAt = message.createdAt
            }
            if ( users[data.to] != undefined ) {
                const privateMsg = { from: from, to: data.to, msg: data.msg, createdAt: createdAt }
                io.to(`${users[data.to]['socket']}`).emit('private', privateMsg );
            }
        });
        socket.on("open-offline-user", function(data) {   
            User.findOne({ where: { id: data.userId } }).then(user => {
                if (user != undefined) {
                    let aInfo: StringKeyHash = {}
                    aInfo['id'] = user.id
                    aInfo['name'] = user.fullName()
                    aInfo['ts'] = Date.now()
                    const data = { user: aInfo }
                    io.to(`${socket.id}`).emit('open-offline-user', data );
                }
            })
        });
        socket.on("read-pm", function(data) {   
            let to
            for (var key in users) {
                if ( users[key]['socket'] == socket.id ) to = key
            }
            if ( to != undefined ) {
                const from = data.userId
                Message.findAll({
                    where: { from: from, to: to, isNew: true }
                }).then(msgs => {
                    msgs.forEach(function (msg, index) {
                        msg.isNew = false
                        msg.save()
                    });
                })
            }      
        });
		socket.on('start-chat-session', (authInfo: AuthInfo) => {
			let keyForRemove = null
			for (var key in users) {
				if ( key == authInfo.id ) {
					let aInfo: StringKeyHash = {}
					aInfo['id'] = authInfo.id
					let name = users[key]['name']
					if ( name == 'undefined undefined' ) name = authInfo.name					
					aInfo['name'] = name
                    aInfo['socket'] = socket.id
					aInfo['ts'] = Date.now()
					keyForRemove = key
					users[authInfo.id] = aInfo
				}
			}
			if ( keyForRemove == null) {
				let aInfo: StringKeyHash = {};
				aInfo['id'] = authInfo.id
				aInfo['name'] = authInfo.name
				aInfo['socket'] = socket.id
				aInfo['ts'] = Date.now()
				users[authInfo.id] = aInfo	
			}
            io.to(`${socket.id}`).emit('session-started', {} );
            const to = authInfo.id
            Message.findAll({
                order: [
                    ['createdAt', 'ASC'],
                ],
                where: { to: to, isNew: true }
            }).then(msgs => {
                msgs.forEach(function (msg, index) {
                    User.findOne({ where: { id: msg.from } }).then(user => {
                        const privateMsg = { from: msg.from, to: to, msg: msg.message, createdAt: msg.createdAt }
                        io.to(`${users[to]['socket']}`).emit('private', privateMsg );
                    })
                })
            })
        })
		socket.on('disconnect', () => {
            for (var key in users) {
                if ( users[key]['socket'] == socket.id ) delete users[key]
            }			
		})
	})
}

export { startSocket }