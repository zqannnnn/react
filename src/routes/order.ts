import * as express from 'express'
import { consts } from '../config/static'
import { authMiddleware } from '../middleware/auth'
import { IRequest } from '../middleware/auth'
import { Currency, Order } from '../models/'
const router = express.Router()

router.use(authMiddleware)

router.post('/new', async (req: IRequest, res: express.Response) => {
  try {
    const order = new Order({
      userId: req.userId,
      ...req.body,
    })
    await order.save()
    return res.send({ success: true })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
router.get('/list', async (req: IRequest, res: express.Response) => {
  let orders
  const selectType = req.query.selectType
  try {
    if (selectType === 'mine') {
      orders = await Order.findAll({
        where: {
          userId: req.userId,
        },
      })
    } else if (selectType === 'finished') {
      orders = await Order.findAll({
        where: {
          status: consts.ORDER_STATUS_FINISHED,
        },
      })
    } else {
      orders = await Order.findAll({
        where: {
          status: consts.ORDER_STATUS_CREATED,
        },
      })
    }
    return res.send(orders)
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
router.get('/finish/:orderId', async (req: IRequest, res: express.Response) => {
  try {
    if (!req.isAdmin) {
      return res.status(500).send({ error: 'Permission denied' })
    }
    const order = await Order.find({ where: { id: req.params.orderId } })
    if (!order) {
      return res.status(500).send({ error: 'Order does not exist' })
    }
    order.status = consts.ORDER_STATUS_FINISHED
    order.save()
    return res.send({ success: true })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
router.post(
  '/comment/:orderId',
  async (req: IRequest, res: express.Response) => {
    try {
      if (!req.isAdmin) {
        return res.status(500).send({ error: 'Permission denied.' })
      }
      const order = await Order.find({ where: { id: req.params.orderId } })
      if (!order) {
        return res.status(500).send({ error: 'Order does not exist' })
      }
      order.comment = req.body.comment
      order.save()
      return res.send({ success: true })
    } catch (e) {
      return res.status(500).send({ error: e.message })
    }
  }
)
router
  .route('/:orderId')
  .get(async (req: IRequest, res: express.Response) => {
    const order = await Order.find({
      where: { id: req.params.orderId },
      include: [{ model: Currency, attributes: ['code'] }],
    })
    if (!order) {
      return res.status(403).send({ error: 'Order does not exist' })
    }
    return res.send(order)
  })
  .put(async (req: IRequest, res: express.Response) => {
    try {
      const order = await Order.find({ where: { id: req.params.orderId } })
      if (order && order.userId !== req.userId && !req.isAdmin) {
        return res.status(500).send({ error: 'Permission denied' })
      }
      if (!order) {
        return res.status(500).send({ error: 'Order does not exist' })
      }
      Object.keys(req.body).forEach(
        (key: string) => (order[key] = req.body[key])
      )
      order.save()
      return res.send({ success: true })
    } catch (e) {
      return res.status(500).send({ error: e.message })
    }
  })
  .delete(async (req: IRequest, res: express.Response) => {
    try {
      const order = await Order.find({ where: { id: req.params.orderId } })
      if (order && order.userId !== req.userId && !req.isAdmin) {
        return res.status(500).send({ error: 'Permission denied' })
      }
      if (!order) {
        return res.status(500).send({ error: 'Order does not exist' })
      }
      order.status = consts.ORDER_STATUS_CANCELLED
      order.save()
      return res.send({ success: true })
    } catch (e) {
      return res.status(500).send({ error: e.message })
    }
  })

export = router
