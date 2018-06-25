import * as express from 'express'
import * as i18n from 'i18next'
import { consts } from '../config/static'
import { authMiddleware } from '../middleware/auth'
import { IRequest } from '../middleware/auth'
import { Currency, Goods, Image, Transaction } from '../models/'
const router = express.Router()

router.use(authMiddleware)

router.get('/list', async (req: IRequest, res: express.Response) => {
  const type = req.query.type
  const buy = req.query.buy === 'true'
  const sell = req.query.sell === 'true'
  const page = Number(req.query.page)
  const pageSize = Number(req.query.pageSize)
  const keyword = req.query.keyword
  const sorting = req.query.sorting
  const whereOption: {
    makerId?: string
    status?: number
    isMakerSeller?: boolean
  } = {}
  const goodsOption: {
    title?: { $like: string }
    category?: number
  } = {}
  const pageOption: {
    offset?: number
    limit?: number
  } = {}

  let orderOption: string[] = ['createdAt', 'DESC']

  if (buy && !sell) {
    whereOption.isMakerSeller = true
  } else if (sell && !buy) {
    whereOption.isMakerSeller = false
  }
  if (pageSize && typeof page !== 'undefined') {
    pageOption.offset = (page - 1) * pageSize
    pageOption.limit = (page - 1) * pageSize + pageSize
  }
  if (typeof keyword !== 'undefined') {
    goodsOption.title = { $like: `%${keyword}%` }
  }
  if (type === 'mine') {
    whereOption.makerId = req.userId
  } else if (type === 'finished') {
    whereOption.status = consts.TRANSACTION_STATUS_FINISHED
  } else {
    whereOption.status = consts.TRANSACTION_STATUS_CREATED
  }
  if (sorting === 'new') {
    orderOption = ['createdAt', 'DESC']
  } else if (sorting === 'old') {
    orderOption = ['createdAt', 'ASC']
  }
  try {
    const result = await Transaction.findAndCount({
      where: {
        ...whereOption
      },
      include: [
        {
          model: Image,
          attributes: ['path', 'type']
        },
        {
          model: Goods,
          where: { ...goodsOption }
        }
      ],
      ...pageOption,
      order: [orderOption]
    })
    return res.send({ transactions: result.rows, total: result.count })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router.post('/new', async (req: IRequest, res: express.Response) => {
  try {
    const transaction = new Transaction({
      userId: req.userId,
      ...req.body
    })
    await transaction.save()
    if (req.body.images) {
      req.body.images.forEach((image: { path: string }) => {
        const imageDb = new Image({
          path: image.path,
          transactionId: transaction.id,
          type: consts.IMAGE_TYPE_MEDIA
        })
        imageDb.save()
      })
    }
    if (req.body.certificates) {
      req.body.certificates.forEach((certificate: { path: string }) => {
        const imageDb = new Image({
          path: certificate.path,
          transactionId: transaction.id,
          type: consts.IMAGE_TYPE_CERTIFICATE
        })
        imageDb.save()
      })
    }
    return res.send({ success: true })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router.get(
  '/finish/:transactionId',
  async (req: IRequest, res: express.Response) => {
    try {
      if (!req.isAdmin) {
        return res.status(500).send({ error: i18n.t('Permission denied.') })
      }
      const transaction = await Transaction.find({
        where: {
          id: req.params.transactionId
        }
      })
      if (!transaction) {
        return res
          .status(500)
          .send({ error: i18n.t('Transaction does not exist.') })
      }
      transaction.status = consts.TRANSACTION_STATUS_FINISHED
      transaction.save()
      return res.send({ success: true })
    } catch (e) {
      return res.status(500).send({ error: e.message })
    }
  }
)
router.post(
  '/comment/:transactionId',
  async (req: IRequest, res: express.Response) => {
    try {
      if (!req.isAdmin) {
        return res.status(500).send({ error: i18n.t('Permission denied.') })
      }
      const transaction = await Transaction.find({
        where: {
          id: req.params.transactionId
        }
      })
      if (!transaction) {
        return res
          .status(500)
          .send({ error: i18n.t('Transaction does not exist.') })
      }
      transaction.comment = req.body.comment
      transaction.save()
      return res.send({ success: true })
    } catch (e) {
      return res.status(500).send({ error: e.message })
    }
  }
)
router
  .route('/:transactionId')
  .get(async (req: express.Request, res: express.Response) => {
    const transaction = await Transaction.find({
      where: {
        id: req.params.transactionId
      },
      include: [
        {
          model: Image,
          attributes: ['path', 'type']
        },
        {
          model: Currency,
          attributes: ['code']
        }
      ]
    })
    if (!transaction) {
      return res
        .status(403)
        .send({ error: i18n.t('Transaction does not exist.') })
    }
    return res.send(transaction)
  })
  .put(async (req: IRequest, res: express.Response) => {
    try {
      const transaction = await Transaction.find({
        where: {
          id: req.params.transactionId
        }
      })
      if (transaction && transaction.userId !== req.userId && !req.isAdmin) {
        return res.status(500).send({ error: i18n.t('Permission denied.') })
      }
      if (!transaction) {
        return res
          .status(500)
          .send({ error: i18n.t('Transaction does not exist.') })
      }
      Object.keys(req.body).forEach(
        (key: string) => (transaction[key] = req.body[key])
      )
      transaction.save()
      await Image.destroy({
        where: {
          transactionId: req.params.transactionId
        }
      })
      if (req.body.images) {
        req.body.images.forEach((image: { path: string }) => {
          const imageDb = new Image({
            path: image.path,
            transactionId: transaction.id,
            type: consts.IMAGE_TYPE_MEDIA
          })
          imageDb.save()
        })
      }
      if (req.body.certificates) {
        req.body.certificates.forEach((certificate: { path: string }) => {
          const imageDb = new Image({
            path: certificate.path,
            transactionId: transaction.id,
            type: consts.IMAGE_TYPE_CERTIFICATE
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
    try {
      const transaction = await Transaction.find({
        where: {
          id: req.params.transactionId
        }
      })
      if (transaction && transaction.userId !== req.userId && !req.isAdmin) {
        return res.status(500).send({ error: i18n.t('Permission denied.') })
      }
      if (!transaction) {
        return res
          .status(500)
          .send({ error: i18n.t('Transaction does not exist.') })
      }
      transaction.status = consts.TRANSACTION_STATUS_CANCELLED
      transaction.save()
      return res.send({ success: true })
    } catch (e) {
      return res.status(500).send({ error: e.message })
    }
  })

export { router }
