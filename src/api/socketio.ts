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
            //if ( users[socket.id] != undefined ) {
                // && users[data.to] != undefined

                let from;
                for (var key in users) {
                    if ( users[key]['socket'] == socket.id ) {
                        from = key
                    }
                }
    
                if (from != undefined) {
                    const message = new Message({
                        from: from,
                        to: data.to,
                        message: data.msg
                    })
                    message.save()        
                }

                if ( users[data.to] != undefined ) {
                    //console.log('TO !!!!!!!!')
                    //console.log(users[data.to])
                    const privateMsg = { from: from, to: data.to, msg: data.msg }
                    io.to(`${users[data.to]['socket']}`).emit('private', privateMsg );
    
                }
                //const from = users[socket.id]['id']
                //const to = users[data.to]['id']
            //}      
        });
        /*
        socket.on("read-pm", function(data) {   
            //update all messages from data.user as read  
            if ( users[socket.id] != undefined ) {
                const to = users[socket.id]['id']
                const from = data.user['id']
                Message.findAll({
                    where: { from: from, to: to, isNew: true }
                }).then(msgs => {
                    msgs.forEach(function (msg, index) {
                        //msg.isNew = false
                        //msg.save()
                    });
                })
            }      
        });
        */
		socket.on('get-users', (authInfo: AuthInfo) => {
			let keyForRemove = null
			for (var key in users) {
				if ( key == authInfo.id ) {
					let aInfo: StringKeyHash = {};
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
            io.sockets.emit('get-users', users)
            /*
            const to = users[socket.id]['id']
            Message.findAll({
                order: [
                    ['createdAt', 'ASC'],
                ],
                where: { to: to, isNew: true }
            }).then(msgs => {
                msgs.forEach(function (msg, index) {
                    const user = User.findOne({ where: { id: msg.from } })
                })
            })
            */
            //console.log('get users!!!!!!!!!!!!!')
            //console.log(users)
		})
		socket.on('disconnect', () => {
			delete users[socket.id]
		})
	})
}

export { startSocket }