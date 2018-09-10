import * as express from 'express'
import * as i18n from 'i18next'
//import { consts } from '../config/static'
import { authMiddleware, loginCheckMiddleware } from '../middleware/auth'
import { IRequest } from '../middleware/auth'
import { User, Message } from '../models/'
const router = express.Router()

router.use(authMiddleware)

router.get('/users', async (req: IRequest, res: express.Response) => {
    const type = req.query.type
    const whereOption: {
        makerId?: string
        status?: number
        isMakerSeller?: boolean
    } = {}
    let orderOption: string[] = ['createdAt', 'DESC']
    //console.log(req)
    /*
      if (sorting === 'new') {
        orderOption = ['createdAt', 'DESC']
      } else if (sorting === 'old') {
        orderOption = ['createdAt', 'ASC']
      }
      */
    try {

        Message.findAll({
            attributes: ['to'], 
            group: ['to'],
            where: {
                from: req.userId,
            },
            //order: [orderOption]
        }).then(msgs => {
            console.log('!!!!!!!!!!!!!! users !!!!!!!!!!!!!!!!')
            let to: string[] = []
            msgs.forEach(function (msg, index) {
                to.push(msg.to)
            });
            console.log(to)
            Message.findAll({
                attributes: ['from'], 
                group: ['from'],
                where: {
                    to: req.userId,
                },
                //order: [orderOption]
            }).then(msgs => {
                console.log('!!!!!!!!!!!!!! users !!!!!!!!!!!!!!!!')
                let to: string[] = []
                msgs.forEach(function (msg, index) {
                    to.push(msg.from)
                });
                console.log(to)
                return res.send({ users: to })
            })
    



        })
        //console.log(pr)
        //return res.send({ users: [] })
    } catch (e) {
        return res.status(500).send({ error: e.message })
    }
})

router.use(loginCheckMiddleware)

export { router }
