import * as express from 'express'
import { authMiddleware } from '../middleware/auth'
import { User } from '../models'

const router = express.Router()

router.use(authMiddleware)

router.get('/list', async (req, res) => {
  const users = await User.findAll()
  return res.send(users)
})

router.post('/new', async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      userName: req.body.userName
    })
    await user.save()
    return res.send({success: true})
  } catch (e) {
    return res.status(500).send({error: e.message})
  }
})

router.route('/:userId')
  .get(async (req: express.Request, res: express.Response) => {
    const user = await User.find({ where: { id: req.params.userId } })
    if (!user) {
      return res.status(403).send({error: 'User does not exist'})
    }
    return res.send(user)
  })
  .put(async (req: express.Request, res: express.Response) => {
    try {
      const user = await User.find({ where: { id: req.params.userId } })
      if (!user) {
        return res.status(500).send({error: 'User does not exist'})
      }
      Object.keys(req.body).forEach((key: string) => user[key] = req.body[key])
      user.save()
      return res.send({success: true})
    } catch (e) {
      return res.status(500).send({error: e.message})
    }
  })
  .delete(async (req: express.Request, res: express.Response) => {
    try {
      const user = await User.find({ where: { id: req.params.userId } })
      if (!user) {
        return res.status(500).send({error: 'User does not exist'})
      }
      user.isActive = false
      user.save()
      return res.send({success: true})
    } catch (e) {
      return res.status(500).send({error: e.message})
    }
  })

export = router
