import * as jwt from 'jsonwebtoken'
import * as i18n from 'i18next'
import * as qs from 'querystring'
import { Application, Response, Request, NextFunction } from 'express'
import { PassportStatic } from 'passport'
import {
  userRouter,
  categoryRouter,
  currencyRouter,
  transactionRouter,
  passRouter,
  uploadRouter
} from './routes/index'
import { User } from './models'
import { consts } from './config/static'
import { AuthInfo } from '../frontend/src/actions'

// const handleSequelizeError = (res, error) => {
//   console.error(error)
//   res.status(500).send({ error: error.message })
// }

// const handleSuccess = res => {
//   res.json({ success: true })
// }

export const router = (app: Application, passport: PassportStatic) => {
  app.post('/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local-login', (err, user, info) => {
      if (err) {
        return next(err) // will generate a 500 error
      }
      // Generate a JSON response reflecting authentication status
      if (!user) {
        return res
          .status(401)
          .send({ error: i18n.t('Incorrect email or password.') })
      }
      const data: AuthInfo = {
        token: jwt.sign(user, app.get('secretKey'), {
          expiresIn: consts.EXPIRE_IN
        }),
        id: user.id
      }
      if (user.userType == consts.USER_TYPE_ADMIN) {
        data.isAdmin = true
      }
      data.preferredCurrencyCode = user.preferredCurrencyCode
      data.licenseStatus = user.licenseStatus
      res.send(data)
    })(req, res, next)
  })

  app.get('/reset/pass', async (req: Request, res: Response) => {
    const email = req.param('email')
    const key = req.param('key')
    if (email) {
      const user = await User.findOne({
        where: { email: email },
        attributes: [
          'id',
          'userType',
          'licenseStatus',
          'preferredCurrencyCode',
          'password'
        ]
      })
      if (user != null && user.resetKey == key) {
        const data = {
          token: jwt.sign(
            user.get({
              plain: true
            }),
            app.get('secretKey'),
            { expiresIn: consts.EXPIRE_IN }
          ),
          id: user.id,
          isAdmin: user.isAdmin,
          preferredCurrencyCode: user.preferredCurrencyCode,
          licenseStatus: user.licenseStatus,
          route: 'resetPass'
        }
        if (user.userType == consts.USER_TYPE_ADMIN) {
          data.isAdmin = true
        }
        return res.redirect('/#/reset/pass/?' + qs.stringify(data))
      }
      return res.redirect('/')
    }
  })
  app.use('/pass', passRouter)
  app.use('/user', userRouter)
  app.use('/category', categoryRouter)
  app.use('/transaction', transactionRouter)
  app.use('/upload', uploadRouter)
  app.use('/currency', currencyRouter)
}
