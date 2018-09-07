// 1532692062 chat
import * as socket from 'socket.io'
import { AuthInfo } from '../../frontend/src/actions'
import { StringKeyHash, HashOfStringKeyHash } from '../interfaces'
import { Message, User } from '../models/'
// https://socket.io/get-started/chat/
// https://codeburst.io/isomorphic-web-app-react-js-express-socket-io-e2f03a469cd3
const startSocket = async (server: any) => {
  const io = socket(server)
  const users: HashOfStringKeyHash = {}
  io.on('connection', socket => {
    socket.on('private', function(data) {
      let from
      for (const key in users) {
        if (users[key].socket == socket.id) from = key
      }
      let createdAt: any = ''
      let message
      if (from != undefined) {
        message = new Message({
          from,
          to: data.to,
          message: data.msg
        })
        message.save()
        createdAt = message.createdAt
      }
      if (users[data.to] != undefined && message != undefined) {
        const privateMsg = {
          id: message.id,
          from,
          to: data.to,
          msg: data.msg,
          createdAt,
          isNew: true
        }
        io.to(`${users[data.to].socket}`).emit('private', privateMsg)
        io.to(`${socket.id}`).emit('private', privateMsg)
      }
    })
    socket.on('get-user', function(data) {
      User.findOne({ where: { id: data.userId } }).then(user => {
        if (user != undefined) {
          const aInfo: StringKeyHash = {}
          aInfo.id = user.id
          aInfo.name = user.fullName()
          aInfo.ts = Date.now()
          const sendData = { user: aInfo, open: data.open }
          io.to(`${socket.id}`).emit('get-user', sendData)
        }
      })
    })
    socket.on('set-messages-as-old', function(data) {
      let to
      for (const key in users) {
        if (users[key].socket == socket.id) to = key
      }
      if (to != undefined) {
        const from = data.userId
        Message.findAll({
          where: { from, to, isNew: true }
        }).then(msgs => {
          const sendData = { messages: [] as string[] }
          msgs.forEach(function(msg, index) {
            msg.isNew = false
            msg.save()
            sendData.messages.push(msg.id)
          })
          io.to(`${socket.id}`).emit('old-messages', sendData)
        })
      }
    })
    socket.on('get-unread-messages', (authInfo: AuthInfo) => {
      if (authInfo != null) {
        const to = authInfo.id
        Message.findAll({
          order: [['createdAt', 'ASC']],
          where: { to, isNew: true }
        }).then(msgs => {
          const privateMsgs: any[] = []
          msgs.forEach(function(msg, index) {
            User.findOne({ where: { id: msg.from } }).then(user => {
              const privateMsg = {
                id: msg.id,
                from: msg.from,
                to,
                msg: msg.message,
                createdAt: msg.createdAt,
                isNew: msg.isNew
              }
              privateMsgs.push(privateMsg)
            })
          })
          io.to(`${users[to].socket}`).emit('private-batch', privateMsgs)
        })
      }
    })
    socket.on('get-previous-messages', data => {
      let from: string = ''
      for (const key in users) {
        if (users[key].socket == socket.id) from = key
      }
      if (from != '') {
        let createdAt = data.createdAt
        let limit = 5
        if (createdAt === undefined) {
          createdAt = Date.now()
          limit = 20
        }
        const to = data.to
        Message.findAll({
          where: {
            from: [from, to],
            to: [from, to],
            isNew: false,
            created_at: {
              lt: createdAt
            }
          },
          order: [['created_at', 'DESC']],
          limit
        }).then(msgs => {
          const privateMsgs: any[] = []
          msgs.forEach(function(msg, index) {
            const privateMsg = {
              id: msg.id,
              from: msg.from,
              to: msg.to,
              msg: msg.message,
              createdAt: msg.createdAt,
              isNew: msg.isNew
            }
            privateMsgs.push(privateMsg)
          })
          io.to(`${users[from].socket}`).emit('private-batch', privateMsgs)
        })
      }
    })
    socket.on('start-chat-session', (authInfo: AuthInfo) => {
      let keyForRemove = null
      for (const key in users) {
        if (key == authInfo.id) {
          const aInfo: StringKeyHash = {}
          aInfo.id = authInfo.id
          let name = users[key].name
          if (name == 'undefined undefined') name = authInfo.name
          aInfo.name = name
          aInfo.socket = socket.id
          aInfo.ts = Date.now()
          keyForRemove = key
          users[authInfo.id] = aInfo
        }
      }
      if (keyForRemove == null) {
        const aInfo: StringKeyHash = {}
        aInfo.id = authInfo.id
        aInfo.name = authInfo.name
        aInfo.socket = socket.id
        aInfo.ts = Date.now()
        users[authInfo.id] = aInfo
      }
      io.to(`${socket.id}`).emit('session-started', {})
    })
    socket.on('disconnect', () => {
      for (const key in users) {
        if (users[key].socket == socket.id) delete users[key]
      }
    })
  })
}

export { startSocket }
