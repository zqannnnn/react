import * as socket from 'socket.io' //1532692062 chat
//https://socket.io/get-started/chat/
//https://codeburst.io/isomorphic-web-app-react-js-express-socket-io-e2f03a469cd3
interface IHash {
    [details: string] : string;
}
const startSocket = async (server: any) => {
    const io = socket(server)
    let users: IHash = {};
    io.sockets.on('connection', function (socket) {
    })
    io.on('connection', socket => {
      socket.on('get-users', (email) => {
        //io.sockets.clients((error :any, clients :any) => {
        //});    
        users[socket.id] = email
        io.sockets.emit('get-users', users)
      })  
      socket.on('disconnect', () => {
        delete users[socket.id]
      })
    })    
}

export { startSocket }