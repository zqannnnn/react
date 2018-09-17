import * as express from 'express'
import * as i18n from 'i18next'
import * as nodemailer from 'nodemailer'
import { smtpConfig } from '../config/email'
import { authMiddleware, loginCheckMiddleware } from '../middleware/auth'
import { IRequest } from '../middleware/auth'
import { User } from '../models/user'
import { makeRandomString } from '../util'
const router = express.Router()

router.use(authMiddleware)
const transporter = nodemailer.createTransport(smtpConfig)
function genMessage(resetUrl: string, email: string) {
  const ourName = 'SITE_NAME'
  return {
    from: '', // sender address
    to: email, // list of receivers
    subject: i18n.t('Reset Password'), // Subject line
    /* tslint:disable:max-line-length */
    text: '', // plain text body
    html: i18n.t('reset-password-email', { ourName, email, resetUrl })
    /* tslint:enable:max-line-length */
  }
}
router.post('/lost', async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } })
    if (user != null) {
      const randomKey = makeRandomString(15)
      const resetUrl =
        'http://' +
        req.headers.host +
        '/reset/pass?key=' +
        randomKey +
        '&email=' +
        req.body.email
      user.resetKey = randomKey
      await user.save()
      transporter.sendMail(
        genMessage(resetUrl, req.body.email),
        (error, info) => {
          if (error) {
            return res.status(500).send({ error: error.message })
          }
          return res.send({ success: true })
        }
      )
    } else {
      return res
        .status(500)
        .send({ error: i18n.t('Can\'t find this email address.') })
    }
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router.use(loginCheckMiddleware)
router.post('/reset', async (req: IRequest, res: express.Response) => {
  try {
    const user = await User.findOne({ where: { id: req.userId } })
    if (user != null) {
      user.password = req.body.password
      await User.hashPassword(user)
      await user.save()
      return res.send({ success: true })
    }
    return res.status(500).send({ error: i18n.t('Invalid Operation.') })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
export { router }
