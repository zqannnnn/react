import * as express from 'express'
import { authMiddleware } from '../middleware/auth'
import { Order,User } from '../models'
import { consts } from '../config/static';
const router = express.Router()

router.use(authMiddleware)

interface Request extends express.Request {
  userId: string
}

router.post('/new', async (req: Request, res: express.Response) => {
  try {
    const order = new Order({
      userId: req.userId,
      ...req.body
    })
    await order.save()
    return res.send({ success: true })
  } catch (e) {
    return res.status(500).send({ error: e.message })
  }
})
router.get('/list/my', async (req:Request, res:express.Response) => {
  try {
    let orders = await Order.findAll({
      where:{
        userId: req.userId,
        status:consts.ORDER_STATUS_CREATED
      }
    })
    return res.send(orders)
  } catch (e) {
    return res.status(500).send({error: e.message})
  }
})
router.get('/list/all', async (req:Request, res:express.Response) => {
  try {
    let orders = await Order.findAll({
      where:{
        status:consts.ORDER_STATUS_CREATED
      }
    })
    return res.send(orders)
  } catch (e) {
    return res.status(500).send({error: e.message})
  }
})
router.route('/:orderId')
  .get(async (req: Request, res: express.Response) => {
    const order = await Order.find({ where: { id: req.params.orderId } })
    if(order&&order.userId!=req.userId){
      return res.status(500).send({error: 'Permission denied'})
    }
    if (!order) {
      return res.status(403).send({error: 'Order does not exist'})
    }
    return res.send(order)
  })
  .put(async (req: Request, res: express.Response) => {
    try {
      const order = await Order.find({ where: { id: req.params.orderId } })
      if(order&&order.userId!=req.userId){
        return res.status(500).send({error: 'Permission denied'})
      }
      if (!order) {
        return res.status(500).send({error: 'Order does not exist'})
      }
      Object.keys(req.body).forEach((key: string) => order[key] = req.body[key])
      order.save()
      return res.send({success: true})
    } catch (e) {
      return res.status(500).send({error: e.message})
    }
  })
  .delete(async (req: Request, res: express.Response) => {
    try {
      const order = await Order.find({ where: { id: req.params.orderId } })
      if(order&&order.userId!=req.userId){
        return res.status(500).send({error: 'Permission denied'})
      }
      if (!order) {
        return res.status(500).send({error: 'Order does not exist'})
      }
      order.status = consts.ORDER_STATUS_CANCELLED
      order.save();
      return res.send({success: true})
    } catch (e) {
      return res.status(500).send({error: e.message})
    }
  })

export = router