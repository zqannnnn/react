import * as express from 'express'
import * as i18n from 'i18next'
import * as jwt from 'jsonwebtoken'
import { AuthInfo } from '../../frontend/src/actions'
import { consts } from '../config/static'
import { app } from '../index'
import { authMiddleware } from '../middleware/auth'
import { IRequest } from '../middleware/auth'
import { Image, User } from '../models'
const router = express.Router()

router.post('/new', async (req, res) => {
  try {
    User.findOne({
      where: { email: req.body.email }
    }).then(user => {
      if (user) {
        return res.status(401).send({ error: i18n.t('Email has been used.') })
      }
    })
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userType: req.body.userType
    })
    await user.save()
    const token = jwt.sign(
      {
        id: user.id,
        userType: user.userType,
        password: user.password,
        licenseStatus: user.licenseStatus,
        preferredCurrencyCode: user.preferredCurrencyCode
      },
      app.get('secretKey'),
      { expiresIn: consts.EXPIRE_IN }
    )
    const data: AuthInfo = {
      token,
      id: user.id,
      licenseStatus: 0,
      isAdmin: user.userType === consts.USER_TYPE_ADMIN,
      preferredCurrencyCode: user.preferredCurrencyCode
    }
    return res.send(data)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router.use(authMiddleware)

router.get('/refresh/auth', async (req: IRequest, res: express.Response) => {
  User.findOne({
    where: { id: req.userId },
    attributes: ['userType', 'licenseStatus', 'preferredCurrencyCode']
  }).then(user => {
    if (!user) {
      return res.status(401).send({ error: i18n.t('Server error.') })
    }
    const authInfo: AuthInfo = {
      id: req.userId,
      preferredCurrencyCode: user.preferredCurrencyCode,
      licenseStatus: user.licenseStatus
    }
    if (user.userType === consts.USER_TYPE_ADMIN) {
      authInfo.isAdmin = true
    }
    res.send(authInfo)
  })
})
router.get('/list', async (req: IRequest, res: express.Response) => {
  if (req.isAdmin) {
    const users = await User.findAll({ attributes: { exclude: ['password'] } })
    return res.send(users)
  } else {
    return res.status(500).send({ error: i18n.t('Permission denied.') })
  }
})
router.get(
  '/unconfirmed/list',
  async (req: IRequest, res: express.Response) => {
    if (req.isAdmin) {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        where: { licenseStatus: consts.LICENSE_STATUS_UNCONFIRMED },
        include: [{ model: Image, attributes: ['path'] }]
      })
      return res.send(users)
    } else {
      return res.status(500).send({ error: i18n.t('Permission denied.') })
    }
  }
)
router.get('/confirm/:id', async (req: IRequest, res: express.Response) => {
  if (req.isAdmin) {
    const user = await User.find({ where: { id: req.params.id } })
    if (!user) {
      return res.status(500).send({ error: i18n.t('User does not exist.') })
    }
    user.licenseStatus = consts.LICENSE_STATUS_CONFIRMED
    await user.save()
    return res.send({ success: true })
  } else {
    return res.status(500).send({ error: i18n.t('Permission denied.') })
  }
})
router.get('/denie/:id', async (req: IRequest, res: express.Response) => {
  if (req.isAdmin) {
    const user = await User.find({ where: { id: req.params.id } })
    if (!user) {
      return res.status(500).send({ error: i18n.t('User does not exist.') })
    }
    user.licenseStatus = consts.LICENSE_STATUS_DENIED
    await user.save()
    return res.send({ success: true })
  } else {
    return res.status(500).send({ error: i18n.t('Permission denied.') })
  }
})
router
  .route('/:userId')
  .get(async (req: IRequest, res: express.Response) => {
    if (req.params.userId !== req.userId && !req.isAdmin) {
      return res.status(500).send({ error: i18n.t('Permission denied.') })
    }
    const user = await User.find({
      where: { id: req.params.userId },
      attributes: { exclude: ['password'] },
      include: [{ model: Image, attributes: ['path'] }]
    })
    if (!user) {
      return res.status(500).send({ error: i18n.t('User does not exist.') })
    }
    return res.send(user)
  })
  .put(async (req: IRequest, res: express.Response) => {
    if (req.params.userId !== req.userId && !req.isAdmin) {
      return res.status(500).send({ error: i18n.t('Permission denied.') })
    }
    try {
      const user = await User.find({ where: { id: req.params.userId } })
      if (!user) {
        return res.status(500).send({ error: i18n.t('User does not exist.') })
      }
      Object.keys(req.body).forEach(
        (key: string) => (user[key] = req.body[key])
      )
      user.save()
      await Image.destroy({ where: { userId: req.params.userId } })
      if (req.body.businessLicenses) {
        req.body.businessLicenses.forEach((image: { path: string }) => {
          const imageDb = new Image({
            path: image.path,
            userId: user.id
          })
          imageDb.save()
        })
      }
      return res.send({ success: true })
    } catch (e) {
      return res.status(500).send({ error: e.message })
    }
  })
  .delete(async (req: IRequest, res: express.Response) => {
    if (req.params.userId !== req.userId && !req.isAdmin) {
      return res.status(500).send({ error: i18n.t('Permission denied.') })
    }
    try {
      const user = await User.find({ where: { id: req.params.userId } })
      if (!user) {
        return res.status(500).send({ error: i18n.t('User does not exist.') })
      }
      user.isActive = false
      user.save()
      return res.send({ success: true })
    } catch (e) {
      return res.status(500).send({ error: e.message })
    }
  })

  export { router }
