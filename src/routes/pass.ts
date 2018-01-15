import * as express from 'express'
import * as qs from 'querystring'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/user';
import * as nodemailer from 'nodemailer'
import { smtpConfig } from '../config/email'
import { makeRandomString } from '../util'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

  
const transporter = nodemailer.createTransport(smtpConfig)
function genMessage(resetUrl: string, email: string) {
    const ourName = "bounty-management-platform"
    return {
        from: '', // sender address
        to: email, // list of receivers
        subject: 'Reset Password', // Subject line
        text: '', // plain text body
        html: `<html>
            <body>
                <br>Someone requested to reset the password for the ${ourName} account at ${email}.<br> 
                <br>Please click this link to reset your password:<br>
                <br><a href="${resetUrl}" target="_blank">Reset Password</a><br>
                <br>
                <br>If clicking the link doesn't work,you can copy and paste the link below into your browser's address window 
                <p style="font-size:14px; line-height: 20px; word-wrap: break-word; overflow-wrap: break-word;"><a href="${resetUrl}">${resetUrl}</a></p>
                <br>If you did not make this request, please ignore this email and your password will not be reset.
                <br>
                <p>Sincerely yours<p>
                <a href="">${ourName}</a>
            </body>\
        </html>`
    }
}
router.post('/lost', async (req: express.Request, res: express.Response) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } })
        if (user != null) {
            const randomKey = makeRandomString(15);
            const resetUrl = 'http://' + req.headers.host + '/#/reset/pass?key=' + randomKey + '&email=' + req.body.email
            user.resetKey = randomKey
            await user.save()
            transporter.sendMail(genMessage(resetUrl, req.body.email), (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send({ error: error.message })
                }
            });
            return res.send({ success: true })
        }
        return res.status(500).send({ error: "Can't find this email adress." })
    } catch (e) {
        return res.status(500).send({ error: e.message })
    }
})

router.use(authMiddleware)
interface Request extends express.Request {
    userId: string
}
router.post('/reset', async (req: Request, res: express.Response) => {
    try {
        const user = await User.findOne({ where: { id: req.userId } })
        if (user != null) {
            user.password = req.body.password
            await user.save()
            return res.send({ success: true })
        }
        return res.status(500).send({ error: "Invaild Operation." })
    } catch (e) {
        console.log(e)
        return res.status(500).send({ error: e.message })
    }
})
export = router