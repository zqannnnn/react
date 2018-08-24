import * as express from 'express'
import * as i18n from 'i18next'
import { consts } from '../config/static'
import { authMiddleware, loginCheckMiddleware } from '../middleware/auth'
import { IRequest } from '../middleware/auth'
import { Comment, Currency, Goods, Image, Transaction, User } from '../models/'
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
    pageOption.limit = pageSize
  }
  if (typeof keyword !== 'undefined') {
    goodsOption.title = { $like: `%${keyword}%` }
  }
  if (type === 'mine') {
    whereOption.makerId = req.userId
  } else if (type === 'finished') {
    whereOption.status = consts.TRANSACTION_STATUS_FINISHED
  } else if (type === 'waitting') {
    whereOption.status = consts.TRANSACTION_STATUS_TAKING
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
    return res.send({ transactions: result.rows, total: result.count })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router.use(loginCheckMiddleware)
router.post('/new', async (req: IRequest, res: express.Response) => {
  try {
    const transaction = new Transaction({
      makerId: req.userId,
      ...req.body
    })
    await transaction.save()
    Goods.find({
      where: { id: req.body.goodsId }
    }).then(goods => {
      if (!goods) {
        return res.status(500).send({ error: i18n.t('Goods does not exist.') })
      }
      goods.selling = true
      goods.save()
    })

    return res.send({ success: true })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router.post('/order/new', async (req: IRequest, res: express.Response) => {
  try {
    const goods = new Goods({
      creatorId: req.userId,
      ownerId: req.userId,
      ...req.body.goods
    })
    await goods.save()
    const transaction = new Transaction({
      makerId: req.userId,
      goodsId: goods.id,
      price: req.body.price,
      currencyCode: req.body.currencyCode
    })
    await transaction.save()
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

      const goods = await Goods.find({
        where: { id: transaction.goodsId }
      })
      if (!goods) {
        return res.status(500).send({ error: i18n.t('Goods does not exist.') })
      }
      goods.selling = false
      goods.ownerId = transaction.takerId
      goods.save()

      return res.send({ success: true })
    } catch (e) {
      return res.status(500).send({ error: e.message })
    }
  }
)
router.get(
  '/buy/:transactionId',
  async (req: IRequest, res: express.Response) => {
    try {
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
      transaction.status = consts.TRANSACTION_STATUS_TAKING
      transaction.takerId = req.userId
      transaction.save()

      return res.send({ success: true })
    } catch (e) {
      return res.status(500).send({ error: e.message })
    }
  }
)

router.get('/list/comment', async (req: IRequest, res: express.Response) => {
  const page = Number(req.query.page)
  const pageSize = Number(req.query.pageSize)
  const transactionId = String(req.query.transactionId)
  const pageOption: {
    offset?: number
    limit?: number
  } = {}
  const orderOption: string[] = ['createdAt', 'DESC']
  if (pageSize && typeof page !== 'undefined') {
    pageOption.offset = (page - 1) * pageSize
    pageOption.limit = pageSize
  }
  try {
    const result = await Comment.findAndCount({
      where: {
        transactionId,
        replyTo: null
      },
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName']
        }
      ],
      ...pageOption,
      order: [orderOption]
    })
    return res.send({ comments: result.rows, total: result.count })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router.get('/list/reply', async (req: IRequest, res: express.Response) => {
  const page = Number(req.query.page)
  const pageSize = Number(req.query.pageSize)
  const rootId = String(req.query.commentId)
  const pageOption: {
    offset?: number
    limit?: number
  } = {}
  const orderOption: string[] = ['createdAt', 'DESC']
  if (pageSize && typeof page !== 'undefined') {
    pageOption.offset = (page - 1) * pageSize
    pageOption.limit = pageSize
  }
  try {
    const result = await Comment.findAndCount({
      where: {
        rootId
      },
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName']
        }
      ],
      ...pageOption,
      order: [orderOption]
    })
    const replys = result.rows.filter(comment => comment.id !== rootId)
    return res.send({ replys, total: result.count })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router.post('/comment', async (req: IRequest, res: express.Response) => {
  try {
    const comment = new Comment({
      userId: req.userId,
      ...req.body
    })
    await comment.save()
    if (!comment.replyTo) {
      comment.rootId = comment.id
      await comment.save()
    }
    if (comment.replyTo) {
      const rootComment = await Comment.findById(comment.rootId)
      if (rootComment) {
        if (rootComment.totalReply) {
          rootComment.totalReply = rootComment.totalReply + 1
        } else {
          rootComment.totalReply = 1
        }
        await rootComment.save()
      }
    }

    const page = Number(req.query.page)
    const pageSize = Number(req.query.pageSize)
    const transactionId = comment.transactionId
    const pageOption: {
      offset?: number
      limit?: number
    } = {}
    if (pageSize && typeof page !== 'undefined') {
      pageOption.offset = (page - 1) * pageSize + comment.totalReply
      pageOption.limit = pageSize
    }
    const orderOption: string[] = ['createdAt', 'DESC']
    const result = await Comment.findAndCount({
      where: {
        transactionId,
        replyTo: null
      },
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName']
        }
      ],
      ...pageOption,
      order: [orderOption]
    })

    return res.send({ comments: result.rows, total: result.count })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router.post('/reply', async (req: IRequest, res: express.Response) => {
  try {
    const comment = new Comment({
      userId: req.userId,
      ...req.body
    })
    await comment.save()
    if (!comment.replyTo) {
      comment.rootId = comment.id
      await comment.save()
    }
    if (comment.replyTo) {
      const rootComment = await Comment.findById(comment.rootId)
      if (rootComment) {
        if (rootComment.totalReply) {
          rootComment.totalReply = rootComment.totalReply + 1
        } else {
          rootComment.totalReply = 1
        }
        await rootComment.save()
      }
    }

    return res.send(comment)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})

router
  .route('/:transactionId')
  .get(async (req: express.Request, res: express.Response) => {
    const transaction = await Transaction.find({
      where: {
        id: req.params.transactionId
      },
      include: [
        {
          model: Currency,
          attributes: ['code']
        },
        {
          model: User,
          as: 'maker',
          attributes: ['firstName', 'lastName', 'id']
        },
        {
          model: User,
          as: 'taker',
          attributes: ['firstName', 'lastName', 'id']
        },
        {
          model: Goods,
          include: [
            {
              model: Image,
              attributes: ['path', 'type']
            }
          ]
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
      if (transaction && transaction.makerId !== req.userId && !req.isAdmin) {
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
      if (transaction && transaction.makerId !== req.userId && !req.isAdmin) {
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
