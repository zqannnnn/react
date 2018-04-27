import * as express from 'express'
import { authMiddleware } from '../middleware/auth'
import { IRequest } from '../middleware/auth'
import { Image, User } from '../models'
const router = express.Router()

router.post('/new', async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      userName: req.body.userName,
      userType: req.body.userType
    })
    await user.save()
    if (req.body.businessLicenses) {
      req.body.businessLicenses.forEach((image: {path: string}) => {
        const imageDb = new Image({
          path: image.path,
          userId: user.id
        })
        imageDb.save()
      })
    }
    return res.send({success: true})
  } catch (e) {
    return res.status(500).send({error: e.message})
  }
})

router.use(authMiddleware)

router.get('/list', async (req: IRequest, res: express.Response) => {
  if (req.isAdmin) {
    const users = await User.findAll({attributes: { exclude: ['password'] }})
    return res.send(users)
  } else {
    return res.status(500).send({error: 'Permission denied'})
  }
})
router.get('/unconfirmed/list', async (req: IRequest, res: express.Response) => {
  if (req.isAdmin) {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      where: {companyConfirmed: false, companyInfoFilled: true}
    })
    return res.send(users)
  } else {
    return res.status(500).send({error: 'Permission denied'})
  }
})

router.route('/:userId')
  .get(async (req: IRequest, res: express.Response) => {
    if (req.params.userId !== req.userId || !req.isAdmin) {
      return res.status(500).send({error: 'Permission denied'})
    }
    const user = await User.find({ where: { id: req.params.userId }, attributes: { exclude: ['password'] },
      include: [{model: Image, attributes: ['path']}
    ]})
    if (!user) {
      return res.status(500).send({error: 'User does not exist'})
    }
    return res.send(user)
  })
  .put(async (req: IRequest, res: express.Response) => {
    if (req.params.userId !== req.userId || !req.isAdmin) {
      return res.status(500).send({error: 'Permission denied'})
    }
    try {
      const user = await User.find({ where: { id: req.params.userId } })
      if (!user) {
        return res.status(500).send({error: 'User does not exist'})
      }
      Object.keys(req.body).forEach((key: string) => user[key] = req.body[key])
      user.save()
      await Image.destroy({where: {userId: req.params.userId}})
      if (req.body.businessLicenses) {
        req.body.businessLicenses.forEach((image: {path: string}) => {
          const imageDb = new Image({
            path: image.path,
            userId: user.id
          })
          imageDb.save()
        })
      }
      return res.send({success: true})
    } catch (e) {
      return res.status(500).send({error: e.message})
    }
  })
  .delete(async (req: IRequest, res: express.Response) => {
    if (req.params.userId !== req.userId || !req.isAdmin) {
      return res.status(500).send({error: 'Permission denied'})
    }
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
