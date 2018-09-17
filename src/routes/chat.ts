// 1532692062 chat
import * as express from 'express'
import { authMiddleware, loginCheckMiddleware } from '../middleware/auth'
import { IRequest } from '../middleware/auth'
import { User, Message } from '../models/'
const sequelize = require('sequelize')
const router = express.Router()
import { StringKeyHash } from '../interfaces'

router.use(authMiddleware)

router.get('/users', async (req: IRequest, res: express.Response) => {
  // const type = req.query.type
  try {
    const findAllTo = Message.findAll({
      attributes: ['to', sequelize.fn('max', sequelize.col('created_at'))],
      group: ['to'],
      where: {
        from: req.userId
      },
      raw: true
    })
    const allUsers: StringKeyHash = {}
    const findAllFrom = Message.findAll({
      attributes: ['from', sequelize.fn('max', sequelize.col('created_at'))],
      group: ['from'],
      where: {
        to: req.userId
      },
      raw: true
    })
    const allMsgs = [await findAllTo, await findAllFrom]
    allMsgs[0].forEach((msg, index) => {
      if (allUsers[msg.to] === undefined) allUsers[msg.to] = msg.max
      if (allUsers[msg.to] !== undefined && allUsers[msg.to] < msg.max)
        allUsers[msg.to] = msg.max
    })
    allMsgs[1].forEach((msg, index) => {
      if (allUsers[msg.from] === undefined) allUsers[msg.from] = msg.max
      if (allUsers[msg.from] !== undefined && allUsers[msg.from] < msg.max)
        allUsers[msg.from] = msg.max
    })
    const allUsersSorted: StringKeyHash = {}
    const userIds = Object.keys(allUsers)
    userIds
      .sort((a, b) => {
        return allUsers[a] - allUsers[b]
      })
      .reverse()
      .forEach(k => {
        allUsersSorted[k] = allUsers[k]
      })
    const users = await User.findAll({
      attributes: { exclude: ['password', 'email'] },
      where: {
        id: userIds
      },
      raw: true
    })
    return res.send({ users, ids: userIds })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router.use(loginCheckMiddleware)

export { router }
