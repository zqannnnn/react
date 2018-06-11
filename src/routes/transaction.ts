import * as express from 'express'
import * as i18n from 'i18next'
import { consts } from '../config/static'
import { authMiddleware } from '../middleware/auth'
import { IRequest } from '../middleware/auth'
import { Currency, Image, Transaction } from '../models/'
const router = express.Router()

router.use(authMiddleware)

router.get('/list', async (req: IRequest, res: express.Response) => {
  let transactions
  const selectType = req.query.selectType
  const buy = req.query.buy === 'true'
  const sell = req.query.sell === 'true'
  let typeOption: {
    type?: string
  }
  if (buy && !sell) {
    typeOption = {
      type: consts.TRANSACTION_TYPE_BUY
    }
  } else if (sell && !buy) {
    typeOption = {
      type: consts.TRANSACTION_TYPE_SELL
    }
  } else {
    typeOption = {}
  }
  try {
    if (selectType === 'mine') {
      transactions = await Transaction.findAll({
        where: {
          ...typeOption,
          userId: req.userId
        },
        include: [
          {
            model: Image,
            attributes: ['path', 'type']
          }
        ]
      })
    } else if (selectType === 'finished') {
      transactions = await Transaction.findAll({
        where: {
          ...typeOption,
          status: consts.TRANSACTION_STATUS_FINISHED
        },
        include: [
          {
            model: Image,
            attributes: ['path', 'type']
          }
        ]
      })
    } else {
      transactions = await Transaction.findAll({
        where: {
          ...typeOption,
          status: consts.TRANSACTION_STATUS_CREATED
        },
        include: [
          {
            model: Image,
            attributes: ['path', 'type']
          }
        ]
      })
    }
    return res.send(transactions)
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
          type: consts.IMAGE_TYPE_MEDIE
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
            type: consts.IMAGE_TYPE_MEDIE
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

export = router
