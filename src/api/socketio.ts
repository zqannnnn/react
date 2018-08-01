import * as socket from 'socket.io' //1532692062 chat
import { AuthInfo } from '../../frontend/src/actions'
//https://socket.io/get-started/chat/
//https://codeburst.io/isomorphic-web-app-react-js-express-socket-io-e2f03a469cd3
interface IHash {
    [details: string] : AuthInfo;
}
const startSocket = async (server: any) => {
    const io = socket(server)
    let users: IHash = {};
    io.sockets.on('connection', function (socket) {
    })
    io.on('connection', socket => {
      socket.on('get-users', (authInfo: AuthInfo) => {
        //io.sockets.clients((error :any, clients :any) => {
        //});    
        users[socket.id] = authInfo
        io.sockets.emit('get-users', users)
      })  
      socket.on('disconnect', () => {
        delete users[socket.id]
      })
    })    
}

export { startSocket }