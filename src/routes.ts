import { Application, NextFunction, Request, Response } from 'express'
import * as i18n from 'i18next'
import * as jwt from 'jsonwebtoken'
import { PassportStatic } from 'passport'
import * as qs from 'querystring'
import { AuthInfo } from '../frontend/src/actions'
import { consts } from './config/static'
import { User } from './models'
import { UserFields } from './passport'
import {
  categoryRouter,
  currencyRouter,
  goodsRouter,
  passRouter,
  transactionRouter,
  chatRouter,
  uploadRouter,
  userRouter,
  consigneeRouter,
  countryRouter
} from './routes/index'

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
        token: jwt.sign(user.get(), app.get('secretKey'), {
          expiresIn: consts.TOKEN_EXPIRE_IN
        }),
        id: user.id,
        name: user.fullName()
      }
      if (user.userType === consts.USER_TYPE_ADMIN) {
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
        where: { email },
        attributes: UserFields
      })
      if (user != null && user.resetKey === key) {
        const data = {
          token: jwt.sign(
            user.get({
              plain: true
            }),
            app.get('secretKey'),
            { expiresIn: consts.TOKEN_EXPIRE_IN }
          ),
          id: user.id,
          isAdmin: user.isAdmin,
          preferredCurrencyCode: user.preferredCurrencyCode,
          licenseStatus: user.licenseStatus,
          route: 'resetPass'
        }
        if (user.userType === consts.USER_TYPE_ADMIN) {
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
  app.use('/chat', chatRouter)
  app.use('/upload', uploadRouter)
  app.use('/currency', currencyRouter)
  app.use('/goods', goodsRouter)
  app.use('/consignee', consigneeRouter)
  app.use('/country', countryRouter)
}
