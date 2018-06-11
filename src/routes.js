const path = require('path')
const jwt = require('jsonwebtoken')
const i18n = require('i18next')
const consts = require('./config/static')
const Models = require('./models')
const User = Models.User
const userRouter = require('./routes/user')
const categoryRouter = require('./routes/category')
const currencyRouter = require('./routes/currency')
const transactionRouter = require('./routes/transaction')
const passRouter = require('./routes/pass')
const uploadRouter = require('./routes/upload')
const qs = require('querystring')
const authMiddleware = require('./middleware/auth')

import { consts } from './config/static'

const handleSequelizeError = (res, error) => {
  console.error(error)
  res.status(500).send({ error: error.message })
}

const handleSuccess = res => {
  res.json({ success: true })
}

module.exports = (app, passport) => {
  app.post('/login', (req, res, next) => {
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
      const data = {
        token: jwt.sign(user, app.get('secretKey'), consts.EXPIREMENT),
        id: user.id
      }
      if (user.userType == 1) {
        data.isAdmin = true
      }
      data.licenseStatus = user.licenseStatus
      res.send(data)
    })(req, res, next)
  })

  app.get('/reset/pass', async (req, res) => {
    const email = req.param('email')
    const key = req.param('key')
    if (email) {
      const user = await User.findOne({ where: { email: email } })
      if (user != null && user.resetKey == key) {
        const data = {
          token: jwt.sign(
            user.get({
              plain: true
            }),
            app.get('secretKey'),
            { expiresIn }
          ),
          id: user.id,
          route: 'resetPass'
        }
        if (user.userType == 1) {
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
