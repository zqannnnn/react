import * as express from 'express'
import * as i18n from 'i18next'
import * as jwt from 'jsonwebtoken'
import { AuthInfo } from '../../frontend/src/actions'
import { consts } from '../config/static'
import { app } from '../index'
import { authMiddleware, loginCheckMiddleware } from '../middleware/auth'
import { IRequest } from '../middleware/auth'
import { Image, User, Consignee, Country } from '../models/'
import { UserFields } from '../passport'
const router = express.Router()
router.use(authMiddleware)
router.post('/new', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { email: req.body.email }
    })
    if (userData) {
      return res.status(401).send({ error: i18n.t('Email has been used.') })
    }
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
      preferredCurrencyCode: user.preferredCurrencyCode,
      name: user.fullName()
    }
    return res.send(data)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router.use(loginCheckMiddleware)

router.get('/refresh/auth', async (req: IRequest, res: express.Response) => {
  User.findOne({
    where: { id: req.userId },
    attributes: UserFields
  }).then(user => {
    if (!user) {
      return res
        .status(401)
        .send({ error: i18n.t('Login has expired, please login again.') })
    }
    const authInfo: AuthInfo = {
      id: req.userId,
      preferredCurrencyCode: user.preferredCurrencyCode,
      licenseStatus: user.licenseStatus,
      name: user.fullName()
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
        include: [{ model: Image, attributes: ['path'] }],
        where: { licenseStatus: consts.LICENSE_STATUS_UNCONFIRMED }
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
router.put(
  '/set/default/consignee',
  async (req: IRequest, res: express.Response) => {
    try {
      const user = await User.find({ where: { id: req.userId } })
      if (!user) {
        return res.status(500).send({ error: i18n.t('Permission denied.') })
      }
      user.defaultConsigneeId = req.query.id
      await user.save()
      return res.send({ success: true })
    } catch (e) {
      return res.status(500).send({ error: e.message })
    }
  }
)
router
  .route('/:userId')
  .get(async (req: IRequest, res: express.Response) => {
    const user = await User.find({
      where: { id: req.params.userId },
      attributes: { exclude: ['password'] },
      include: [
        { model: Image, attributes: ['path'] },
        { model: Consignee },
        { model: Country }
      ]
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
      const user = await User.find({
        where: { id: req.params.userId },
        attributes: { exclude: ['password'] }
      })
      if (!user) {
        return res.status(500).send({ error: i18n.t('User does not exist.') })
      }
      Object.keys(req.body).forEach(
        (key: string) => (user[key] = req.body[key])
      )
      await user.save()
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
