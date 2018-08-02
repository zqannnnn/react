import * as socket from 'socket.io' //1532692062 chat
import { AuthInfo } from '../../frontend/src/actions'
//https://socket.io/get-started/chat/
//https://codeburst.io/isomorphic-web-app-react-js-express-socket-io-e2f03a469cd3
interface SHash {
    [details: string] : any;
}
interface IHash {
  [details: string] : SHash;
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
        let aInfo: SHash = {};
        aInfo['id'] = authInfo.id
        aInfo['name'] = authInfo.name
        aInfo['ts'] = Date.now()
        users[socket.id] = aInfo
        let newUsers: IHash = {};
        for ( var key in users ) {
          let paste = true
          for ( var key1 in newUsers ) {
            if ( newUsers[key1]['id'] == users[key]['id'] && newUsers[key1]['ts'] > users[key]['ts'] ) {
              paste = false
            }
            if ( newUsers[key1]['id'] == users[key]['id'] && newUsers[key1]['ts'] < users[key]['ts'] ) {
              delete newUsers[key1]
            }
          }
          if (paste) newUsers[key] = users[key]
        }
        users = newUsers
        io.sockets.emit('get-users', users)
      })  
      socket.on('disconnect', () => {
        delete users[socket.id]
      })
    })    
}

export { startSocket }