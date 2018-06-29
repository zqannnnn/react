import * as express from 'express'
import * as path from 'path'
import * as morgan from 'morgan'
import * as bodyParser from 'body-parser'
import * as session from 'express-session'
import * as passport from 'passport'

import { initDatabase } from './models'
import { router } from './routes'
import { passportConfig } from './passport'
import { i18n, middleware } from './middleware/i18n'
import { webpackMiddleware } from './middleware/webpack'

const app = express()
webpackMiddleware(app)
app.use(middleware.handle(i18n))

initDatabase()
// Get the exchange rate API
// import { getApi as currencyApi } from './api/currency'
// currencyApi()
app.set('secretKey', 'just a test')

passportConfig(passport) // pass passport for configuration

// set up our express application
app.use(express.static(path.join(__dirname, '../public')))
app.use(morgan('dev')) // log every request to the console
app.use(bodyParser.json()) // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }))

// required for passport
app.use(
  session({
    secret: 'fun coding', // session secret
    resave: true,
    saveUninitialized: true
  })
)
app.use(passport.initialize())

// routes
router(app, passport) // load our routes and pass in our app and fully configured passport

//static
app.use('/static', express.static('./uploads'))

// launch
const port = process.env.PORT || 3000
app.listen(port, (err: string) => {
  if (err) console.log(err)
  console.log(`⚡ Express started on port ${port}, in ${process.env.NODE_ENV} mode`)
})
export { app }
