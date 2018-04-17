const path = require('path')
const jwt = require('jsonwebtoken')

const consts = require('./config/static')
const Models = require('./models')
const User = Models.User
const userRouter = require('./routes/user')
const categoryRouter = require('./routes/category')
const currencyRouter = require('./routes/currency')
const offerRouter = require('./routes/offer')
const orderRouter = require('./routes/order')
const passRouter = require('./routes/pass')
const uploadRouter = require('./routes/upload')
const qs = require('querystring')
const authMiddleware = require('./middleware/auth')

const expiresIn = 60 * 60 * 24

const handleSequelizeError = (res, error) => {
  console.error(error)
  res.status(500).send({ error: error.message })
}

const handleSuccess = (res) => {
  res.json({ success: true })
}

module.exports = (app, passport) => {

  app.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
      if (err) {
        return next(err); // will generate a 500 error
      }
      // Generate a JSON response reflecting authentication status
      if (!user) {
        return res.send(401, { error: 'Incorrect email or password.' });
      }
      const data = {
        token: jwt.sign(user, app.get('secretKey'), { expiresIn }),
        id: user.id,
      }
      if (user.userType == 1) {
        data.isAdmin = true
      }
      res.send(data)
    })(req, res, next);
  });

  app.get('/pass/reset', async (req, res) => {
    const email = req.param('email')
    const key = req.param('key')
    if (email) {
      const user = await User.findOne({ where: { email: email } })
      if (user != null && user.resetKey == key) {
        const data = {
          token: jwt.sign(user.get({
            plain: true
          }), app.get('secretKey'), { expiresIn }),
          id: user.id,
          route: 'resetPass'
        }
        if (user.userType == 1) {
          data.isAdmin = true
        }
        return res.redirect('/#/?' + qs.stringify(data))
      }
      return res.redirect('/')
    }
  })
  app.use('/pass', passRouter)
  app.use('/user', userRouter);
  app.use('/category', categoryRouter);
  app.use('/offer', offerRouter);
  app.use('/order', orderRouter);
  app.use('/upload', uploadRouter);
  app.use('/currency', currencyRouter);
}
