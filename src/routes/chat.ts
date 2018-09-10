import * as express from 'express'
import * as i18n from 'i18next'
import { consts } from '../config/static'
import { authMiddleware, loginCheckMiddleware } from '../middleware/auth'
import { IRequest } from '../middleware/auth'
import { Comment, Currency, Goods, Image, Transaction, User } from '../models/'
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
/*
  if (sorting === 'new') {
    orderOption = ['createdAt', 'DESC']
  } else if (sorting === 'old') {
    orderOption = ['createdAt', 'ASC']
  }
  */
  try {
      /*
    const result = await Transaction.findAndCount({
      where: {
        ...whereOption
      },
      include: [
        {
          model: Goods,
          where: { ...goodsOption },
          include: [
            {
              model: Image,
              attributes: ['path', 'type']
            }
          ]
        },
        {
          model: User,
          as: 'taker',
          attributes: ['firstName', 'lastName', 'id']
        }
      ],
      ...pageOption,
      order: [orderOption]
    })
    */
    return res.send({ users: []})
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router.use(loginCheckMiddleware)

export { router }
